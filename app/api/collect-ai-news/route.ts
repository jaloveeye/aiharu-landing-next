import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { saveAINews, isDuplicateNews } from '@/app/utils/aiNews';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 뉴스 API에서 AI 관련 뉴스 수집
async function fetchNewsFromAPI() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const gnewsApiKey = process.env.GNEWS_API_KEY;
  
  const news: any[] = [];
  
  // NewsAPI에서 AI 뉴스 수집 (한국어 + 영어)
  if (newsApiKey) {
    try {
      // 한국어 뉴스 먼저 수집
      const koResponse = await fetch(
        `https://newsapi.org/v2/everything?q=인공지능 OR AI OR 머신러닝 OR 딥러닝&language=ko&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`
      );
      const koData = await koResponse.json();
      
      if (koData.articles) {
        news.push(...koData.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          published_at: article.publishedAt,
          category: 'AI Technology',
          tags: ['AI', 'Technology', '한국어']
        })));
      }
      
      // 영어 뉴스도 수집 (한국어 뉴스가 부족할 경우)
      const enResponse = await fetch(
        `https://newsapi.org/v2/everything?q=artificial intelligence OR AI OR machine learning&language=en&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`
      );
      const enData = await enResponse.json();
      
      if (enData.articles) {
        news.push(...enData.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          published_at: article.publishedAt,
          category: 'AI Technology',
          tags: ['AI', 'Technology', 'English']
        })));
      }
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
    }
  }
  
  // GNews에서 AI 뉴스 수집
  if (gnewsApiKey) {
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=artificial intelligence&lang=ko&country=kr&max=10&apikey=${gnewsApiKey}`
      );
      const data = await response.json();
      
      if (data.articles) {
        news.push(...data.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          published_at: article.publishedAt,
          category: 'AI Technology',
          tags: ['AI', 'Technology']
        })));
      }
    } catch (error) {
      console.error('Error fetching from GNews:', error);
    }
  }
  
  return news;
}

// 뉴스 내용 요약 생성
async function generateNewsSummary(content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "AI 뉴스 전문가로서 주어진 뉴스 내용을 2-3문장으로 간결하게 요약해주세요. 핵심 내용만 추출하여 한국어로 작성하세요."
        },
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || content.slice(0, 200) + '...';
  } catch (error) {
    console.error('Error generating summary:', error);
    return content.slice(0, 200) + '...';
  }
}

// 뉴스 카테고리 분류
async function classifyNewsCategory(title: string, content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "다음 카테고리 중 하나로 뉴스를 분류해주세요: AI Technology, AI Research, AI Business, AI Ethics, AI Tools. 답변은 카테고리명만 작성하세요."
        },
        {
          role: "user",
          content: `제목: ${title}\n내용: ${content.slice(0, 500)}`
        }
      ],
      max_tokens: 50,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content?.trim() || 'AI Technology';
  } catch (error) {
    console.error('Error classifying news:', error);
    return 'AI Technology';
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('AI 뉴스 수집 시작...');
    
    // 뉴스 API에서 데이터 수집
    const rawNews = await fetchNewsFromAPI();
    
    if (rawNews.length === 0) {
      return NextResponse.json({
        message: '수집된 뉴스가 없습니다.',
        count: 0
      });
    }
    
    let savedCount = 0;
    
    // 각 뉴스 처리
    for (const news of rawNews) {
      try {
        // 중복 확인
        const isDuplicate = await isDuplicateNews(news.url);
        if (isDuplicate) {
          console.log('중복 뉴스 건너뛰기:', news.title);
          continue;
        }
        
        // 카테고리 분류
        const category = await classifyNewsCategory(news.title, news.content);
        
        // 요약 생성
        const summary = await generateNewsSummary(news.content);
        
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
          summary: summary
        });
        
        if (success) {
          savedCount++;
          console.log('뉴스 저장 완료:', news.title);
        }
        
        // API 호출 간격 조절
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('뉴스 처리 중 오류:', error);
      }
    }
    
    console.log(`AI 뉴스 수집 완료: ${savedCount}개 저장됨`);
    
    return NextResponse.json({
      message: 'AI 뉴스 수집이 완료되었습니다.',
      count: savedCount,
      total: rawNews.length
    });
    
  } catch (error) {
    console.error('AI 뉴스 수집 중 오류:', error);
    return NextResponse.json(
      { error: 'AI 뉴스 수집 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET 요청으로 최근 뉴스 조회
export async function GET() {
  try {
    const { getRecentAINews } = await import('@/app/utils/aiNews');
    const recentNews = await getRecentAINews(10);
    
    return NextResponse.json({
      message: '최근 AI 뉴스를 조회했습니다.',
      news: recentNews
    });
    
  } catch (error) {
    console.error('AI 뉴스 조회 중 오류:', error);
    return NextResponse.json(
      { error: 'AI 뉴스 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
