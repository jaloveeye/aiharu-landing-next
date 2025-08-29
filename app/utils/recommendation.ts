import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import {
  NUTRIENT_CATEGORIES,
  NUTRIENT_CATEGORY_KEYWORDS,
} from "@/app/utils/constants";

export function extractRecommendations(
  result: string
): { category: string; content: string }[] {
  const recommendations: { category: string; content: string }[] = [];
  // 영양소 카테고리만 남김
  const categories = NUTRIENT_CATEGORIES;

  // 1. 개선된 포맷: '부족한 영양소: [영양소1, ...]' 한 줄 파싱
  const nutrientLine = result.match(/부족한 영양소[:：]?\s*\[([^\]]+)\]/);
  if (nutrientLine && nutrientLine[1]) {
    const nutrients = nutrientLine[1]
      .split(/,|，/)
      .map((n) => n.trim())
      .filter(Boolean);
    for (const n of nutrients) {
      // 카테고리 매칭
      const found = categories.find((c) => n.includes(c.key));
      if (found) {
        recommendations.push({
          category: found.label,
          content: `${found.label} 보충이 필요합니다.`,
        });
      } else if (n) {
        recommendations.push({
          category: n,
          content: `${n} 보충이 필요합니다.`,
        });
      }
    }
  }

  /*
  // 기존 추천/보완 문장 기반 추출(백업)
  const matches = result.match(/(추천|보완)[:：]?([\s\S]*)/g);
  if (matches) {
    matches.forEach((match) => {
      match.split("\n").forEach((line) => {
        for (const { key, label } of categories) {
          if (line.includes(key)) {
            recommendations.push({ category: label, content: line.trim() });
          }
        }
      });
    });
  }
  */
  return recommendations;
}

export async function saveRecommendationsFromAnalysis(analysis: {
  id: string;
  anon_id: string;
  result: string;
  analyzed_at: string;
}) {
  const supabase = await createClient();
  const recs = extractRecommendations(analysis.result);
  for (const rec of recs) {
    // 중복 체크: 같은 analysis_id, content, category가 이미 있으면 skip
    const { data: exists } = await supabase
      .from("recommendation_history")
      .select("id")
      .eq("analysis_id", analysis.id)
      .eq("content", rec.content)
      .eq("category", rec.category)
      .maybeSingle();
    if (exists) continue;
    await supabase.from("recommendation_history").insert({
      anon_id: analysis.anon_id,
      analysis_id: analysis.id,
      recommended_at: analysis.analyzed_at,
      category: rec.category,
      content: rec.content,
      status: "pending",
    });
  }
}

export function generateFeedbacks(
  prevRecs: {
    id: string;
    category: string;
    content: string;
    analysis_id: string;
  }[],
  todayMealText: string,
  todayResult: string
): {
  id: string;
  category: string;
  content: string;
  analysis_id: string;
  feedback: string;
  achieved: boolean;
}[] {
  // 카테고리별로 실천 여부 판별 규칙
  const categoryKeywords = NUTRIENT_CATEGORY_KEYWORDS;

  return prevRecs.map((rec) => {
    const keywords = categoryKeywords[rec.category] || [rec.category];
    const achieved = keywords.some(
      (kw) => todayMealText?.includes(kw) || todayResult?.includes(kw)
    );
    return {
      ...rec,
      achieved,
      feedback: achieved
        ? `지난번 '${rec.content}' (카테고리: ${rec.category}) 추천을 실천하셨네요! 잘하셨습니다.`
        : `아직 '${rec.content}' (카테고리: ${rec.category}) 추천을 실천하지 않으셨습니다.`,
    };
  });
}
