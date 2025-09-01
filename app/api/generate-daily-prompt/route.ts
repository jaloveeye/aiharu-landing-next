import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { 
  getTodayPromptResult, 
  savePromptResult 
} from '@/app/utils/promptResults';
import { promptTemplates } from '@/data/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 오늘 이미 생성된 프롬프트가 있는지 확인
    const todayResult = await getTodayPromptResult();
    
    if (todayResult) {
      return NextResponse.json({
        message: '오늘의 프롬프트가 이미 생성되었습니다.',
        result: todayResult
      });
    }

    // 카테고리만 랜덤으로 선택
    const categories = ['코드리뷰', '디버깅', '아키텍처', '성능최적화', '보안', '테스트', '문서화', '리팩토링'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // 선택된 카테고리의 프롬프트 생성 가이드 가져오기
    const categoryPrompt = promptTemplates.find(p => p.category === randomCategory);
    if (!categoryPrompt) {
      return NextResponse.json(
        { error: '카테고리 프롬프트를 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // AI가 질문과 답변을 모두 생성하도록 시스템 프롬프트 설정
    const systemPrompt = `개발 전문가로서 주어진 카테고리에 맞는 실용적인 개발 질문과 답변을 생성하세요.

형식:
**질문:** [구체적인 개발 질문]
**답변:** [간결하고 실용적인 답변]

답변은 핵심만 간결하게 작성하세요.`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4에서 gpt-3.5-turbo로 변경 (비용 1/10, 속도 향상)
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: categoryPrompt.prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiResult = completion.choices[0]?.message?.content;

    if (!aiResult) {
      return NextResponse.json(
        { error: 'AI 응답을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }

    // 생성된 결과를 파싱하여 질문과 답변 분리
    const questionMatch = aiResult.match(/\*\*질문:\*\*\s*([\s\S]*?)(?=\*\*답변:\*\*)/);
    const answerMatch = aiResult.match(/\*\*답변:\*\*\s*([\s\S]*?)$/);
    
    const question = questionMatch ? questionMatch[1].trim() : '질문을 생성할 수 없습니다.';
    const answer = answerMatch ? answerMatch[1].trim() : aiResult;

    // 임시 프롬프트 객체 생성 (저장용)
    const generatedPrompt = {
      id: `generated-${Date.now()}`,
      title: `${randomCategory} 관련 개발 질문`,
      category: randomCategory as any,
      prompt: question,
      tags: [randomCategory, 'AI생성'],
      difficulty: '중급' as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Supabase에 저장
    const saveSuccess = await savePromptResult(
      generatedPrompt,
      answer,
      completion.model,
      completion.usage?.total_tokens
    );

    if (!saveSuccess) {
      return NextResponse.json(
        { error: '프롬프트 결과 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '오늘의 프롬프트가 성공적으로 생성되었습니다.',
      prompt: generatedPrompt,
      result: answer,
      usage: completion.usage,
      model: completion.model
    });

  } catch (error) {
    console.error('Daily prompt generation error:', error);
    return NextResponse.json(
      { error: '매일 프롬프트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET 요청으로 오늘의 프롬프트 결과 조회 또는 생성
export async function GET() {
  try {
    const todayResult = await getTodayPromptResult();
    
    if (todayResult) {
      return NextResponse.json({
        message: '오늘의 프롬프트가 이미 생성되었습니다.',
        result: todayResult
      });
    }

    // 오늘 프롬프트가 없으면 자동 생성
    console.log('매일 자동 프롬프트 생성 시작...');
    
    // 카테고리만 랜덤으로 선택
    const categories = ['코드리뷰', '디버깅', '아키텍처', '성능최적화', '보안', '테스트', '문서화', '리팩토링'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // 선택된 카테고리의 프롬프트 생성 가이드 가져오기
    const categoryPrompt = promptTemplates.find(p => p.category === randomCategory);
    if (!categoryPrompt) {
      return NextResponse.json(
        { error: '카테고리 프롬프트를 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // AI가 질문과 답변을 모두 생성하도록 시스템 프롬프트 설정
    const systemPrompt = `개발 전문가로서 주어진 카테고리에 맞는 실용적인 개발 질문과 답변을 생성하세요.

형식:
**질문:** [구체적인 개발 질문]
**답변:** [간결하고 실용적인 답변]

답변은 핵심만 간결하게 작성하세요.`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4에서 gpt-3.5-turbo로 변경 (비용 1/10, 속도 향상)
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: categoryPrompt.prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiResult = completion.choices[0]?.message?.content;

    if (!aiResult) {
      return NextResponse.json(
        { error: 'AI 응답을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }

    // 생성된 결과를 파싱하여 질문과 답변 분리
    const questionMatch = aiResult.match(/\*\*질문:\*\*\s*([\s\S]*?)(?=\*\*답변:\*\*)/);
    const answerMatch = aiResult.match(/\*\*답변:\*\*\s*([\s\S]*?)$/);
    
    const question = questionMatch ? questionMatch[1].trim() : '질문을 생성할 수 없습니다.';
    const answer = answerMatch ? answerMatch[1].trim() : aiResult;

    // 임시 프롬프트 객체 생성 (저장용)
    const generatedPrompt = {
      id: `generated-${Date.now()}`,
      title: `${randomCategory} 관련 개발 질문`,
      category: randomCategory as any,
      prompt: question,
      tags: [randomCategory, 'AI생성'],
      difficulty: '중급' as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Supabase에 저장
    const saveSuccess = await savePromptResult(
      generatedPrompt,
      answer,
      completion.model,
      completion.usage?.total_tokens
    );

    if (!saveSuccess) {
      return NextResponse.json(
        { error: '프롬프트 결과 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('매일 자동 프롬프트 생성 완료:', generatedPrompt.title);

    return NextResponse.json({
      message: '오늘의 프롬프트가 성공적으로 생성되었습니다.',
      prompt: generatedPrompt,
      result: answer,
      usage: completion.usage,
      model: completion.model
    });

  } catch (error) {
    console.error('Daily prompt generation error:', error);
    return NextResponse.json(
      { error: '매일 프롬프트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
