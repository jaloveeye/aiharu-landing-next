import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: '텍스트가 필요합니다.' },
        { status: 400 }
      );
    }

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return NextResponse.json({ 
      embedding: embedding.data[0].embedding,
      model: embedding.model,
      usage: embedding.usage
    });
  } catch (error) {
    console.error('Embedding 생성 오류:', error);
    return NextResponse.json(
      { error: 'Embedding 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
