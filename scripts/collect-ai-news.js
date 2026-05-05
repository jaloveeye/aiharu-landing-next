#!/usr/bin/env node

/**
 * AI 뉴스 수집 스크립트
 * GitHub Actions에서 실행되는 독립적인 뉴스 수집 스크립트
 */

const {
  buildNewsApiUrl,
  buildGNewsUrl,
  evaluateAINewsRelevance,
  limitAndSortNews,
  MIN_QUALITY_SCORE,
} = require("../lib/ai-news-filter");

const OPENAI_MODEL = "gpt-3.5-turbo";
const NEWS_PROVIDER_CATEGORY = "AI Technology";
const NEWS_PROCESS_DELAY_MS = 1000;
const SIMILARITY_THRESHOLD = 0.7;
const DEFAULT_SUMMARY = "뉴스 요약을 가져오지 못했습니다.";

const TRUSTED_SOURCES = [
  "연합뉴스",
  "뉴시스",
  "매일경제",
  "한국경제",
  "조선일보",
  "중앙일보",
  "동아일보",
  "한겨레",
  "경향신문",
  "ZDNet Korea",
  "IT조선",
  "전자신문",
  "디지털데일리",
  "테크크런치",
  "아이티데일리",
];

const AI_KEYWORDS = [
  "인공지능",
  "ai",
  "머신러닝",
  "딥러닝",
  "chatgpt",
  "gpt",
  "claude",
  "gemini",
  "자동화",
  "로봇",
];

const isDryRun = ["1", "true", "TRUE", "True"].includes(
  String(process.env.DRY_RUN || "").trim()
);

// 환경 변수 확인
const requiredEnvVars = [
  "OPENAI_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error("❌ 필수 환경 변수가 누락되었습니다:", missingVars.join(", "));
  process.exit(1);
}

console.log("🚀 AI 뉴스 수집 스크립트 시작");
console.log("📅 실행 시간:", new Date().toISOString());
console.log("🌍 시간대:", Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log("✅ 환경 변수 확인 완료");

// OpenAI 클라이언트 설정
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supabase 클라이언트 설정
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return JSON.stringify(error);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeArticleSource(article) {
  return article?.source && typeof article.source === "object"
    ? article.source.name || "Unknown"
    : "Unknown";
}

function toNewsItem(article, category) {
  return {
    title: article.title || "",
    description: article.description || "",
    content: article.content || "",
    url: article.url || "",
    source: normalizeArticleSource(article),
    published_at: article.publishedAt,
    category,
    tags: ["AI", "Technology", "한국어"],
  };
}

function collectRelevantNews(articles, providerName) {
  const filtered = [];

  for (const article of articles || []) {
    const relevance = evaluateAINewsRelevance(
      article.title || "",
      article.description || "",
      article.content || ""
    );

    if (relevance.isRelevant) {
      filtered.push(toNewsItem(article, NEWS_PROVIDER_CATEGORY));
    } else {
      console.log(
        `⏭️  AI 관련성 부족으로 제외 (${providerName}: ${relevance.reason}, score=${relevance.score}): ${article.title}`
      );
    }
  }

  return { filtered, total: Array.isArray(articles) ? articles.length : 0 };
}

async function fetchNewsFromProvider({ providerName, apiKey, buildUrl }) {
  if (!apiKey) {
    return [];
  }

  try {
    const response = await fetch(buildUrl(apiKey));
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`${providerName} 응답 오류 (${response.status}): ${message}`);
    }

    const data = await response.json();
    const { filtered, total } = collectRelevantNews(
      data?.articles || [],
      providerName
    );
    console.log(
      `✅ ${providerName}: ${total}개 중 ${filtered.length}개 AI 관련 뉴스 수집`
    );
    return filtered;
  } catch (error) {
    console.error(
      `❌ ${providerName} 뉴스 수집 오류:`,
      getErrorMessage(error)
    );
    return [];
  }
}

