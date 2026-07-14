import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { hasValidInternalSecret, requireInternalApi } from "./internalApiAuth";

describe("hasValidInternalSecret", () => {
  it("accepts an exact bearer secret", () => {
    expect(hasValidInternalSecret("Bearer test-secret", "test-secret")).toBe(true);
  });

  it.each([null, "", "Basic test-secret", "Bearer ", "Bearer wrong-secret"])(
    "rejects invalid authorization: %s",
    (authorization) => {
      expect(hasValidInternalSecret(authorization, "test-secret")).toBe(false);
    },
  );

  it("fails closed when the server secret is missing", () => {
    expect(hasValidInternalSecret("Bearer test-secret", undefined)).toBe(false);
  });
});

describe("requireInternalApi", () => {
  it("rejects declared bodies over 1MB after authentication", () => {
    process.env.INTERNAL_API_SECRET = "test-secret";
    const request = new NextRequest("http://localhost/api/internal", {
      method: "POST",
      headers: {
        Authorization: "Bearer test-secret",
        "Content-Length": String(1024 * 1024 + 1),
      },
    });
    expect(requireInternalApi(request)?.status).toBe(413);
  });
});
