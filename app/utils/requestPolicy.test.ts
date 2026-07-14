import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { readJsonBody } from "./requestPolicy";

describe("readJsonBody", () => {
  it("parses a body within the limit", async () => {
    const request = new NextRequest("http://localhost/api/test", {
      method: "POST",
      body: JSON.stringify({ value: "ok" }),
    });
    const result = await readJsonBody<{ value: string }>(request, 100);
    expect(result.data).toEqual({ value: "ok" });
  });

  it("rejects a body larger than the actual byte limit", async () => {
    const request = new NextRequest("http://localhost/api/test", {
      method: "POST",
      body: JSON.stringify({ value: "가".repeat(20) }),
    });
    const result = await readJsonBody(request, 20);
    expect(result.error?.status).toBe(413);
  });

  it("rejects invalid JSON", async () => {
    const request = new NextRequest("http://localhost/api/test", {
      method: "POST",
      body: "{",
    });
    const result = await readJsonBody(request, 100);
    expect(result.error?.status).toBe(400);
  });
});