// 뉴스 API에서 AI 관련 뉴스 수집
async function fetchNewsFromAPI() {
  const providers = [
    { providerName: "NewsAPI", apiKey: process.env.NEWS_API_KEY, buildUrl: buildNewsApiUrl },
    { providerName: "GNews", apiKey: process.env.GNEWS_API_KEY, buildUrl: buildGNewsUrl },
  ];

  const allNews = [];

  if (!providers.some(({ apiKey }) => apiKey)) {
    console.warn("⚠️  NEWS_API_KEY/GNEWS_API_KEY 모두 누락: 외부 뉴스 수집 불가");
    return allNews;
  }

  for (const provider of providers) {
    allNews.push(...(await fetchNewsFromProvider(provider)));
  }

  // 최신순 정렬 후 일일 최대 건수 제한
  const limitedNews = limitAndSortNews(allNews);
  
  if (allNews.length > limitedNews.length) {
    console.log(
      `📊 일일 최대 ${limitedNews.length}개 제한: ${allNews.length}개 → ${limitedNews.length}개`
    );
  }
  
  return limitedNews;
}

async function runChatCompletion({ messages, maxTokens, temperature }) {
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  });

  return completion.choices[0]?.message?.content || "";
}

// 뉴스 내용 요약 생성
async function generateNewsSummary(content) {
  try {
    const summary = await runChatCompletion({
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
      maxTokens: 220,
      temperature: 0.7,
    });

    return summary || content.slice(0, 200) + "...";
  } catch (error) {
    console.error("❌ 요약 생성 오류:", getErrorMessage(error));
    return DEFAULT_SUMMARY;
  }
}

// 제목 유사도 계산 함수 (간단한 Jaccard 유사도)
function calculateTitleSimilarity(title1, title2) {
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const words1 = new Set(normalize(title1).split(" ").filter(Boolean));
  const words2 = new Set(normalize(title2).split(" ").filter(Boolean));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) return 0;

  const intersection = new Set([...words1].filter((item) => words2.has(item)));
  return intersection.size / union.size;
}

// 중복 뉴스 감지 (제목 유사도 기반)
async function isDuplicateNewsAdvanced(news) {
  try {
    // URL 기반 중복 확인 (기존 방식)
    const urlDuplicate = await isDuplicateNews(news.url);
    if (urlDuplicate) return true;
    
    // 최근 7일간의 뉴스에서 유사한 제목 찾기
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentNews, error } = await supabase
      .from("ai_news")
      .select("title")
      .gte("published_at", sevenDaysAgo.toISOString())
      .limit(100);

    if (error || !recentNews || recentNews.length === 0) return false;

    // 유사도 임계값 이상이면 중복으로 판단
    for (const existingNews of recentNews) {
      const similarity = calculateTitleSimilarity(news.title, existingNews.title);
      if (similarity >= SIMILARITY_THRESHOLD) {
        console.log(`⏭️  유사한 제목 발견 (유사도: ${similarity.toFixed(2)}): "${existingNews.title}" vs "${news.title}"`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("❌ 중복 뉴스 감지 오류:", getErrorMessage(error));
    return false;
  }
}

// 뉴스 품질 점수 계산
async function calculateNewsQualityScore(news) {
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
    const sourceName = news.source?.toLowerCase() || "";
    if (TRUSTED_SOURCES.some((source) => sourceName.includes(source.toLowerCase()))) {
      score += 20;
    } else if (
      sourceName.includes("뉴스") ||
      sourceName.includes("데일리") ||
      sourceName.includes("타임스")
    ) {
      score += 10;
    }
    
    // 5. AI 관련성 점수 (키워드 밀도)
    const text = `${news.title} ${news.description || ""} ${news.content || ""}`.toLowerCase();
    const keywordCount = AI_KEYWORDS.filter((keyword) => text.includes(keyword)).length;
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
    console.error("❌ 뉴스 품질 점수 계산 오류:", getErrorMessage(error));
    return 50;
  }
}

// 자동 키워드 추출
async function extractKeywords(title, content) {
  try {
    const keywords = await runChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "다음 뉴스에서 핵심 키워드를 3-5개 추출해주세요. AI, 기술, 회사명, 제품명 등을 우선적으로 포함하세요. 답변은 쉼표로 구분된 키워드만 작성하세요.",
        },
        {
          role: "user",
          content: `제목: ${title}\n내용: ${content.slice(0, 1000)}`,
        },
      ],
      maxTokens: 100,
      temperature: 0.3,
    });

    return keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);
  } catch (error) {
    console.error("❌ 키워드 추출 오류:", getErrorMessage(error));
    return [];
  }
}

// 뉴스 카테고리 분류
async function classifyNewsCategory(title, content) {
  try {
    return (
      (await runChatCompletion({
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
        maxTokens: 50,
        temperature: 0.3,
      })) || NEWS_PROVIDER_CATEGORY
    );
  } catch (error) {
    console.error("❌ 카테고리 분류 오류:", getErrorMessage(error));
    return NEWS_PROVIDER_CATEGORY;
  }
}

