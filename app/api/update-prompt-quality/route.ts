import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { apiError } from "@/app/utils/apiError";

type UpdatePromptQualityBody = {
  promptId?: string;
  qualityMetrics?: unknown;
  qualityGrade?: string;
  qualitySuggestions?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdatePromptQualityBody;
    const { promptId, qualityMetrics, qualityGrade, qualitySuggestions } = body;

    if (!promptId || !qualityMetrics) {
      return apiError({
        error: "Missing required fields: promptId and qualityMetrics",
        userMessage: "필수 파라미터가 누락되었습니다.",
        status: 400,
      });
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
      return apiError({
        error,
        userMessage: "품질 정보 업데이트에 실패했습니다.",
      });
    }

    return NextResponse.json({
      message: '프롬프트 품질 정보가 성공적으로 업데이트되었습니다.',
      promptId
    });

  } catch (error) {
    return apiError({
      error,
      userMessage: "품질 정보 처리 중 서버 오류가 발생했습니다.",
    });
  }
}
