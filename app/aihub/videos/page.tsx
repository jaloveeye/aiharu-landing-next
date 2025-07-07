"use client";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useApiData } from "@/app/hooks/useApiData";

interface Video {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
}

export default function AihubVideosPage() {
  const { data, error, isLoading } = useApiData<Video[]>("/api/aihub-videos");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20">
      <Link
        href="/"
        className="self-start mb-4 text-green-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 홈으로 돌아가기
      </Link>
      <Title className="mb-6 text-green-700">AI 관련 유튜브 영상</Title>
      {isLoading ? (
        <div className="text-center text-gray-400">로딩 중...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          불러오기 실패: {error.message}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="text-center text-gray-400">영상이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-6">
          {data.map((video) => (
            <Card key={video.videoId} className="flex flex-col gap-2 p-4">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="rounded-lg w-full h-48 object-cover mb-2"
              />
              <div className="font-bold text-lg text-green-700 mb-1">
                {video.title}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {video.channelTitle} | {video.publishedAt.slice(0, 10)}
              </div>
              <div className="text-gray-800 text-sm mb-2 line-clamp-3">
                {video.description}
              </div>
              <Button
                as="a"
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="mt-auto"
              >
                유튜브에서 보기
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
