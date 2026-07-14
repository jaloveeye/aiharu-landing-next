import { execFileSync, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

function koreaDate(offsetDays: number) {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  now.setUTCDate(now.getUTCDate() + offsetDays);
  return now.toISOString().slice(0, 10);
}

function passingRows() {
  return Array.from({ length: 7 }, (_, index) => koreaDate(index - 6)).flatMap((date) => [
    { operation: "generate-daily-prompt", run_date: date, status: "completed", executor: "local", published_at: `${date}T08:55:00+09:00`, target_at: `${date}T09:00:00+09:00`, models: [{ model: "qwen", checksum: "abc" }], moderation_result: { passed: 3 } },
    { operation: "collect-ai-news", run_date: date, status: "completed", executor: "local", published_at: `${date}T12:55:00+09:00`, target_at: `${date}T13:00:00+09:00`, models: [{ model: "qwen", checksum: "abc" }], moderation_result: { passed: 5 } },
  ]);
}

describe("seven-day shadow readiness", () => {
  const script = path.join(process.cwd(), "scripts", "check-shadow-readiness.mjs");

  it("passes only when both operations meet all seven daily targets", () => {
    const fixture = path.join(tmpdir(), `shadow-pass-${process.pid}.json`);
    writeFileSync(fixture, JSON.stringify(passingRows()));
    const output = execFileSync("node", [script, "--fixture", fixture], { encoding: "utf8" });
    expect(JSON.parse(output).ready).toBe(true);
  });

  it("fails when one local publication misses its target", () => {
    const rows = passingRows();
    rows[0].published_at = `${rows[0].run_date}T09:01:00+09:00`;
    const fixture = path.join(tmpdir(), `shadow-fail-${process.pid}.json`);
    writeFileSync(fixture, JSON.stringify(rows));
    const result = spawnSync("node", [script, "--fixture", fixture], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).ready).toBe(false);
  });
});
