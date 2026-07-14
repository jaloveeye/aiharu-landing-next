import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";
import {
  assertLocalSchedulePreflight,
  operationContextFromRequest,
  operationFailureModels,
} from "./operationRun";

describe("operation execution context", () => {
  afterEach(() => {
    delete process.env.LOCAL_SCHEDULE_PREFLIGHT_ERROR;
    delete process.env.LOCAL_LLM_MODEL;
    delete process.env.LOCAL_LLM_CHECKSUM;
    delete process.env.LOCAL_EMBEDDING_MODEL;
    delete process.env.LOCAL_EMBEDDING_CHECKSUM;
  });
  it("accepts local shadow schedule metadata", () => {
    const request = new NextRequest("http://localhost/api/collect-ai-news", {
      headers: {
        "x-aiharu-executor": "local",
        "x-aiharu-scheduled-for": "2026-07-13T12:30:00+09:00",
        "x-aiharu-target-at": "2026-07-13T13:00:00+09:00",
      },
    });
    expect(operationContextFromRequest(request)).toEqual({
      executor: "local",
      scheduledFor: "2026-07-13T03:30:00.000Z",
      targetAt: "2026-07-13T04:00:00.000Z",
    });
  });

  it("treats unknown executors and invalid dates as manual", () => {
    const request = new NextRequest("http://localhost/api/collect-ai-news", {
      headers: { "x-aiharu-executor": "unknown", "x-aiharu-target-at": "invalid" },
    });
    expect(operationContextFromRequest(request)).toEqual({
      executor: "manual",
      scheduledFor: undefined,
      targetAt: undefined,
    });
  });

  it("fails a local lease before writes when model preflight failed", () => {
    process.env.LOCAL_SCHEDULE_PREFLIGHT_ERROR = "qwen_unavailable";
    expect(() => assertLocalSchedulePreflight({ executor: "local" }))
      .toThrow("qwen_unavailable");
    expect(() => assertLocalSchedulePreflight({ executor: "external-fallback" }))
      .not.toThrow();
  });

  it("records pinned local model metadata on a failed run", () => {
    process.env.LOCAL_LLM_MODEL = "local-text";
    process.env.LOCAL_LLM_CHECKSUM = "text-revision";
    process.env.LOCAL_EMBEDDING_MODEL = "local-embedding";
    process.env.LOCAL_EMBEDDING_CHECKSUM = "embedding-revision";
    expect(operationFailureModels({ executor: "local" }, true)).toEqual([
      { provider: "local", model: "local-text", checksum: "text-revision" },
      { provider: "local", model: "local-embedding", checksum: "embedding-revision" },
    ]);
    expect(operationFailureModels({ executor: "external-fallback" }, true)).toEqual([]);
  });
});
