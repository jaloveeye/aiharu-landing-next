#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const [feature, fixturePath] = process.argv.slice(2);
if (!feature || !fixturePath) {
  console.error("Usage: node scripts/evaluate-local-ai.mjs <feature> <30-case.jsonl>");
  process.exit(1);
}

const cases = (await readFile(fixturePath, "utf8"))
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
if (cases.length !== 30) throw new Error(`Expected exactly 30 cases, received ${cases.length}`);

const endpoints = [
  { provider: "local", baseURL: process.env.LOCAL_LLM_BASE_URL, key: process.env.LOCAL_LLM_API_KEY || "local", model: process.env.LOCAL_LLM_MODEL },
  { provider: "openai", baseURL: "https://api.openai.com/v1", key: process.env.OPENAI_API_KEY, model: process.env.EVAL_OPENAI_MODEL || "gpt-4o-mini" },
];

const rows = [];
for (const item of cases) {
  for (const endpoint of endpoints) {
    if (!endpoint.baseURL || !endpoint.key || !endpoint.model) throw new Error(`Missing ${endpoint.provider} evaluation configuration`);
    const started = performance.now();
    const response = await fetch(`${endpoint.baseURL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${endpoint.key}` },
      body: JSON.stringify({ model: endpoint.model, messages: item.messages, temperature: 0 }),
      signal: AbortSignal.timeout(60_000),
    });
    const body = await response.json();
    rows.push({
      id: item.id,
      feature,
      provider: endpoint.provider,
      latencyMs: Math.round(performance.now() - started),
      formatValid: response.ok && Boolean(body.choices?.[0]?.message?.content),
      output: body.choices?.[0]?.message?.content || null,
      error: response.ok ? null : body.error?.message || response.statusText,
    });
  }
}

const localLatencies = rows.filter((row) => row.provider === "local").map((row) => row.latencyMs).sort((a, b) => a - b);
const p95 = localLatencies[Math.ceil(localLatencies.length * 0.95) - 1];
const formatRate = rows.filter((row) => row.provider === "local" && row.formatValid).length / cases.length;
console.log(JSON.stringify({ feature, cases: cases.length, localFormatRate: formatRate, localP95Ms: p95, gate: { formatPass: formatRate >= 0.95, latencyPass: p95 <= 30_000 }, rows }, null, 2));
