import OpenAI from "openai";
import { apiError } from "@/app/utils/apiError";

type YoutubeSearchItem = {
  id: { videoId?: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
  };
};

type YoutubeVideoItem = {
  id: string;
  statistics?: {
    viewCount?: string;
    likeCount?: string;
  };
};

type BestYoutubeVideo = YoutubeSearchItem["snippet"] & {
  videoId: string;
  viewCount: number;
  likeCount: number;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type YoutubeSearchResponse = {
  items?: Array<YoutubeSearchItem>;
};

type YoutubeVideoResponse = {
  items?: Array<YoutubeVideoItem>;
};

function getItems(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function isYoutubeSearchItem(item: unknown): item is YoutubeSearchItem {
  return !!(
    item &&
    typeof item === "object" &&
    typeof (item as YoutubeSearchItem).id?.videoId === "string" &&
    typeof (item as YoutubeSearchItem).snippet?.title === "string" &&
    typeof (item as YoutubeSearchItem).snippet?.description === "string" &&
    typeof (item as YoutubeSearchItem).snippet?.channelTitle === "string" &&
    typeof (item as YoutubeSearchItem).snippet?.publishedAt === "string" &&
    typeof (item as YoutubeSearchItem).snippet?.thumbnails?.medium?.url === "string"
  );
}

function isYoutubeVideoItem(item: unknown): item is YoutubeVideoItem {
  return !!(
    item &&
    typeof item === "object" &&
    typeof (item as YoutubeVideoItem).id === "string"
  );
}

function extractVideoDescription(video: BestYoutubeVideo | null): string {
  if (!video || typeof video.description !== "string") {
    return "설명이 없습니다.";
  }
  return video.description;
}

const summarizeDescription = async (desc: string) => {
  if (!desc || desc.trim() === "") return "설명이 없습니다.";
  const prompt = `다음은 유튜브 영상 설명이야. 초등학생도 이해할 수 있도록 2~3문장으로 쉽게 요약해줘:\n\n"${desc}"`;
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    return chat.choices[0].message.content;
  } catch {
    return desc;
  }
};

export async function GET() {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
      return apiError({
        error: "Missing YOUTUBE_API_KEY",
        userMessage: "유튜브 API 키가 없습니다.",
        status: 500,
      });
    }

    const query = encodeURIComponent("AI 뉴스|AI 강의|AI 기술|인공지능");
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${query}&part=snippet&type=video&maxResults=10&order=date&regionCode=KR&relevanceLanguage=ko`;

    const searchRes = await fetch(url);
    const searchData: YoutubeSearchResponse = await searchRes.json();
    if (!searchRes.ok || !searchData.items) {
      return apiError({
        error: "Youtube search failed",
        userMessage: "유튜브 검색 응답을 가져오지 못했습니다.",
        status: 500,
      });
    }

    const searchItems = getItems(searchData.items).filter(isYoutubeSearchItem);
    const normalizedSearchItems = searchItems
      .filter((item): item is YoutubeSearchItem => {
        const typed = item;
        return !!typed.id.videoId && !!typed.snippet;
      })
      .map((item) => item.id.videoId)
      .filter((videoId): videoId is string => typeof videoId === "string");

    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${normalizedSearchItems.join(",")}&part=statistics`;
    const videosRes = await fetch(videosUrl);
    const videosData: YoutubeVideoResponse = await videosRes.json();
    const statsMap: Record<string, YoutubeVideoItem["statistics"]> = {};
    getItems(videosData.items).forEach((v) => {
      if (!isYoutubeVideoItem(v)) return;
      const item = v;
      if (!item?.id) return;
      statsMap[item.id] = item.statistics || {};
    });

    let bestVideo: BestYoutubeVideo | null = null;
    let bestScore = -1;

    normalizedSearchItems.forEach((videoId) => {
      const item = searchItems.find((entry) => entry.id.videoId === videoId);
      if (!item) return;
      const stats = statsMap[videoId] || {};
      const viewCount = stats.viewCount ? Number(stats.viewCount) : 0;
      const likeCount = stats.likeCount ? Number(stats.likeCount) : 0;
      const score = viewCount + likeCount;
      if (score > bestScore) {
        bestScore = score;
        bestVideo = {
          ...item.snippet,
          videoId,
          viewCount,
          likeCount,
        };
      }
    });

    if (!bestVideo) {
      return apiError({
        error: "No video found",
        userMessage: "조회 가능한 영상이 없습니다.",
        status: 404,
      });
    }

    const targetVideo = bestVideo;
    const description = extractVideoDescription(targetVideo);
    const payload = {
      ...(targetVideo as BestYoutubeVideo),
      summary: await summarizeDescription(description),
    };
    return new Response(
      JSON.stringify(payload),
      { headers: { "content-type": "application/json" } }
    );
  } catch (error) {
    return apiError({
      error,
      userMessage: "유튜브 영상 조회 중 오류가 발생했습니다.",
    });
  }
}
