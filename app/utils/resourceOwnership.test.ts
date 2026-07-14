import { describe, expect, it } from "vitest";
import { matchesAuthenticatedEmail, ownsMealAnalysis } from "./resourceOwnership";

describe("resource ownership", () => {
  it("allows an authenticated user to access only the same email", () => {
    expect(matchesAuthenticatedEmail("a@example.com", "a@example.com")).toBe(true);
    expect(matchesAuthenticatedEmail("a@example.com", "b@example.com")).toBe(false);
    expect(matchesAuthenticatedEmail(null, "a@example.com")).toBe(false);
  });

  it("does not let an anonymous id override an authenticated record", () => {
    expect(
      ownsMealAnalysis(null, "known-anon", {
        email: "owner@example.com",
        anon_id: "known-anon",
      }),
    ).toBe(false);
  });

  it("allows only the matching id for an anonymous record", () => {
    const record = { email: null, anon_id: "anon-a" };
    expect(ownsMealAnalysis(null, "anon-a", record)).toBe(true);
    expect(ownsMealAnalysis(null, "anon-b", record)).toBe(false);
  });
});
