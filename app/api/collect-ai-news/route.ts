import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { saveAINews, isDuplicateNews } from "@/app/utils/aiNews";
import aiNewsFilter from "@/lib/ai-news-filter";

const {
  buildNewsApiUrl,
  buildGNewsUrl,
  evaluateAINewsRelevance,
  limitAndSortNews,
  MIN_QUALITY_SCORE,
} = aiNewsFilter;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 제목 유사도 계산 함수 (간단한 Jaccard 유사도)
function calculateTitleSimilarity(title1: string, title2: string): number {
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거
        .replace(/\s+/g, ' ') // 공백 정규화
        .trim();
  
  const words1 = new Set(normalize(title1).split(' '));
  const words2 = new Set(normalize(title2).split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// 중복 뉴스 감지 (제목 유사도 기반)
async function isDuplicateNewsAdvanced(news: any): Promise<boolean> {
  try {
    // URL 기반 중복 확인 (기존 방식)
    const urlDuplicate = await isDuplicateNews(news.url);
    if (urlDuplicate) return true;
    
    // 제목 유사도 기반 중복 확인
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // 최근 7일간의 뉴스에서 유사한 제목 찾기
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentNews, error } = await supabase
      .from('ai_news')
      .select('title')
      .gte('published_at', sevenDaysAgo.toISOString())
      .limit(100);
    
    if (error || !recentNews) return false;
    
    // 유사도 0.7 이상이면 중복으로 판단
    const SIMILARITY_THRESHOLD = 0.7;
    for (const existingNews of recentNews) {
      const similarity = calculateTitleSimilarity(news.title, existingNews.title);
      if (similarity >= SIMILARITY_THRESHOLD) {
        console.log(`[collect-ai-news] 유사한 제목 발견 (유사도: ${similarity.toFixed(2)}): "${existingNews.title}" vs "${news.title}"`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("중복 뉴스 감지 오류:", error);
    return false;
  }
}

// 뉴스 API에서 AI 관련 뉴스 수집
async function fetchNewsFromAPI() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const gnewsApiKey = process.env.GNEWS_API_KEY;

  const news: any[] = [];

  if (!newsApiKey && !gnewsApiKey) {
    console.warn(
      "[collect-ai-news] NEWS_API_KEY/GNEWS_API_KEY 모두 누락: 외부 뉴스 수집 불가"
    );
  }

  // NewsAPI에서 AI 뉴스 수집 (한국어만)
  if (newsApiKey) {
    try {
      const koResponse = await fetch(buildNewsApiUrl(newsApiKey));
      const koData = await koResponse.json();

      if (koData.articles) {
        // AI 관련성 검증 후 필터링
        const filteredArticles = [];
        for (const article of koData.articles) {
          const relevance = evaluateAINewsRelevance(
            article.title || '',
            article.description || '',
            article.content || ''
          );
          
          if (relevance.isRelevant) {
            filteredArticles.push({
              title: article.title,
              description: article.description,
              content: article.content,
              url: article.url,
              source: article.source.name,
              published_at: article.publishedAt,
              category: "AI Technology",
              tags: ["AI", "Technology", "한국어"],
            });
          } else {
            console.log(
              `[collect-ai-news] AI 관련성 부족으로 제외 (${relevance.reason}, score=${relevance.score}): ${article.title}`
            );
          }
        }
        
        news.push(...filteredArticles);
        console.log(`[collect-ai-news] NewsAPI: ${koData.articles.length}개 중 ${filteredArticles.length}개 AI 관련 뉴스 수집`);
      }
    } catch (error) {
      console.error("[collect-ai-news] Error fetching from NewsAPI:", error);
    }
  }

  // GNews에서 AI 뉴스 수집 (한국어만)
  if (gnewsApiKey) {
    try {
      const response = await fetch(buildGNewsUrl(gnewsApiKey));
      const data = await response.json();

      if (data.articles) {
        // AI 관련성 검증 후 필터링
        const filteredArticles = [];
        for (const article of data.articles) {
          const relevance = evaluateAINewsRelevance(
            article.title || '',
            article.description || '',
            article.content || ''
          );
          
          if (relevance.isRelevant) {
            filteredArticles.push({
              title: article.title,
              description: article.description,
              content: article.content,
              url: article.url,
              source: article.source.name,
              published_at: article.publishedAt,
              category: "AI Technology",
              tags: ["AI", "Technology", "한국어"],
            });
          } else {
            console.log(
              `[collect-ai-news] AI 관련성 부족으로 제외 (${relevance.reason}, score=${relevance.score}): ${article.title}`
            );
          }
        }
        
        news.push(...filteredArticles);
        console.log(`[collect-ai-news] GNews: ${data.articles.length}개 중 ${filteredArticles.length}개 AI 관련 뉴스 수집`);
      }
    } catch (error) {
      console.error("[collect-ai-news] Error fetching from GNews:", error);
    }
  }

  // 최신순 정렬 후 일일 최대 건수 제한
  const limitedNews = limitAndSortNews(news);
  
  if (news.length > limitedNews.length) {
    console.log(`[collect-ai-news] 일일 최대 ${limitedNews.length}개 제한: ${news.length}개 → ${limitedNews.length}개`);
  }
  
  return limitedNews;
}

// 뉴스 내용 요약 생성 (원문 없이도 이해 가능한 자체충분 요약: 한 줄 요약 + 불릿 핵심 포인트)
async function generateNewsSummary(content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "너는 AI 뉴스 요약 전문가다. 사용자가 원문을 보지 않아도 이해하도록 한국어로 자체충분 요약을 작성한다. 형식: 1) 한 줄 요약 1문장 2) 핵심 포인트 2-3개 불릿(각 18자 이내). 과장 금지, 사실 중심, 불필요한 수식어 금지.",
        },
        {
          role: "user",
          content: content.slice(0, 3000),
        },
      ],
      max_tokens: 220,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content || content.slice(0, 200) + "..."
    );
  } catch (error) {
    console.error("Error generating summary:", error);
    return content.slice(0, 200) + "...";
  }
}

