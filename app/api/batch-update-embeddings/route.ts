import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. 벡터가 없는 프롬프트 결과들 가져오기
    const { data: promptsWithoutEmbedding, error: fetchError } = await supabase
      .from('prompt_results')
      .select('id, prompt_title, prompt_content, prompt_category, ai_result')
      .is('embedding', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!promptsWithoutEmbedding || promptsWithoutEmbedding.length === 0) {
      return NextResponse.json({
        message: "벡터화할 프롬프트가 없습니다.",
        total: 0,
        processed: 0
      });
    }

    console.log(`벡터화할 프롬프트 수: ${promptsWithoutEmbedding.length}`);

    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    // 2. 각 프롬프트를 벡터로 변환
    for (const prompt of promptsWithoutEmbedding) {
      try {
        // 벡터 생성
        const embeddingResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-embedding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: `${prompt.prompt_title} ${prompt.prompt_content} ${prompt.ai_result}` 
          })
        });

        if (embeddingResponse.ok) {
          const { embedding } = await embeddingResponse.json();
          
          // 벡터 저장
          const { error: updateError } = await supabase
            .from('prompt_results')
            .update({ embedding })
            .eq('id', prompt.id);

          if (updateError) {
            console.error(`벡터 저장 실패 (${prompt.id}):`, updateError);
            errorCount++;
          } else {
            console.log(`벡터 저장 성공: ${prompt.id}`);
            successCount++;
          }
        } else {
          console.error(`벡터 생성 실패 (${prompt.id}):`, embeddingResponse.status);
          errorCount++;
        }

        processedCount++;
        
        // API 호출 간격 조절 (초당 10회 제한)
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`프롬프트 처리 오류 (${prompt.id}):`, error);
        errorCount++;
        processedCount++;
      }
    }

    return NextResponse.json({
      message: "배치 벡터화 완료",
      total: promptsWithoutEmbedding.length,
      processed: processedCount,
      success: successCount,
      errors: errorCount
    });

  } catch (error) {
    console.error('배치 벡터화 오류:', error);
    return NextResponse.json(
      { error: '배치 벡터화 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
