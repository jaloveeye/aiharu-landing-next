import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/app/utils/apiError";
import { requireInternalApi } from "@/app/utils/internalApiAuth";
import { generateEmbedding } from "@/app/utils/ai/provider";

export async function POST(request: NextRequest) {
  const unauthorized = requireInternalApi(request);
  if (unauthorized) return unauthorized;
  try {
    const { text } = await request.json();

    if (!text) {
      return apiError({
        error: "Missing text",
        userMessage: "텍스트가 필요합니다.",
        status: 400,
      });
    }

    const result = await generateEmbedding(text);

    return NextResponse.json({
      embedding: result.primary.embedding,
      provider: result.primary.provider,
      model: result.primary.model,
      dimensions: result.primary.dimensions,
      version: result.primary.version,
      shadowEmbedding: result.shadow?.embedding,
      shadowModel: result.shadow?.model,
      fallbackReason: result.fallbackReason,
    });
  } catch (error) {
    return apiError({
      error,
      userMessage: "임베딩 생성에 실패했습니다.",
    });
  }
}
