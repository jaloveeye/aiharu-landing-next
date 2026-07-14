import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { generateText, isLocalAiFeatureEnabled, parseLocalAiFeatures } from "./provider";

function clientReturning(content: string) {
  return {
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({ choices: [{ message: { content } }] }),
      },
    },
    embeddings: { create: vi.fn() },
  };
}

describe("local AI provider", () => {
  afterEach(() => {
    delete process.env.AI_PROVIDER_AUDIT_FILE;
  });

  it("parses a normalized comma-separated feature list", () => {
    expect([...parseLocalAiFeatures(" news-summary,MEAL-TEXT, ")]).toEqual([
      "news-summary",
      "meal-text",
    ]);
    expect(isLocalAiFeatureEnabled("meal-text", { LOCAL_AI_FEATURES: "meal-text" })).toBe(true);
  });

  it("uses OpenAI when the local feature is disabled", async () => {
    const createClient = vi.fn(() => clientReturning("cloud result"));
    const result = await generateText(
      {
        feature: "news-summary",
        openAIModel: "cloud-model",
        messages: [{ role: "user", content: "test" }],
      },
      { env: { OPENAI_API_KEY: "test", LOCAL_AI_FEATURES: "" }, createClient },
    );

    expect(result.provider).toBe("openai");
    expect(result.content).toBe("cloud result");
    expect(createClient).toHaveBeenCalledTimes(1);
  });

  it("falls back when local output fails validation", async () => {
    const createClient = vi
      .fn()
      .mockImplementationOnce(() => clientReturning("invalid"))
      .mockImplementationOnce(() => clientReturning("**질문:** Q\n**답변:** A"));
    const result = await generateText(
      {
        feature: "daily-prompt",
        openAIModel: "cloud-model",
        messages: [{ role: "user", content: "test" }],
        validate: (value) => value.includes("**질문:**") && value.includes("**답변:**"),
      },
      {
        env: { OPENAI_API_KEY: "test", LOCAL_AI_FEATURES: "daily-prompt" },
        createClient,
      },
    );

    expect(result.provider).toBe("openai");
    expect(result.fallbackReason).toBe("Error");
    expect(createClient).toHaveBeenCalledTimes(2);
  });

  it("disables Qwen thinking and audits metadata without prompt content", async () => {
    const create = vi.fn().mockResolvedValue({
      choices: [{ message: { content: "safe result" } }],
    });
    const createClient = vi.fn(() => ({
      chat: { completions: { create } },
      embeddings: { create: vi.fn() },
    }));
    const auditFile = path.join(tmpdir(), `ai-provider-${process.pid}-${Date.now()}.jsonl`);
    process.env.AI_PROVIDER_AUDIT_FILE = auditFile;

    await generateText(
      {
        feature: "news-summary",
        openAIModel: "cloud-model",
        messages: [{ role: "user", content: "private prompt" }],
      },
      {
        env: {
          OPENAI_API_KEY: "test",
          LOCAL_AI_FEATURES: "news-summary",
          LOCAL_LLM_MODEL: "local-model",
        },
        createClient,
      },
    );

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      extra_body: {
        top_k: 20,
        chat_template_kwargs: { enable_thinking: false },
      },
    }));
    const audit = readFileSync(auditFile, "utf8");
    expect(audit).toContain('"provider":"local"');
    expect(audit).not.toContain("private prompt");
    expect(audit).not.toContain("safe result");
  });
});
