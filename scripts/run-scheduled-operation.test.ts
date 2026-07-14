import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const script = path.join(process.cwd(), "scripts", "run-scheduled-operation.sh");

function dryRun(operation: string): string {
  return execFileSync("bash", [script, operation, "--dry-run"], {
    encoding: "utf8",
  });
}

describe("scheduled local AI lifecycle", () => {
  it("starts Qwen and BGE for daily prompts and stops in reverse order", () => {
    const output = dryRun("generate-daily-prompt");
    expect(output).toContain("local=08:30 target=09:00 fallback=09:30");
    expect(output).toContain("features value=daily-prompt,embedding");
    expect(output.indexOf("model_start service=qwen")).toBeLessThan(output.indexOf("model_start service=bge-m3"));
    expect(output.indexOf("api_call path=/api/generate-daily-prompt")).toBeLessThan(output.indexOf("model_stop service=bge-m3"));
    expect(output.indexOf("model_stop service=bge-m3")).toBeLessThan(output.indexOf("model_stop service=qwen"));
  });

  it("uses only Qwen for news collection", () => {
    const output = dryRun("collect-ai-news");
    expect(output).toContain("local=12:30 target=13:00 fallback=13:30");
    expect(output).toContain("features value=news-classification,news-summary");
    expect(output).not.toContain("service=bge-m3");
    expect(output).toContain("api_call path=/api/collect-ai-news");
  });
});
