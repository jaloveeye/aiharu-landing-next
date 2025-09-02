import { createClient } from "@/app/utils/supabase/client";
import { promptTemplates, PromptExample } from "@/data/prompts";

export interface PromptResult {
  id: string;
  prompt_id: string;
  prompt_title: string;
  prompt_content: string;
  prompt_category: string;
  prompt_difficulty: string;
  prompt_tags: string[];
  ai_result: string;
  ai_model?: string;
  tokens_used?: number;
  created_at: string;
  updated_at: string;
}

// 오늘 날짜의 프롬프트 결과가 있는지 확인 (단일)
export async function getTodayPromptResult(): Promise<PromptResult | null> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('prompt_results')
    .select('*')
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116는 결과가 없을 때
    console.error('Error fetching today\'s prompt result:', error);
    return null;
  }

  return data;
}

// 오늘 날짜의 모든 프롬프트 결과 가져오기
export async function getTodayAllPromptResults(): Promise<PromptResult[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('prompt_results')
    .select('*')
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching today\'s prompt results:', error);
    return [];
  }

  return data || [];
}

// 모든 프롬프트 결과 가져오기 (최신순)
export async function getAllPromptResults(): Promise<PromptResult[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('prompt_results')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prompt results:', error);
    return [];
  }

  return data || [];
}

// 카테고리별 프롬프트 결과 가져오기
export async function getPromptResultsByCategory(category: string): Promise<PromptResult[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('prompt_results')
    .select('*')
    .eq('prompt_category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prompt results by category:', error);
    return [];
  }

  return data || [];
}

// 랜덤 프롬프트 선택 (오늘 사용되지 않은 것 중에서)
export function getRandomUnusedPrompt(): PromptExample {
  // 실제로는 오늘 사용된 프롬프트를 제외하고 선택해야 하지만,
  // 지금은 단순히 랜덤 선택
  const randomIndex = Math.floor(Math.random() * promptTemplates.length);
  return promptTemplates[randomIndex];
}

// 맥락 인식을 위한 최근 프롬프트 결과 가져오기
export async function getRecentContextForCategory(category: string, limit: number = 3): Promise<PromptResult[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('prompt_results')
    .select('*')
    .eq('prompt_category', category)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent context for category:', error);
    return [];
  }

  return data || [];
}

// 카테고리별 맥락 요약 생성
export function generateContextSummary(results: PromptResult[]): string {
  if (results.length === 0) return '';
  
  const recentTopics = results.map(result => {
    const title = result.prompt_title;
    const content = result.prompt_content.substring(0, 100);
    const date = new Date(result.created_at).toLocaleDateString('ko-KR');
    return `[${date}] ${title}: ${content}...`;
  }).join('\n');
  
  return `최근 ${results.length}일간 다룬 주제들:\n${recentTopics}`;
}

// 프롬프트 결과 저장
export async function savePromptResult(
  prompt: PromptExample,
  aiResult: string,
  model: string = 'gpt-4',
  tokensUsed?: number
): Promise<string | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('prompt_results')
    .insert({
      prompt_id: prompt.id,
      prompt_title: prompt.title,
      prompt_content: prompt.prompt,
      prompt_category: prompt.category,
      prompt_difficulty: prompt.difficulty,
      prompt_tags: prompt.tags,
      ai_result: aiResult,
      ai_model: model,
      tokens_used: tokensUsed
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving prompt result:', error);
    return null;
  }

  return data?.id || null;
}

// 매일 자동 생성된 프롬프트 결과 가져오기 (최근 30일)
export async function getRecentPromptResults(limit: number = 30): Promise<PromptResult[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('prompt_results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent prompt results:', error);
    return [];
  }

  return data || [];
}

// 카테고리별 프롬프트 개수 가져오기
export async function getPromptCountByCategory(): Promise<Record<string, number>> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('prompt_results')
    .select('prompt_category');

  if (error) {
    console.error('Error fetching prompt counts by category:', error);
    return {};
  }

  // 카테고리별 개수 계산
  const counts: Record<string, number> = {};
  data?.forEach((item) => {
    const category = item.prompt_category;
    counts[category] = (counts[category] || 0) + 1;
  });

  return counts;
}

// 프롬프트 결과에 벡터 저장
export async function updatePromptEmbedding(promptId: string, embedding: number[]): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('prompt_results')
      .update({ embedding })
      .eq('id', promptId);

    if (error) {
      console.error('Error updating prompt embedding:', error);
      return false;
    }

    console.log(`벡터 업데이트 완료: ${promptId}`);
    return true;
  } catch (error) {
    console.error('Error updating prompt embedding:', error);
    return false;
  }
}

// 프롬프트 결과에 벡터 저장 (ID로)
export async function updatePromptEmbeddingById(id: string, embedding: number[]): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('prompt_results')
      .update({ embedding })
      .eq('id', id);

    if (error) {
      console.error('Error updating prompt embedding by ID:', error);
      return false;
    }

    console.log(`벡터 업데이트 완료 (ID): ${id}`);
    return true;
  } catch (error) {
    console.error('Error updating prompt embedding by ID:', error);
    return false;
  }
}
