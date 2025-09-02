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

  // 3개의 프롬프트 카테고리 선택 (육아 필수 + 개발 1개 + 일반 1개)
  const developmentCategories = [
    "코드리뷰",
    "디버깅",
    "아키텍처",
    "성능최적화",
    "보안",
    "테스트",
    "문서화",
    "리팩토링",
  ];

  const generalCategories = [
    "학습교육",
    "비즈니스",
    "창작디자인",
    "일상라이프",
    "창의성",
    "사회환경",
    "금융투자",
    "건강웰빙",
  ];

  // 카테고리 선택
  const selectedCategories = [
    "육아", // 필수
    developmentCategories[
      Math.floor(Math.random() * developmentCategories.length)
    ],
    generalCategories[Math.floor(Math.random() * generalCategories.length)],
  ];

  console.log("선택된 카테고리들:", selectedCategories);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  // AI가 질문과 답변을 모두 생성하도록 시스템 프롬프트 설정
  const systemPrompt = `전문가로서 주어진 카테고리에 맞는 구체적이고 실용적인 질문과 답변을 생성하세요.

요구사항:
- 복잡하고 구체적인 문제 상황 (단순한 "어떻게 하나요?" 금지)
- 특정 맥락, 조건, 제약사항 포함
- 실제 경험에서 나올 수 있는 구체적인 어려움

형식:
**질문:** [구체적이고 복합적인 상황과 문제]
**답변:** [실용적이고 구체적인 해결 방법이나 조언]`;

  const generatedResults = [];

  // 3개의 프롬프트 생성
  for (const category of selectedCategories) {
    // 선택된 카테고리의 프롬프트 생성 가이드 가져오기
    const categoryPrompt = promptTemplates.find((p) => p.category === category);
    if (!categoryPrompt) {
      console.error(`카테고리 프롬프트를 찾을 수 없습니다: ${category}`);
      continue;
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `카테고리: ${category}\n\n${categoryPrompt.prompt}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content || "";
    console.log(`카테고리 ${category} 프롬프트 생성 완료`);

    // 프롬프트 결과 저장
    const promptResult = await savePromptResult(
      {
        id: `generated-${Date.now()}-${category}`,
        title: `${category} 관련 질문`,
        category: category as any,
        prompt: categoryPrompt.prompt,
        tags: [category, "AI생성"],
        difficulty: "중급" as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      generatedText,
      "gpt-3.5-turbo",
      completion.usage?.total_tokens
    );

    if (promptResult) {
      generatedResults.push({
        id: `generated-${Date.now()}-${category}`,
        prompt_id: `generated-${Date.now()}-${category}`,
        prompt_title: `${category} 관련 질문`,
        prompt_content: categoryPrompt.prompt,
        prompt_category: category,
        prompt_difficulty: "중급",
        prompt_tags: [category, "AI생성"],
        ai_result: generatedText,
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
