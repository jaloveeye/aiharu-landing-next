import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// 개선된 추천 추출 함수
function extractRecommendations(
  result: string
): { category: string; content: string }[] {
  const recommendations: { category: string; content: string }[] = [];
  const matches = result.match(/(추천|보완)[:：]?([\s\S]*)/g);
  if (matches) {
    matches.forEach((match) => {
      match.split("\n").forEach((line) => {
        const categories = [
          { key: "단백질", label: "단백질" },
          { key: "비타민", label: "비타민" },
          { key: "지방", label: "지방" },
          { key: "과일", label: "과일" },
          { key: "야채", label: "야채" },
          { key: "채소", label: "야채" },
          { key: "칼슘", label: "칼슘" },
          { key: "식이섬유", label: "식이섬유" },
          { key: "우유", label: "유제품" },
          { key: "요거트", label: "유제품" },
          { key: "유제품", label: "유제품" },
        ];
        let found = false;
        for (const { key, label } of categories) {
          if (line.includes(key)) {
            recommendations.push({ category: label, content: line.trim() });
            found = true;
          }
        }
        // 카테고리 키워드가 하나도 없더라도, 추천/보완 문장 자체를 남기고 싶으면 아래 주석 해제
        // if (!found && line.trim()) {
        //   recommendations.push({ category: '기타', content: line.trim() });
        // }
      });
    });
  }
  return recommendations;
}

export async function POST(req: NextRequest) {
  const supabase = createClient(cookies());

  // 1. 기존 분석 결과 일부(예: 20개) 불러오기
  const { data: analyses, error } = await supabase
    .from("meal_analysis")
    .select("id, anon_id, result, analyzed_at")
    .order("analyzed_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let totalInserted = 0;
  let totalSkipped = 0;
  let logs: any[] = [];

  for (const analysis of analyses) {
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
    totalAnalyzed: analyses.length,
    totalInserted,
    totalSkipped,
    logs,
  });
}
