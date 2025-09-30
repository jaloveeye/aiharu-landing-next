import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { saveAINews, isDuplicateNews } from "@/app/utils/aiNews";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI 관련성 검증 함수
async function isAIRelatedNews(title: string, description: string, content: string): Promise<boolean> {
  try {
    const text = `${title} ${description || ''} ${content || ''}`.toLowerCase();
    
    // AI 관련 키워드 (긍정적)
    const aiKeywords = [
      '인공지능', 'ai', '머신러닝', '딥러닝', 'chatgpt', 'gpt', 'claude', 'gemini',
      '자동화', '로봇', '봇', '알고리즘', '데이터', '빅데이터', '분석', '예측',
      '스마트', '디지털', '기술', '혁신', '프롬프트', 'llm', '대화형', '생성형'
    ];
    
    // 제외할 키워드 (부정적)
    const excludeKeywords = [
      '주식', '증권', '투자', '금융', '경제', '부동산', '정치', '선거', '정부',
      '법원', '재판', '사건', '사고', '범죄', '경찰', '검찰', '체육', '스포츠',
      '연예', '가수', '배우', '드라마', '영화', '음악', '패션', '뷰티', '화장품'
    ];
    
    // 제외 키워드가 포함되어 있으면 false
    if (excludeKeywords.some(keyword => text.includes(keyword))) {
      return false;
    }
    
    // AI 키워드가 포함되어 있으면 true
    return aiKeywords.some(keyword => text.includes(keyword));
  } catch (error) {
    console.error("AI 관련성 검증 오류:", error);
    return true; // 오류 시 기본적으로 포함
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
      // 한국어 뉴스 수집 (AI + 육아 관련 키워드 포함)
      const koResponse = await fetch(
        `https://newsapi.org/v2/everything?q=인공지능 OR AI OR 머신러닝 OR 딥러닝 OR (AI AND 육아) OR (인공지능 AND 육아) OR (AI AND 교육) OR (인공지능 AND 교육)&language=ko&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
      );
      const koData = await koResponse.json();

      if (koData.articles) {
        // AI 관련성 검증 후 필터링
        const filteredArticles = [];
        for (const article of koData.articles) {
          const isRelated = await isAIRelatedNews(
            article.title || '',
            article.description || '',
            article.content || ''
          );
          
          if (isRelated) {
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
            console.log(`[collect-ai-news] AI 관련성 없음으로 제외: ${article.title}`);
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
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=인공지능 OR AI OR (AI AND 육아) OR (AI AND 교육)&lang=ko&country=kr&max=10&apikey=${gnewsApiKey}`
      );
      const data = await response.json();

      if (data.articles) {
        // AI 관련성 검증 후 필터링
        const filteredArticles = [];
        for (const article of data.articles) {
          const isRelated = await isAIRelatedNews(
            article.title || '',
            article.description || '',
            article.content || ''
          );
          
          if (isRelated) {
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
            console.log(`[collect-ai-news] AI 관련성 없음으로 제외: ${article.title}`);
          }
        }
        
        news.push(...filteredArticles);
        console.log(`[collect-ai-news] GNews: ${data.articles.length}개 중 ${filteredArticles.length}개 AI 관련 뉴스 수집`);
      }
    } catch (error) {
      console.error("[collect-ai-news] Error fetching from GNews:", error);
    }
  }

  // 일일 최대 10개로 제한
  const maxDailyNews = 10;
  const limitedNews = news.slice(0, maxDailyNews);
  
  if (news.length > maxDailyNews) {
    console.log(`[collect-ai-news] 일일 최대 ${maxDailyNews}개 제한: ${news.length}개 → ${limitedNews.length}개`);
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

    let savedCount = 0;

    // 각 뉴스 처리
    for (const news of rawNews) {
      try {
        // 중복 확인
        const isDuplicate = await isDuplicateNews(news.url);
        if (isDuplicate) {
          console.log("중복 뉴스 건너뛰기:", news.title);
          continue;
        }

        // 카테고리 분류
        const classificationSource =
          news.content || news.description || news.title || "";
        const category = await classifyNewsCategory(
          news.title,
          classificationSource
        );

        // 요약 생성
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

        // 뉴스 저장
        const success = await saveAINews({
          title: news.title,
          description: news.description,
          content: news.content,
          url: news.url,
          source: news.source,
          published_at: news.published_at,
          category: category,
          tags: news.tags,
          summary: summary,
        });

        if (success) {
          savedCount++;
          console.log("뉴스 저장 완료:", news.title);
        }

        // API 호출 간격 조절
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("뉴스 처리 중 오류:", error);
      }
    }

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

      let savedCount = 0;

      for (const news of rawNews) {
        try {
          const duplicate = await isDuplicateNews(news.url);
          if (duplicate) {
            console.log("중복 뉴스 건너뛰기:", news.title);
            continue;
          }

          const classificationSource =
            news.content || news.description || news.title || "";
          const category = await classifyNewsCategory(
            news.title,
            classificationSource
          );

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
            tags: news.tags,
            summary,
          });

          if (success) {
            savedCount++;
            console.log("뉴스 저장 완료:", news.title);
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("뉴스 처리 중 오류:", error);
        }
      }

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
