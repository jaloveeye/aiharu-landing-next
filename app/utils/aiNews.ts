import { createClient } from "@/app/utils/supabase/client";

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
  created_at: string;
  updated_at: string;
}

// 오늘의 AI 뉴스 가져오기
export async function getTodayAINews(): Promise<AINews[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('ai_news')
    .select('*')
    .gte('published_at', `${today}T00:00:00`)
    .lte('published_at', `${today}T23:59:59`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching today\'s AI news:', error);
    return [];
  }

  return data || [];
}

// 최근 AI 뉴스 가져오기 (최근 7일)
export async function getRecentAINews(limit: number = 20): Promise<AINews[]> {
  const supabase = createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data, error } = await supabase
    .from('ai_news')
    .select('*')
    .gte('published_at', sevenDaysAgo.toISOString())
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent AI news:', error);
    return [];
  }

  return data || [];
}

// 카테고리별 AI 뉴스 가져오기
export async function getAINewsByCategory(category: string, limit: number = 10): Promise<AINews[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ai_news')
    .select('*')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching AI news by category:', error);
    return [];
  }

  return data || [];
}

// AI 뉴스 저장
export async function saveAINews(news: Omit<AINews, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('ai_news')
    .insert([news]);

  if (error) {
    console.error('Error saving AI news:', error);
    return false;
  }

  return true;
}

// 중복 뉴스 확인 (URL 기준)
export async function isDuplicateNews(url: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ai_news')
    .select('id')
    .eq('url', url)
    .limit(1);

  if (error) {
    console.error('Error checking duplicate news:', error);
    return false;
  }

  return data && data.length > 0;
}

// AI 뉴스 요약 생성
export async function generateNewsSummary(content: string): Promise<string> {
  try {
    const response = await fetch('/api/summarize-news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error generating news summary:', error);
    return content.slice(0, 200) + '...';
  }
}
