#!/usr/bin/env node

/**
 * AI 뉴스 수집 스크립트
 * GitHub Actions에서 실행되는 독립적인 뉴스 수집 스크립트
 */

const https = require("https");
const http = require("http");

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

// 뉴스 API에서 AI 관련 뉴스 수집
async function fetchNewsFromAPI() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const gnewsApiKey = process.env.GNEWS_API_KEY;
  const news = [];

  if (!newsApiKey && !gnewsApiKey) {
    console.warn(
      "⚠️  NEWS_API_KEY/GNEWS_API_KEY 모두 누락: 외부 뉴스 수집 불가"
    );
    return news;
  }

  // NewsAPI에서 AI 뉴스 수집 (한국어 + 영어)
  if (newsApiKey) {
    try {
      console.log("📰 NewsAPI에서 한국어 뉴스 수집 중...");
      const koResponse = await fetch(
        `https://newsapi.org/v2/everything?q=인공지능 OR AI OR 머신러닝 OR 딥러닝 OR (AI AND 육아) OR (인공지능 AND 육아) OR (AI AND 교육) OR (인공지능 AND 교육)&language=ko&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
      );
      const koData = await koResponse.json();

      if (koData.articles) {
        news.push(
          ...koData.articles.map((article) => ({
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            source: article.source.name,
            published_at: article.publishedAt,
            category: "AI Technology",
            tags: ["AI", "Technology", "한국어"],
          }))
        );
        console.log(`✅ 한국어 뉴스 ${koData.articles.length}개 수집`);
      }

      console.log("📰 NewsAPI에서 영어 뉴스 수집 중...");
      const enResponse = await fetch(
        `https://newsapi.org/v2/everything?q=artificial intelligence OR AI OR machine learning OR (AI AND parenting) OR (artificial intelligence AND parenting) OR (AI AND education) OR (artificial intelligence AND education)&language=en&sortBy=publishedAt&pageSize=8&apiKey=${newsApiKey}`
      );
      const enData = await enResponse.json();

      if (enData.articles) {
        news.push(
          ...enData.articles.map((article) => ({
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            source: article.source.name,
            published_at: article.publishedAt,
            category: "AI Technology",
            tags: ["AI", "Technology", "English"],
          }))
        );
        console.log(`✅ 영어 뉴스 ${enData.articles.length}개 수집`);
      }
    } catch (error) {
      console.error("❌ NewsAPI 뉴스 수집 오류:", error.message);
    }
  }

  // GNews에서 AI 뉴스 수집
  if (gnewsApiKey) {
    try {
      console.log("📰 GNews에서 뉴스 수집 중...");
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=artificial intelligence OR (AI AND 육아) OR (AI AND 교육)&lang=ko&country=kr&max=15&apikey=${gnewsApiKey}`
      );
      const data = await response.json();

      if (data.articles) {
        news.push(
          ...data.articles.map((article) => ({
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            source: article.source.name,
            published_at: article.publishedAt,
            category: "AI Technology",
            tags: ["AI", "Technology"],
          }))
        );
        console.log(`✅ GNews 뉴스 ${data.articles.length}개 수집`);
      }
    } catch (error) {
      console.error("❌ GNews 뉴스 수집 오류:", error.message);
    }
  }

  return news;
}

// 뉴스 내용 요약 생성
async function generateNewsSummary(content) {
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
    console.error("❌ 요약 생성 오류:", error.message);
    return content.slice(0, 200) + "...";
  }
}

// 뉴스 카테고리 분류
async function classifyNewsCategory(title, content) {
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
    console.error("❌ 카테고리 분류 오류:", error.message);
    return "AI Technology";
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
      console.error("❌ 중복 확인 오류:", error.message);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("❌ 중복 확인 오류:", error.message);
    return false;
  }
}

// 뉴스 저장
async function saveAINews(news) {
  try {
    const { error } = await supabase.from("ai_news").insert([news]);

    if (error) {
      console.error("❌ 뉴스 저장 오류:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ 뉴스 저장 오류:", error.message);
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

        // 중복 확인
        const isDuplicate = await isDuplicateNews(news.url);
        if (isDuplicate) {
          console.log("⏭️  중복 뉴스 건너뛰기");
          duplicateCount++;
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
          console.log("✅ 뉴스 저장 완료");
        } else {
          console.log("❌ 뉴스 저장 실패");
        }

        // API 호출 간격 조절
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ 뉴스 처리 중 오류:`, error.message);
      }
    }

    console.log("\n🎉 AI 뉴스 수집 완료!");
    console.log(`📊 결과 요약:`);
    console.log(`   - 총 수집: ${rawNews.length}개`);
    console.log(`   - 새로 저장: ${savedCount}개`);
    console.log(`   - 중복 제외: ${duplicateCount}개`);
    console.log(`⏰ 완료 시간: ${new Date().toLocaleString("ko-KR")}`);
  } catch (error) {
    console.error("❌ 뉴스 수집 중 치명적 오류:", error.message);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ 스크립트 실행 오류:", error);
    process.exit(1);
  });
}

module.exports = { main };
