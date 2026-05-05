import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/app/utils/supabase/server";
import { apiError } from "@/app/utils/apiError";

type AiNewsCategoryRow = {
  category: string | null;
};

type AiNewsLatestRow = {
  id: string;
  title: string;
  published_at: string;
  created_at: string;
};

function getSafeCountResponse(
  label: string,
  result: { count: number | null; error: unknown }
) {
  if (result.error) {
    console.error(`Error getting ${label}:`, result.error);
  }

  return result.count || 0;
}

function buildCategoryCounts(rows: AiNewsCategoryRow[]) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const category = row.category?.trim();
    if (!category) {
      return acc;
    }
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
}

export async function GET() {
  try {
    const supabase = await createServerClient();

    const now = new Date();

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const totalResult = await supabase
      .from("ai_news")
      .select("*", { count: "exact", head: true });

    const recentResult = await supabase
      .from("ai_news")
      .select("*", { count: "exact", head: true })
      .gte("published_at", sevenDaysAgo.toISOString());

    const monthlyResult = await supabase
      .from("ai_news")
      .select("*", { count: "exact", head: true })
      .gte("published_at", thirtyDaysAgo.toISOString());

    const latestNewsResult = await supabase
      .from("ai_news")
      .select("id, title, published_at, created_at")
      .order("published_at", { ascending: false })
      .limit(5);

    const categoryStatsResult = await supabase
      .from("ai_news")
      .select("category")
      .not("category", "is", null);

    const totalCount = getSafeCountResponse("total count", totalResult);
    const recentCount = getSafeCountResponse("recent count", recentResult);
    const monthlyCount = getSafeCountResponse("monthly count", monthlyResult);
    const latestNews = latestNewsResult.data || [];
    const categoryRows = (categoryStatsResult.data as AiNewsCategoryRow[]) || [];

    if (categoryStatsResult.error) {
      console.error("Error getting category stats:", categoryStatsResult.error);
    }

    if (latestNewsResult.error) {
      console.error("Error getting latest news:", latestNewsResult.error);
      return apiError({
        error: latestNewsResult.error,
        userMessage: "뉴스 목록 조회 중 오류가 발생했습니다.",
        status: 500,
      });
    }

    return NextResponse.json({
      message: "뉴스 데이터베이스 상태 조회 완료",
      stats: {
        total: totalCount,
        recent_7_days: recentCount,
        recent_30_days: monthlyCount,
        categories: buildCategoryCounts(categoryRows),
        latest_news: latestNews as AiNewsLatestRow[],
      },
      debug_info: {
        seven_days_ago: sevenDaysAgo.toISOString(),
        thirty_days_ago: thirtyDaysAgo.toISOString(),
        current_time: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Debug news API error:", error);
    return apiError({
      error,
      userMessage: "뉴스 데이터베이스 상태 조회 중 오류가 발생했습니다.",
      status: 500,
    });
  }
}
