import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/app/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 전체 뉴스 개수 조회
    const { count: totalCount, error: countError } = await supabase
      .from("ai_news")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Error getting total count:", countError);
    }
    
    // 최근 7일 뉴스 개수 조회
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentCount, error: recentError } = await supabase
      .from("ai_news")
      .select("*", { count: "exact", head: true })
      .gte("published_at", sevenDaysAgo.toISOString());
    
    if (recentError) {
      console.error("Error getting recent count:", recentError);
    }
    
    // 최근 30일 뉴스 개수 조회
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: monthlyCount, error: monthlyError } = await supabase
      .from("ai_news")
      .select("*", { count: "exact", head: true })
      .gte("published_at", thirtyDaysAgo.toISOString());
    
    if (monthlyError) {
      console.error("Error getting monthly count:", monthlyError);
    }
    
    // 최신 뉴스 5개 조회
    const { data: latestNews, error: latestError } = await supabase
      .from("ai_news")
      .select("id, title, published_at, created_at")
      .order("published_at", { ascending: false })
      .limit(5);
    
    if (latestError) {
      console.error("Error getting latest news:", latestError);
    }
    
    // 카테고리별 뉴스 개수 조회
    const { data: categoryStats, error: categoryError } = await supabase
      .from("ai_news")
      .select("category")
      .not("category", "is", null);
    
    if (categoryError) {
      console.error("Error getting category stats:", categoryError);
    }
    
    const categoryCounts = categoryStats?.reduce((acc: any, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}) || {};
    
    return NextResponse.json({
      message: "뉴스 데이터베이스 상태 조회 완료",
      stats: {
        total: totalCount || 0,
        recent_7_days: recentCount || 0,
        recent_30_days: monthlyCount || 0,
        categories: categoryCounts,
        latest_news: latestNews || [],
      },
      debug_info: {
        seven_days_ago: sevenDaysAgo.toISOString(),
        thirty_days_ago: thirtyDaysAgo.toISOString(),
        current_time: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error("Debug news API error:", error);
    return NextResponse.json(
      { error: "뉴스 데이터베이스 상태 조회 중 오류가 발생했습니다.", details: error },
      { status: 500 }
    );
  }
}
