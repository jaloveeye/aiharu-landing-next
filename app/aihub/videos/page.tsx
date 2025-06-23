"use client";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface Video {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
}

export default function AihubVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/aihub-videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(Array.isArray(data) ? data : [data]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Title className="mb-6 text-green-700">AI 관련 유튜브 영상</Title>
      {loading ? (
        <div className="text-center text-gray-400">로딩 중...</div>
      ) : (
        <div className="grid gap-6">
          {videos.map((v) => (
            <Card key={v.videoId}>
              <div className="flex gap-4">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-40 h-24 object-cover rounded"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Body className="font-semibold text-lg line-clamp-2 mb-1 text-gray-800">
                      {v.title}
                    </Body>
                    <div className="text-sm text-gray-500 mb-1">
                      {v.channelTitle}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {new Date(v.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    as="a"
                    href={`https://www.youtube.com/watch?v=${v.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="mt-2 w-fit px-3 py-1 text-xs"
                  >
                    바로보기
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
