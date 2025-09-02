import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  getTodayAllPromptResults,
  savePromptResult,
} from "@/app/utils/promptResults";
import { promptTemplates } from "@/data/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 공통 프롬프트 생성 함수
async function generateDailyPrompts() {
  // 오늘 이미 생성된 프롬프트가 있는지 확인
  const todayResults = await getTodayAllPromptResults();

  if (todayResults && todayResults.length >= 3) {
    return {
      message: "오늘의 프롬프트가 이미 생성되었습니다.",
      results: todayResults,
    };
  }

  // 3개의 프롬프트 카테고리 선택 (육아 필수 + 육아창업 1개 + 비즈니스마케팅 1개)
  const selectedCategories = [
    "육아", // 필수
    "육아창업", // 육아 관련 창업 아이디어
    "비즈니스마케팅", // 비즈니스 전략과 마케팅
  ];

  console.log("선택된 카테고리들:", selectedCategories);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  const generatedResults = [];

  // 3개의 프롬프트 생성
  for (const category of selectedCategories) {
    // AI가 질문과 답변을 모두 생성하도록 시스템 프롬프트 설정
    const systemPrompt = `당신은 ${category} 분야의 전문가입니다. 성인 고학력자 수준의 깊이 있고 실용적인 질문과 답변을 생성해주세요.

요구사항:
- **질문**: 구체적이고 복합적인 상황과 문제를 제시하는 전문가 수준의 질문
- **답변**: 실용적이고 실행 가능한 구체적인 해결 방법이나 조언
- 전문성: 해당 분야의 최신 트렌드와 전문 지식을 반영
- 실용성: 실제 상황에서 바로 적용할 수 있는 내용

형식:
**질문:** [전문가 수준의 구체적이고 복합적인 상황과 문제]
**답변:** [실용적이고 구체적인 해결 방법이나 조언]`;

    // 선택된 카테고리의 프롬프트 생성 가이드 가져오기
    const categoryPrompt = promptTemplates.find((p) => p.category === category);
    if (!categoryPrompt) {
      console.error(`카테고리 프롬프트를 찾을 수 없습니다: ${category}`);
      continue;
    }

    // OpenAI API 호출 - 질문과 답변을 각각 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `카테고리: ${category}\n\n이 카테고리에서 성인 고학력자 전문가 수준의 질문과 답변을 생성해주세요.`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content || "";
    console.log(`카테고리 ${category} 프롬프트 생성 완료`);

    // 생성된 텍스트에서 질문과 답변 분리
    const questionMatch = generatedText.match(
      /\*\*질문:\*\*\s*([\s\S]*?)(?=\*\*답변:\*\*)/
    );
    const answerMatch = generatedText.match(/\*\*답변:\*\*\s*([\s\S]*?)$/);

    const aiGeneratedQuestion = questionMatch
      ? questionMatch[1].trim()
      : "AI가 질문을 생성할 수 없습니다.";
    const aiGeneratedAnswer = answerMatch
      ? answerMatch[1].trim()
      : generatedText;

    // 프롬프트 결과 저장 - AI 생성 질문만 표시
    const promptResult = await savePromptResult(
      {
        id: `generated-${Date.now()}-${category}`,
        title: `${category} 전문가 질문`,
        category: category as any,
        prompt: aiGeneratedQuestion, // AI가 생성한 질문만 저장
        tags: [category, "AI생성", "전문가수준"],
        difficulty: "고급" as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      aiGeneratedAnswer, // AI가 생성한 답변
      "gpt-3.5-turbo",
      completion.usage?.total_tokens
    );

    if (promptResult) {
      generatedResults.push({
        id: `generated-${Date.now()}-${category}`,
        prompt_id: `generated-${Date.now()}-${category}`,
        prompt_title: `${category} 전문가 질문`,
        prompt_content: aiGeneratedQuestion, // AI 생성 질문만 표시
        prompt_category: category,
        prompt_difficulty: "고급",
        prompt_tags: [category, "AI생성", "전문가수준"],
        ai_result: aiGeneratedAnswer, // AI 생성 답변
        ai_model: "gpt-3.5-turbo",
        tokens_used: completion.usage?.total_tokens,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  console.log(
    `${generatedResults.length}개의 프롬프트가 성공적으로 생성되었습니다.`
  );

  return {
    message: "오늘의 프롬프트가 성공적으로 생성되었습니다.",
    results: generatedResults,
  };
}

export async function GET() {
  try {
    const result = await generateDailyPrompts();
    return NextResponse.json(result);
  } catch (error) {
    console.error("프롬프트 생성 오류:", error);
    return NextResponse.json(
      { error: "프롬프트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await generateDailyPrompts();
    return NextResponse.json(result);
  } catch (error) {
    console.error("프롬프트 생성 오류:", error);
    return NextResponse.json(
      { error: "프롬프트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
