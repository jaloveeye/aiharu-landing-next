import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function hasValidInternalSecret(
  authorization: string | null,
  secret = process.env.INTERNAL_API_SECRET,
): boolean {
  if (!secret || !authorization?.startsWith("Bearer ")) return false;
  const provided = authorization.slice("Bearer ".length).trim();
  return Boolean(provided) && timingSafeEqual(digest(provided), digest(secret));
}

export function requireInternalApi(request: NextRequest): NextResponse | null {
  if (!hasValidInternalSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1024 * 1024) {
    return NextResponse.json({ error: "요청이 너무 큽니다." }, { status: 413 });
  }
  return null;
}

export function requireDevelopment(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return null;
}

export function internalApiHeaders(): Record<string, string> {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) throw new Error("INTERNAL_API_SECRET가 설정되지 않았습니다.");
  return { Authorization: `Bearer ${secret}` };
}
