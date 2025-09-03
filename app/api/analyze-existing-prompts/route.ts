import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { analyzePromptQuality, getQualityGrade, generateQualitySuggestions } from "@/app/utils/promptQualityAnalyzer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 품질 분석이 안된 프롬프트들 가져오기
    const { data: existingPrompts, error: fetchError } = await supabase
      .from('prompt_results')
      .select('*')
      .is('quality_metrics', null)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching existing prompts:', fetchError);
      return NextResponse.json({ error: '프롬프트 조회 실패' }, { status: 500 });
    }

    if (!existingPrompts || existingPrompts.length === 0) {
      return NextResponse.json({ 
        message: '품질 분석이 필요한 프롬프트가 없습니다.',
        analyzedCount: 0 
      });
    }

    let analyzedCount = 0;
    const errors: string[] = [];

    // 각 프롬프트에 대해 품질 분석 수행
    for (const prompt of existingPrompts) {
      try {
        // 품질 분석 수행
        const qualityMetrics = analyzePromptQuality(
          prompt.prompt_content,
          prompt.ai_result,
          prompt.prompt_category,
          prompt.tokens_used || Math.ceil((prompt.ai_result.length * 1.3) / 4)
        );

        // 품질 등급 계산
        const qualityGrade = getQualityGrade(qualityMetrics.overallScore);

        // 개선 제안 생성
        const qualitySuggestions = generateQualitySuggestions(qualityMetrics, prompt.prompt_category);

        // 데이터베이스 업데이트
        const { error: updateError } = await supabase
          .from('prompt_results')
          .update({
            quality_metrics: {
              structure_score: qualityMetrics.structureScore,
              expertise_score: qualityMetrics.expertiseScore,
              context_score: qualityMetrics.contextScore,
              practicality_score: qualityMetrics.practicalityScore,
              question_clarity_score: qualityMetrics.questionClarityScore,
              question_expertise_score: qualityMetrics.questionExpertiseScore,
              question_complexity_score: qualityMetrics.questionComplexityScore,
              overall_score: qualityMetrics.overallScore
            },
            quality_grade: qualityGrade,
            quality_suggestions: qualitySuggestions
          })
          .eq('id', prompt.id);

        if (updateError) {
          console.error(`Error updating prompt ${prompt.id}:`, updateError);
          errors.push(`프롬프트 ${prompt.prompt_title} 업데이트 실패`);
        } else {
          analyzedCount++;
        }

        // API 호출 제한을 위한 짧은 대기
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error analyzing prompt ${prompt.id}:`, error);
        errors.push(`프롬프트 ${prompt.prompt_title} 분석 실패`);
      }
    }

    return NextResponse.json({
      message: `${analyzedCount}개의 프롬프트 품질 분석 완료`,
      analyzedCount,
      totalCount: existingPrompts.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in analyze existing prompts:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// GET 요청으로 품질 분석이 필요한 프롬프트 개수 확인
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('prompt_results')
      .select('*', { count: 'exact', head: true })
      .is('quality_metrics', null);

    if (error) {
      console.error('Error counting prompts:', error);
      return NextResponse.json({ error: '프롬프트 개수 조회 실패' }, { status: 500 });
    }

    return NextResponse.json({
      pendingAnalysisCount: count || 0
    });

  } catch (error) {
    console.error('Error in get pending analysis count:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
