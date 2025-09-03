import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { promptId, qualityMetrics, qualityGrade, qualitySuggestions } = await request.json();

    if (!promptId || !qualityMetrics) {
      return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    const supabase = await createClient();

    // 프롬프트 품질 정보 업데이트
    const { error } = await supabase
      .from('prompt_results')
      .update({
        quality_metrics: qualityMetrics,
        quality_grade: qualityGrade,
        quality_suggestions: qualitySuggestions
      })
      .eq('id', promptId);

    if (error) {
      console.error('Error updating prompt quality:', error);
      return NextResponse.json({ error: '품질 정보 업데이트 실패' }, { status: 500 });
    }

    return NextResponse.json({
      message: '프롬프트 품질 정보가 성공적으로 업데이트되었습니다.',
      promptId
    });

  } catch (error) {
    console.error('Error in update prompt quality:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
