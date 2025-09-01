import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  getTodayPromptResult,
  getRandomUnusedPrompt,
  savePromptResult,
} from "@/app/utils/promptResults";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 오늘 이미 생성된 프롬프트가 있는지 확인
    const todayResult = await getTodayPromptResult();

    if (todayResult) {
      return NextResponse.json({
        message:
          "오늘의 프롬프트가 이미 생성되었습니다. 수동 생성을 원하시면 기존 결과를 삭제해주세요.",
        result: todayResult,
      });
    }

    // 랜덤 프롬프트 선택
    const selectedPrompt = getRandomUnusedPrompt();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 간결한 시스템 프롬프트
    const systemPrompt =
      "개발 전문가로서 주어진 프롬프트에 대해 간결하고 실용적인 답변을 제공하세요.";

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4에서 gpt-3.5-turbo로 변경 (비용 1/10, 속도 향상)
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: selectedPrompt.prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiResult = completion.choices[0]?.message?.content;

    if (!aiResult) {
      return NextResponse.json(
        { error: "AI 응답을 생성할 수 없습니다." },
        { status: 500 }
      );
    }

    // Supabase에 저장
    const saveSuccess = await savePromptResult(
      selectedPrompt,
      aiResult,
      completion.model,
      completion.usage?.total_tokens
    );

    if (!saveSuccess) {
      return NextResponse.json(
        { error: "프롬프트 결과 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "오늘의 프롬프트가 성공적으로 생성되었습니다.",
      prompt: selectedPrompt,
      result: aiResult,
      usage: completion.usage,
      model: completion.model,
    });
  } catch (error) {
    console.error("Manual prompt generation error:", error);
    return NextResponse.json(
      { error: "수동 프롬프트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
