"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

type Stat = {
  content: string;
  total_count: number;
  achieved_count: number;
  achieved_ratio: number;
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Supabase 세션에서 user_id 가져오기
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    console.log("userId", userId);
    let url = "/api/recommendation";
    if (userId) url += `?user_id=${userId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data || []);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;

  // 전체 실천률
  const total = stats.reduce((a, b) => a + b.total_count, 0);
  const achieved = stats.reduce((a, b) => a + b.achieved_count, 0);
  const overallRatio = total ? Math.round((achieved / total) * 1000) / 10 : 0;

  // TOP N
  const TOP_N = 5;
  const topRecommended = [...stats]
    .sort((a, b) => b.total_count - a.total_count)
    .slice(0, TOP_N);
  const topAchieved = [...stats]
    .filter((s) => s.total_count > 0)
    .sort((a, b) => b.achieved_ratio - a.achieved_ratio)
    .slice(0, TOP_N);
  const lowAchieved = [...stats]
    .filter((s) => s.total_count > 0)
    .sort((a, b) => a.achieved_ratio - b.achieved_ratio)
    .slice(0, TOP_N);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">추천 식단 통계</h1>
      <div className="mb-4 text-sm text-gray-600">
        {userId
          ? "내 추천 식단 통계만 표시 중"
          : "전체 사용자 통계 표시 중 (로그인 시 내 통계만 표시)"}
      </div>
      <div className="mb-6">
        <b>전체 실천률:</b> {overallRatio}%
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">
          가장 자주 추천된 식단 TOP {TOP_N}
        </h2>
        <ul className="list-decimal ml-6">
          {topRecommended.map((s, i) => (
            <li key={i}>
              <b>{s.content}</b>{" "}
              <span className="text-gray-500">
                ({s.total_count}회, 실천률 {s.achieved_ratio}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">
          실천률이 높은 추천 식단 TOP {TOP_N}
        </h2>
        <ul className="list-decimal ml-6">
          {topAchieved.map((s, i) => (
            <li key={i}>
              <b>{s.content}</b>{" "}
              <span className="text-gray-500">
                (실천률 {s.achieved_ratio}%, {s.total_count}회)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">
          실천률이 낮은 추천 식단 TOP {TOP_N}
        </h2>
        <ul className="list-decimal ml-6">
          {lowAchieved.map((s, i) => (
            <li key={i}>
              <b>{s.content}</b>{" "}
              <span className="text-gray-500">
                (실천률 {s.achieved_ratio}%, {s.total_count}회)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
