"use client";

import { Title, Body } from "@/components/ui/Typography";
import BreakfastPreview from "./BreakfastPreview";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface MealAnalysisSummary {
  totalCount: number;
}

export default function ChildPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [analysisSummary, setAnalysisSummary] = useState<MealAnalysisSummary>({
    totalCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    setLoading(true);
    fetch(`/api/test-meal-analysis?email=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        setAnalysisSummary({ totalCount: (data?.data || []).length });
      })
      .catch(() => {
        setAnalysisSummary({ totalCount: 0 });
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  const cards = [
    {
      icon: "📅",
      title: "오늘의 목표 체크",
      desc: "매일 목표를 체크하고, 달성률을 한눈에 확인해요.",
    },
    {
      icon: "💬",
      title: "부모 피드백 & 감정 칭찬",
      desc: "부모님이 직접 남기는 칭찬과 피드백으로 동기부여!",
    },
    {
      icon: "🏆",
      title: "포인트 → 보상 시스템",
      desc: "목표 달성 시 포인트를 받고, 원하는 보상으로 교환해요.",
    },
    {
      icon: "📈",
      title: "주간 리포트 & 습관 인사이트",
      desc: "한 주의 성장과 습관 변화를 리포트로 확인!",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-700">분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <Link
        href="/"
        className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 홈으로 돌아가기
      </Link>
      <main className="flex flex-col items-center gap-8 w-full">
        <Title>아이와 부모가 함께 만드는 하루 습관</Title>
        <Body>칭찬과 피드백으로 자라는 성장 여정</Body>
        <p className="text-sm text-gray-700">
          최근 식단 분석 {analysisSummary.totalCount}건
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-yellow-200"
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="font-bold text-lg mb-1 text-yellow-700">
                {card.title}
              </div>
              <div className="text-gray-700 text-sm text-center">
                {card.desc}
              </div>
            </div>
          ))}
        </div>
      </main>
      <BreakfastPreview />
    </div>
  );
}
