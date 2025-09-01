import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: '뉴스 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 뉴스 내용 요약 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "AI 뉴스 전문가로서 주어진 뉴스 내용을 2-3문장으로 간결하게 요약해주세요. 핵심 내용만 추출하여 한국어로 작성하세요."
        },
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content;

    if (!summary) {
      return NextResponse.json(
        { error: '뉴스 요약을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary,
      usage: completion.usage,
      model: completion.model
    });

  } catch (error) {
    console.error('News summarization error:', error);
    return NextResponse.json(
      { error: '뉴스 요약 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