// 뉴스 품질 점수 계산
async function calculateNewsQualityScore(news: any): Promise<number> {
  try {
    let score = 0;
    
    // 1. 제목 길이 점수 (20-100자 사이가 이상적)
    const titleLength = news.title?.length || 0;
    if (titleLength >= 20 && titleLength <= 100) {
      score += 20;
    } else if (titleLength >= 10 && titleLength <= 150) {
      score += 10;
    }
    
    // 2. 설명 존재 여부
    if (news.description && news.description.length > 50) {
      score += 15;
    }
    
    // 3. 본문 길이 점수
    const contentLength = news.content?.length || 0;
    if (contentLength >= 200) {
      score += 25;
    } else if (contentLength >= 100) {
      score += 15;
    }
    
    // 4. 소스 신뢰도 점수
    const trustedSources = [
      '연합뉴스', '뉴시스', '매일경제', '한국경제', '조선일보', '중앙일보', '동아일보', '한겨레', '경향신문',
      'ZDNet Korea', 'IT조선', '전자신문', '디지털데일리', '테크크런치', '아이티데일리'
    ];
    const sourceName = news.source?.toLowerCase() || '';
    if (trustedSources.some(source => sourceName.includes(source.toLowerCase()))) {
      score += 20;
    } else if (sourceName.includes('뉴스') || sourceName.includes('데일리') || sourceName.includes('타임스')) {
      score += 10;
    }
    
    // 5. AI 관련성 점수 (키워드 밀도)
    const text = `${news.title} ${news.description || ''} ${news.content || ''}`.toLowerCase();
    const aiKeywords = ['인공지능', 'ai', '머신러닝', '딥러닝', 'chatgpt', 'gpt', 'claude', 'gemini', '자동화', '로봇'];
    const keywordCount = aiKeywords.filter(keyword => text.includes(keyword)).length;
    score += Math.min(keywordCount * 5, 20); // 최대 20점
    
    // 6. 최신성 점수 (24시간 이내면 높은 점수)
    const publishedDate = new Date(news.published_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);
    if (hoursDiff <= 24) {
      score += 20;
    } else if (hoursDiff <= 72) {
      score += 10;
    }
    
    return Math.min(score, 100); // 최대 100점
  } catch (error) {
    console.error("뉴스 품질 점수 계산 오류:", error);
    return 50; // 기본 점수
  }
}

// 자동 키워드 추출
async function extractKeywords(title: string, content: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "다음 뉴스에서 핵심 키워드를 3-5개 추출해주세요. AI, 기술, 회사명, 제품명 등을 우선적으로 포함하세요. 답변은 쉼표로 구분된 키워드만 작성하세요.",
        },
        {
          role: "user",
          content: `제목: ${title}\n내용: ${content.slice(0, 1000)}`,
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const keywords = completion.choices[0]?.message?.content?.trim() || "";
    return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  } catch (error) {
    console.error("키워드 추출 오류:", error);
    return [];
  }
}

// 뉴스 카테고리 분류
async function classifyNewsCategory(
  title: string,
  content: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "다음 카테고리 중 하나로 뉴스를 분류해주세요: AI Technology, AI Research, AI Business, AI Ethics, AI Tools, AI Parenting. 육아, 교육, 부모 관련 내용이 있으면 'AI Parenting'으로 분류하세요. 답변은 카테고리명만 작성하세요.",
        },
        {
          role: "user",
          content: `제목: ${title}\n내용: ${content.slice(0, 500)}`,
        },
      ],
      max_tokens: 50,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content?.trim() || "AI Technology";
  } catch (error) {
    console.error("Error classifying news:", error);
    return "AI Technology";
  }
}

