import { createClient as createServerClient } from "@/app/utils/supabase/server";

export interface AINews {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  published_at: string;
  category: string;
  tags: string[];
  summary?: string;
  quality_score?: number;
  created_at: string;
  updated_at: string;
}

// 오늘의 AI 뉴스 가져오기
export async function getTodayAINews(): Promise<AINews[]> {
  const supabase = await createServerClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("ai_news")
    .select("*")
    .gte("published_at", `${today}T00:00:00`)
    .lte("published_at", `${today}T23:59:59`)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching today's AI news:", error);
    return [];
  }

  return data || [];
}

// 최근 AI 뉴스 가져오기 (최근 30일, 품질 점수 순으로 정렬)
export async function getRecentAINews(): Promise<AINews[]> {
  const supabase = await createServerClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from("ai_news")
    .select("*")
    .gte("published_at", thirtyDaysAgo.toISOString())
    .order("published_at", { ascending: false })
    .order("quality_score", { ascending: false });

  if (error) {
    console.error("Error fetching recent AI news:", error);
    return [];
  }

  console.log(`[getRecentAINews] 조회된 뉴스 개수: ${data?.length || 0}`);
  return data || [];
}

// 모든 AI 뉴스 가져오기 (페이지네이션용)
export async function getAllAINews(): Promise<AINews[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("ai_news")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching all AI news:", error);
    return [];
  }

  console.log(`[getAllAINews] 조회된 뉴스 개수: ${data?.length || 0}`);
  return data || [];
}

// 카테고리별 AI 뉴스 가져오기
export async function getAINewsByCategory(
  category: string,
  limit: number = 10
): Promise<AINews[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("ai_news")
    .select("*")
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching AI news by category:", error);
    return [];
  }

  return data || [];
}

// AI 뉴스 저장
export async function saveAINews(
  news: Omit<AINews, "id" | "created_at" | "updated_at">
): Promise<boolean> {
  const supabase = await createServerClient();

  const { error } = await supabase.from("ai_news").insert([news]);

  if (error) {
    console.error("Error saving AI news:", error);
    return false;
  }

  return true;
}

// 중복 뉴스 확인 (URL 기준)
export async function isDuplicateNews(url: string): Promise<boolean> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("ai_news")
    .select("id")
    .eq("url", url)
    .limit(1);

  if (error) {
    console.error("Error checking duplicate news:", error);
    return false;
  }

  return data && data.length > 0;
}

// AI 뉴스 요약 생성
export async function generateNewsSummary(content: string): Promise<string> {
  try {
    const response = await fetch("/api/summarize-news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate summary");
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Error generating news summary:", error);
    return content.slice(0, 200) + "...";
  }
}
