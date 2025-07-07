import { isValidUUID } from "./common";

describe("isValidUUID", () => {
  it("should return true for valid UUIDs", () => {
    expect(isValidUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("should return false for invalid UUIDs", () => {
    expect(isValidUUID("not-a-uuid")).toBe(false);
    expect(isValidUUID("123456")).toBe(false);
    expect(isValidUUID("")).toBe(false);
  });
});