// 중복 뉴스 확인
async function isDuplicateNews(url) {
  try {
    const { data, error } = await supabase
      .from("ai_news")
      .select("id")
      .eq("url", url)
      .limit(1);

    if (error) {
      console.error("❌ 중복 확인 오류:", getErrorMessage(error));
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("❌ 중복 확인 오류:", getErrorMessage(error));
    return false;
  }
}

// 뉴스 저장
async function saveAINews(news) {
  if (isDryRun) {
    console.log(`🔎 DRY RUN: save skipped for "${news.title}"`);
    return true;
  }

  try {
    const { error } = await supabase.from("ai_news").insert([news]);

    if (error) {
      console.error("❌ 뉴스 저장 오류:", getErrorMessage(error));
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ 뉴스 저장 오류:", getErrorMessage(error));
    return false;
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log("🚀 AI 뉴스 수집 시작...");
    console.log(`⏰ 실행 시간: ${new Date().toLocaleString("ko-KR")}`);

    // 뉴스 API에서 데이터 수집
    const rawNews = await fetchNewsFromAPI();

    if (rawNews.length === 0) {
      console.log("⚠️  수집된 뉴스가 없습니다.");
      return;
    }

    console.log(`📊 총 ${rawNews.length}개의 뉴스를 수집했습니다.`);

    let savedCount = 0;
    let duplicateCount = 0;

    // 각 뉴스 처리
    for (const [index, news] of rawNews.entries()) {
      try {
        console.log(
          `\n📝 뉴스 처리 중 (${index + 1}/${rawNews.length}): ${news.title}`
        );

        // 중복 확인 (고급 감지)
        const isDuplicate = await isDuplicateNewsAdvanced(news);
        if (isDuplicate) {
          console.log("⏭️  중복 뉴스 건너뛰기");
          duplicateCount++;
          continue;
        }

        // 뉴스 품질 점수 계산
        const qualityScore = await calculateNewsQualityScore(news);
        console.log(`📊 뉴스 품질 점수: ${qualityScore}/100`);

        // 품질 점수가 너무 낮으면 제외
        if (qualityScore < MIN_QUALITY_SCORE) {
          console.log(`⚠️  품질 점수 부족으로 제외: ${qualityScore}/100`);
          continue;
        }

        // 카테고리 분류
        const classificationSource =
          news.content || news.description || news.title || "";
        const category = await classifyNewsCategory(
          news.title,
          classificationSource
        );

        // 자동 키워드 추출
        const extractedKeywords = await extractKeywords(
          news.title,
          classificationSource
        );
        const finalTags = [...(news.tags || []), ...extractedKeywords].slice(0, 5); // 최대 5개

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

        // 뉴스 저장 (품질 점수 포함)
        const success = await saveAINews({
          title: news.title,
          description: news.description,
          content: news.content,
          url: news.url,
          source: news.source,
          published_at: news.published_at,
          category: category,
          tags: finalTags,
          summary: summary,
          quality_score: qualityScore, // 품질 점수 추가
        });

        if (success) {
          savedCount++;
          console.log("✅ 뉴스 저장 완료");
        } else {
          console.log("❌ 뉴스 저장 실패");
        }

        // API 호출 간격 조절
        await sleep(NEWS_PROCESS_DELAY_MS);
      } catch (error) {
        console.error(`❌ 뉴스 처리 중 오류:`, getErrorMessage(error));
      }
    }

    console.log("\n🎉 AI 뉴스 수집 완료!");
    console.log(`📊 결과 요약:`);
    console.log(`   - 총 수집: ${rawNews.length}개`);
    console.log(`   - 새로 저장: ${savedCount}개`);
    console.log(`   - 중복 제외: ${duplicateCount}개`);
    console.log(`⏰ 완료 시간: ${new Date().toLocaleString("ko-KR")}`);
    console.log(`🌍 UTC 시간: ${new Date().toISOString()}`);
    console.log("✅ 스크립트 정상 종료");
  } catch (error) {
    console.error("❌ 뉴스 수집 중 치명적 오류:", getErrorMessage(error));
    console.error("⏰ 오류 발생 시간:", new Date().toISOString());
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ 스크립트 실행 오류:", getErrorMessage(error));
    process.exit(1);
  });
}

module.exports = { main };
