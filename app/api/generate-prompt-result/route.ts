import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, category } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 카테고리별 시스템 프롬프트 설정
    const getSystemPrompt = (category: string) => {
      const systemPrompts = {
        '코드리뷰': '당신은 경험 많은 시니어 개발자입니다. 코드를 성능, 가독성, 보안, 모범 사례 관점에서 분석하고 구체적인 개선 방안을 제시해주세요. 코드 예시도 함께 제공해주세요.',
        '디버깅': '당신은 디버깅 전문가입니다. 코드의 잠재적 문제점을 찾아내고 구체적인 해결 방안을 제시해주세요. 개선된 코드 예시도 함께 제공해주세요.',
        '아키텍처': '당신은 시스템 아키텍트입니다. 요구사항에 맞는 확장 가능하고 유지보수하기 쉬운 아키텍처를 설계해주세요. 구체적인 구현 방안과 기술 스택도 제안해주세요.',
        '성능최적화': '당신은 성능 최적화 전문가입니다. 코드나 쿼리의 성능 문제점을 분석하고 구체적인 최적화 방안을 제시해주세요. 개선된 코드 예시도 함께 제공해주세요.',
        '보안': '당신은 보안 전문가입니다. 코드의 보안 취약점을 찾아내고 구체적인 보안 강화 방안을 제시해주세요. 안전한 코드 예시도 함께 제공해주세요.',
        '테스트': '당신은 테스트 전문가입니다. 주어진 코드에 대한 포괄적인 테스트 코드를 작성해주세요. 다양한 테스트 케이스와 모킹 방법도 포함해주세요.',
        '문서화': '당신은 기술 문서 작성 전문가입니다. 주어진 API나 코드에 대한 명확하고 완전한 문서를 작성해주세요. 예시와 함께 제공해주세요.',
        '리팩토링': '당신은 리팩토링 전문가입니다. 코드의 개선점을 찾아내고 더 깔끔하고 유지보수하기 쉬운 코드로 리팩토링해주세요. 개선된 코드 예시도 함께 제공해주세요.'
      };
      return systemPrompts[category as keyof typeof systemPrompts] || '당신은 개발 전문가입니다. 주어진 프롬프트에 대해 전문적이고 실용적인 답변을 제공해주세요.';
    };

    const systemPrompt = getSystemPrompt(category);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      return NextResponse.json(
        { error: 'AI 응답을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result,
      usage: completion.usage,
      model: completion.model
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
