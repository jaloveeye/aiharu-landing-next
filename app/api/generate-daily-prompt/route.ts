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

export async function POST(request: NextRequest) {
  try {
    // 오늘 이미 생성된 프롬프트가 있는지 확인
    const todayResults = await getTodayAllPromptResults();

    if (todayResults && todayResults.length >= 3) {
      return NextResponse.json({
        message: "오늘의 프롬프트가 이미 생성되었습니다.",
        results: todayResults,
      });
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
      return NextResponse.json(
        { error: "OpenAI API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
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
      const categoryPrompt = promptTemplates.find(
        (p) => p.category === category
      );
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
            content: categoryPrompt.prompt,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      });

      const aiResult = completion.choices[0]?.message?.content;

      if (!aiResult) {
        console.error(`AI 응답을 생성할 수 없습니다: ${category}`);
        continue;
      }

      // 생성된 결과를 파싱하여 질문과 답변 분리
      const questionMatch = aiResult.match(
        /\*\*질문:\*\*\s*([\s\S]*?)(?=\*\*답변:\*\*)/
      );
      const answerMatch = aiResult.match(/\*\*답변:\*\*\s*([\s\S]*?)$/);

      const question = questionMatch
        ? questionMatch[1].trim()
        : "질문을 생성할 수 없습니다.";
      const answer = answerMatch ? answerMatch[1].trim() : aiResult;

      // 임시 프롬프트 객체 생성 (저장용)
      const generatedPrompt = {
        id: `generated-${Date.now()}-${category}`,
        title: `${category} 관련 질문`,
        category: category as any,
        prompt: question,
        tags: [category, "AI생성"],
        difficulty: "중급" as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Supabase에 저장
      const success = await savePromptResult(
        generatedPrompt,
        answer,
        "gpt-3.5-turbo",
        completion.usage?.total_tokens
      );

      if (success) {
        generatedResults.push({
          ...generatedPrompt,
          ai_result: answer,
          tokens_used: completion.usage?.total_tokens,
        });
        console.log(`${category} 프롬프트 생성 완료`);
      } else {
        console.error(`${category} 프롬프트 저장 실패`);
      }

      // API 호출 간격 조절
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (generatedResults.length === 0) {
      return NextResponse.json(
        { error: "프롬프트 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    console.log(`일일 프롬프트 생성 완료: ${generatedResults.length}개`);

    return NextResponse.json({
      message: "오늘의 프롬프트가 성공적으로 생성되었습니다.",
      results: generatedResults,
      count: generatedResults.length,
    });
  } catch (error) {
    console.error("일일 프롬프트 생성 중 오류:", error);
    return NextResponse.json(
      { error: "일일 프롬프트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET 요청으로 오늘의 프롬프트 결과 조회
export async function GET() {
  try {
    const todayResults = await getTodayAllPromptResults();

    if (todayResults.length === 0) {
      return NextResponse.json({
        message: "오늘 생성된 프롬프트가 없습니다.",
        results: [],
      });
    }

    return NextResponse.json({
      message: "오늘의 프롬프트 결과를 조회했습니다.",
      results: todayResults,
      count: todayResults.length,
    });
  } catch (error) {
    console.error("프롬프트 결과 조회 중 오류:", error);
    return NextResponse.json(
      { error: "프롬프트 결과 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
