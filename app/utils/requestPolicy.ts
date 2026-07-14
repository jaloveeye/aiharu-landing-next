import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "./supabase/admin";

export async function readJsonBody<T>(
  request: NextRequest,
  maxBytes: number,
): Promise<{ data?: T; error?: NextResponse }> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) {
    return { error: NextResponse.json({ error: "요청이 너무 큽니다." }, { status: 413 }) };
  }
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    return { error: NextResponse.json({ error: "요청이 너무 큽니다." }, { status: 413 }) };
  }
  try {
    return { data: JSON.parse(text) as T };
  } catch {
    return { error: NextResponse.json({ error: "올바른 JSON 요청이 아닙니다." }, { status: 400 }) };
  }
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) throw new Error("INTERNAL_API_SECRET가 설정되지 않았습니다.");
  return createHash("sha256").update(address).update(secret).digest("hex");
}

export async function enforceDailyLimit(
  request: NextRequest,
  endpoint: string,
  limit: number,
): Promise<NextResponse | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("consume_api_rate_limit", {
    p_client_key: clientKey(request),
    p_endpoint: endpoint,
    p_limit: limit,
  });
  if (error) throw error;
  if (data === false) {
    return NextResponse.json(
      { error: "일일 요청 한도를 초과했습니다." },
      { status: 429, headers: { "Retry-After": "86400" } },
    );
  }
  return null;
}
