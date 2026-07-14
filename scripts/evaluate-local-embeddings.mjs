#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const fixturePath = process.argv[2];
if (!fixturePath) {
  console.error("Usage: node scripts/evaluate-local-embeddings.mjs <30-case.jsonl>");
  process.exit(1);
}

const cases = (await readFile(fixturePath, "utf8"))
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
if (cases.length !== 30) throw new Error("Expected exactly 30 cases, received " + cases.length);

const endpoints = [
  {
    provider: "local",
    baseURL: process.env.LOCAL_EMBEDDING_BASE_URL,
    key: process.env.LOCAL_EMBEDDING_API_KEY || "local",
    model: process.env.LOCAL_EMBEDDING_MODEL,
  },
  {
    provider: "openai",
    baseURL: "https://api.openai.com/v1",
    key: process.env.OPENAI_API_KEY,
    model: process.env.EVAL_OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  },
];

function cosine(left, right) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] ** 2;
    rightNorm += right[index] ** 2;
  }
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

const rows = [];
for (const item of cases) {
  for (const endpoint of endpoints) {
    if (!endpoint.baseURL || !endpoint.key || !endpoint.model) {
      throw new Error("Missing " + endpoint.provider + " embedding evaluation configuration");
    }
    const started = performance.now();
    const response = await fetch(endpoint.baseURL.replace(/\/$/, "") + "/embeddings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + endpoint.key,
      },
      body: JSON.stringify({
        model: endpoint.model,
        input: [item.query, item.positive, item.negative],
      }),
      signal: AbortSignal.timeout(60_000),
    });
    const body = await response.json();
    const vectors = body.data?.map((entry) => entry.embedding) || [];
    const valid = response.ok && vectors.length === 3 && vectors.every((vector) => vector.length > 0);
    const positiveScore = valid ? cosine(vectors[0], vectors[1]) : null;
    const negativeScore = valid ? cosine(vectors[0], vectors[2]) : null;
    rows.push({
      id: item.id,
      provider: endpoint.provider,
      latencyMs: Math.round(performance.now() - started),
      dimensions: valid ? vectors[0].length : 0,
      positiveScore,
      negativeScore,
      retrievalPass: valid && positiveScore > negativeScore,
      error: response.ok ? null : body.error?.message || response.statusText,
    });
  }
}

const summary = Object.fromEntries(endpoints.map(({ provider }) => {
  const providerRows = rows.filter((row) => row.provider === provider);
  const latencies = providerRows.map((row) => row.latencyMs).sort((a, b) => a - b);
  return [provider, {
    recallAt1: providerRows.filter((row) => row.retrievalPass).length / cases.length,
    p95Ms: latencies[Math.ceil(latencies.length * 0.95) - 1],
    dimensions: [...new Set(providerRows.map((row) => row.dimensions).filter(Boolean))],
  }];
}));

console.log(JSON.stringify({
  feature: "embedding",
  cases: cases.length,
  summary,
  localComparableToOpenAI: summary.local.recallAt1 >= summary.openai.recallAt1,
  rows,
}, null, 2));
