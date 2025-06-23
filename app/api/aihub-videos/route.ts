// @ts-nocheck
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const summarizeDescription = async (desc: string) => {
  if (!desc || desc.trim() === "") return "설명이 없습니다.";
  const prompt = `다음은 유튜브 영상 설명이야. 초등학생도 이해할 수 있도록 2~3문장으로 쉽게 요약해줘:\n\n"${desc}"`;
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    return chat.choices[0].message.content;
  } catch (e) {
    return desc;
  }
};

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const query = encodeURIComponent("AI 뉴스|AI 강의|AI 기술|인공지능");
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${query}&part=snippet&type=video&maxResults=10&order=date&regionCode=KR&relevanceLanguage=ko`;

  const res = await fetch(url);
  const data = await res.json();

  // videoId 목록 추출
  const videoIds = (data.items || [])
    .map((item: any) => item.id.videoId)
    .filter(Boolean);

  // videos API로 통계 정보 가져오기
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds.join(
    ","
  )}&part=statistics`;
  const videosRes = await fetch(videosUrl);
  const videosData = await videosRes.json();
  // videoId -> statistics 매핑
  const statsMap: Record<string, any> = {};
  (videosData.items || []).forEach((v: any) => {
    statsMap[v.id] = v.statistics || {};
  });

  // 점수 계산 및 최고 영상 찾기 (조회수 + 좋아요수)
  let bestVideo = null;
  let bestScore = -1;
  (data.items || []).forEach((item: any) => {
    const videoId = item.id.videoId;
    const stats = statsMap[videoId] || {};
    const viewCount = stats.viewCount ? Number(stats.viewCount) : 0;
    const likeCount = stats.likeCount ? Number(stats.likeCount) : 0;
    const score = viewCount + likeCount;
    if (score > bestScore) {
      bestScore = score;
      bestVideo = {
        videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.medium.url,
        viewCount,
        likeCount,
      };
    }
  });

  if (!bestVideo) {
    return NextResponse.json({ error: "No video found" }, { status: 404 });
  }

  // 요약 생성
  const summary = await summarizeDescription(bestVideo.description);
  bestVideo.summary = summary;

  return NextResponse.json(bestVideo);
}