async function processCollectedNews(rawNews: any[]): Promise<number> {
  let savedCount = 0;

  // 병렬 처리로 뉴스 처리 (최대 3개씩 동시 처리)
  const BATCH_SIZE = 3;
  const batches = [];
  for (let i = 0; i < rawNews.length; i += BATCH_SIZE) {
    batches.push(rawNews.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (news) => {
      try {
        const duplicate = await isDuplicateNewsAdvanced(news);
        if (duplicate) {
          console.log("중복 뉴스 건너뛰기:", news.title);
          return null;
        }

        const qualityScore = await calculateNewsQualityScore(news);
        console.log(`[collect-ai-news] 뉴스 품질 점수: ${qualityScore}/100 - ${news.title}`);

        if (qualityScore < MIN_QUALITY_SCORE) {
          console.log(`[collect-ai-news] 품질 점수 부족으로 제외: ${qualityScore}/100 - ${news.title}`);
          return null;
        }

        const classificationSource =
          news.content || news.description || news.title || "";
        const category = await classifyNewsCategory(
          news.title,
          classificationSource
        );

        const extractedKeywords = await extractKeywords(
          news.title,
          classificationSource
        );
        const finalTags = [...(news.tags || []), ...extractedKeywords].slice(0, 5);

        const summaryInput = [
          news.title ? `제목: ${news.title}` : "",
          news.description ? `설명: ${news.description}` : "",
          news.content ? `본문: ${news.content}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        const summary = await generateNewsSummary(
          summaryInput || news.title || ""
        );

        const success = await saveAINews({
          title: news.title,
          description: news.description,
          content: news.content,
          url: news.url,
          source: news.source,
          published_at: news.published_at,
          category,
          tags: finalTags,
          summary,
          quality_score: qualityScore,
        });

        if (success) {
          console.log(`[collect-ai-news] 뉴스 저장 완료 (품질: ${qualityScore}/100): ${news.title}`);
          return true;
        }

        return false;
      } catch (error) {
        console.error("뉴스 처리 중 오류:", error);
        return false;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    const successfulCount = batchResults.filter(Boolean).length;
    savedCount += successfulCount;

    console.log(`[collect-ai-news] 배치 처리 완료: ${successfulCount}/${batch.length}개 저장`);

    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return savedCount;
}

export async function POST(request: NextRequest) {
  try {
    console.log("AI 뉴스 수집 시작...");

    // 뉴스 API에서 데이터 수집
    const rawNews = await fetchNewsFromAPI();

    if (rawNews.length === 0) {
      return NextResponse.json({
        message: "수집된 뉴스가 없습니다.",
        count: 0,
      });
    }

    const savedCount = await processCollectedNews(rawNews);

    console.log(`AI 뉴스 수집 완료: ${savedCount}개 저장됨`);

    return NextResponse.json({
      message: "AI 뉴스 수집이 완료되었습니다.",
      count: savedCount,
      total: rawNews.length,
    });
  } catch (error) {
    console.error("AI 뉴스 수집 중 오류:", error);
    return NextResponse.json(
      { error: "AI 뉴스 수집 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET 요청으로 최근 뉴스 조회
export async function GET(request: NextRequest) {
  try {
    // Vercel Cron 이거나 수동 트리거 쿼리인 경우 수집 실행
    const isCron = request.headers.get("x-vercel-cron");
    const url = new URL(request.url);
    const shouldCollect = url.searchParams.get("collect") === "1";

    if (isCron || shouldCollect) {
      console.log("[collect-ai-news][GET] 수집 트리거 감지 → 뉴스 수집 실행");

      // 뉴스 API에서 데이터 수집
      const rawNews = await fetchNewsFromAPI();

      if (rawNews.length === 0) {
        return NextResponse.json({
          message: "수집된 뉴스가 없습니다.",
          count: 0,
        });
      }

      const savedCount = await processCollectedNews(rawNews);

      console.log(`[collect-ai-news][GET] 수집 완료: ${savedCount}개 저장됨`);
      return NextResponse.json({
        message: "AI 뉴스 수집이 완료되었습니다.",
        count: savedCount,
        total: rawNews.length,
      });
    }

    // 기본: 최근 뉴스 조회 (모든 뉴스 조회)
    const { getRecentAINews, getAllAINews } = await import("@/app/utils/aiNews");
    
    // 먼저 최근 30일 뉴스 조회 (모든 뉴스)
    let recentNews = await getRecentAINews();
    
    // 만약 최근 뉴스가 없다면 모든 뉴스 조회
    if (recentNews.length === 0) {
      console.log("[collect-ai-news][GET] 최근 뉴스가 없어서 모든 뉴스 조회");
      recentNews = await getAllAINews();
    }
    
    console.log(`[collect-ai-news][GET] 반환할 뉴스 개수: ${recentNews.length}`);
    
    return NextResponse.json({
      message: "최근 AI 뉴스를 조회했습니다.",
      news: recentNews,
    });
  } catch (error) {
    console.error("AI 뉴스 조회/수집 중 오류:", error);
    return NextResponse.json(
      { error: "AI 뉴스 조회/수집 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
