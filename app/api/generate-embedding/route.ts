import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { apiError } from "@/app/utils/apiError";
import { requireEnv } from "@/app/utils/checkEnv";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return apiError({
        error: "Missing text",
        userMessage: "텍스트가 필요합니다.",
        status: 400,
      });
    }

    const openai = new OpenAI({
      apiKey: requireEnv("OPENAI_API_KEY"),
    });
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return NextResponse.json({
      embedding: embedding.data[0].embedding,
      model: embedding.model,
      usage: embedding.usage,
    });
  } catch (error) {
    return apiError({
      error,
      userMessage: "임베딩 생성에 실패했습니다.",
    });
  }
}
