import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { requireEnv } from "@/app/utils/checkEnv";
import { apiError } from "@/app/utils/apiError";

const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });

export async function POST(req: NextRequest) {
  const { meal } = await req.json();

  if (!meal) {
    return apiError({
      error: "Missing meal input",
      userMessage: "식단 정보가 필요합니다.",
      status: 400,
    });
  }

  const prompt = `
너는 영양사야.
아래 입력된 아침 식단을 초등학교 1학년 기준으로 분석해줘.
1. 주요 영양소 (단백질, 탄수화물, 지방, 칼슘, 비타민 등)를 추정해줘.
2. 아침 식사로서 충분한지 판단하고 부족하거나 과한 영양소를 알려줘.
3. 내일 보완할 수 있는 추천 식사도 제안해줘.

입력된 식단:
${meal}
`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const result = chat.choices[0].message.content;
    return NextResponse.json({ result });
  } catch (error) {
    return apiError({
      error,
      userMessage: "AI 분석에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}
