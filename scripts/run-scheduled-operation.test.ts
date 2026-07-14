import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const script = path.join(process.cwd(), "scripts", "run-scheduled-operation.sh");
const source = readFileSync(script, "utf8");

function dryRun(operation: string): string {
  return execFileSync("bash", [script, operation, "--dry-run"], {
    encoding: "utf8",
  });
}

describe("scheduled local AI lifecycle", () => {
  it("starts Qwen and BGE for daily prompts and stops in reverse order", () => {
    const output = dryRun("generate-daily-prompt");
    expect(output).toContain("local=08:30 target=09:00 fallback=09:30");
    expect(output).toContain("fallback_policy value=external-only");
    expect(output).toContain("revision=95a723d08a9490559dae23d0cff1d9466213d989");
    expect(output).toContain("revision=5617a9f61b028005a4858fdac845db406aefb181");
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

  it("requires local providers and labels managed containers with pinned revisions", () => {
    expect(source).toContain("export LOCAL_AI_REQUIRE_LOCAL=true");
    expect(source).toContain('export LOCAL_LLM_CHECKSUM="$qwen_revision"');
    expect(source).toContain('export LOCAL_EMBEDDING_CHECKSUM="$bge_revision"');
    expect(source).toContain("aiharu.revision=$qwen_revision");
    expect(source).toContain("aiharu.revision=$bge_revision");
  });
});
