import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { operationContextFromRequest } from "./operationRun";

describe("operation execution context", () => {
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
});
