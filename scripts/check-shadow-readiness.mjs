#!/usr/bin/env node

const operations = ["generate-daily-prompt", "collect-ai-news"];
const daysRequired = 7;

function koreaDate(offsetDays = 0) {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  now.setUTCDate(now.getUTCDate() + offsetDays);
  return now.toISOString().slice(0, 10);
}

const requiredDates = Array.from({ length: daysRequired }, (_, index) =>
  koreaDate(index - daysRequired + 1),
);

async function loadRows() {
  const fixtureIndex = process.argv.indexOf("--fixture");
  if (fixtureIndex >= 0) {
    const { readFile } = await import("node:fs/promises");
    return JSON.parse(await readFile(process.argv[fixtureIndex + 1], "utf8"));
  }
  const baseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseURL || !key) throw new Error("Supabase service environment is required");
  const query = new URLSearchParams({
    select: "operation,run_date,status,executor,published_at,target_at,models,moderation_result,retry_count,fallback_count,failure_notified_at",
    run_date: `gte.${requiredDates[0]}`,
    order: "run_date.asc",
  });
  const response = await fetch(`${baseURL.replace(/\/$/, "")}/rest/v1/operation_runs?${query}`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`Supabase readiness query failed: ${response.status}`);
  return response.json();
}

const rows = await loadRows();
const checks = requiredDates.flatMap((date) =>
  operations.map((operation) => {
    const row = rows.find((item) => item.run_date === date && item.operation === operation);
    const modelsValid = Array.isArray(row?.models) && row.models.length > 0 &&
      row.models.every((model) => model.checksum && model.checksum !== "unknown");
    const moderationRecorded = row?.moderation_result && Object.keys(row.moderation_result).length > 0;
    const beforeTarget = Boolean(row?.published_at && row?.target_at && Date.parse(row.published_at) <= Date.parse(row.target_at));
    const passed = Boolean(
      row && row.status === "completed" && row.executor === "local" && beforeTarget && modelsValid &&
      moderationRecorded && (row.fallback_count || 0) === 0,
    );
    return {
      date,
      operation,
      passed,
      status: row?.status || "missing",
      executor: row?.executor || null,
      publishedAt: row?.published_at || null,
      targetAt: row?.target_at || null,
      retryCount: row?.retry_count || 0,
      fallbackCount: row?.fallback_count || 0,
      failureNotifiedAt: row?.failure_notified_at || null,
    };
  }),
);
const ready = checks.every((check) => check.passed);
console.log(JSON.stringify({ ready, daysRequired, requiredDates, checks }, null, 2));
process.exitCode = ready ? 0 : 1;
