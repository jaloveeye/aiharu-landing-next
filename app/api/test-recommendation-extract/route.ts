import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { extractRecommendations } from "@/app/utils/recommendation";
import { apiError } from "@/app/utils/apiError";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. 기존 분석 결과 일부(예: 20개) 불러오기
    const { data: analyses, error } = await supabase
      .from("meal_analysis")
      .select("id, anon_id, result, analyzed_at")
      .order("analyzed_at", { ascending: false })
      .limit(20);

    if (error) {
      return apiError({
        error,
        userMessage: "추천 추출 대상 데이터 조회 중 오류가 발생했습니다.",
        status: 500,
      });
    }

    let totalInserted = 0;
    let totalSkipped = 0;
    const logs: Array<{ analysis_id: string | null; category: string; content: string }> = [];

    for (const analysis of analyses || []) {
      const recs = extractRecommendations(analysis.result);
      if (recs.length === 0) {
        totalSkipped++;
        continue;
      }
      for (const rec of recs) {
        // 이미 같은 추천이 저장되어 있는지 중복 체크(선택)
        const { data: exists } = await supabase
          .from("recommendation_history")
          .select("id")
          .eq("analysis_id", analysis.id)
          .eq("content", rec.content)
          .eq("category", rec.category)
          .maybeSingle();
        if (exists) {
          totalSkipped++;
          continue;
        }
        // 추천 저장
        const { error: insertError } = await supabase
          .from("recommendation_history")
          .insert({
            anon_id: analysis.anon_id,
            analysis_id: analysis.id,
            recommended_at: analysis.analyzed_at,
            category: rec.category,
            content: rec.content,
            status: "pending",
          });
        if (!insertError) {
          totalInserted++;
          logs.push({
            analysis_id: analysis.id,
            category: rec.category,
            content: rec.content,
          });
        }
      }
    }

    return NextResponse.json({
      totalAnalyzed: analyses?.length || 0,
      totalInserted,
      totalSkipped,
      logs,
    });
  } catch (error) {
    return apiError({
      error,
      userMessage: "추천 추출 중 오류가 발생했습니다.",
      status: 500,
    });
  }
}
