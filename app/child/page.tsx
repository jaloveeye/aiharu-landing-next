"use client";

import { Title, Body } from "@/components/ui/Typography";
import CarouselSection from "./CarouselSection";
import BreakfastPreview from "./BreakfastPreview";
import Link from "next/link";
// import { commonMetadata } from "@/app/metadata/common"; // metadata 분리로 주석처리
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import NutritionChart from "@/components/ui/NutritionChart";
import NutritionTrendChart from "@/components/ui/NutritionTrendChart";
import NutritionPieChart from "@/components/ui/NutritionPieChart";
import NutritionRadarChart from "@/components/ui/NutritionRadarChart";
import NutritionAverageBarChart from "@/components/ui/NutritionAverageBarChart";
import NutritionDeficiencyBarChart from "@/components/ui/NutritionDeficiencyBarChart";
import { parseNutrition } from "@/utils/nutritionParser";
const NUTRIENTS = [
  "열량",
  "탄수화물",
  "단백질",
  "지방",
  "식이섬유",
  "칼슘",
  "철분",
  "비타민 C",
  "비타민 D",
  "당류 (당분)",
  "나트륨",
];

// export const metadata = { ... } // metadata export 제거

/**
 * 아이하루 대시보드 및 습관 관리 메인 페이지
 */
export default function ChildPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [myAnalyses, setMyAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 로그인된 사용자 email 가져오기
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
      .then((data) => setMyAnalyses(data.data || []))
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

  // 누적 영양소 합산
  const totalNutrition: { [key: string]: number } = {
    탄수화물: 0,
    단백질: 0,
    지방: 0,
    식이섬유: 0,
    칼슘: 0,
  };

  // 분석 결과별 파싱 값 디버깅
  if (typeof window !== "undefined" && myAnalyses.length > 0) {
    myAnalyses.forEach((a: any, idx: number) => {
      const parsed = parseNutrition(a.result);
      console.log(
        `[DEBUG] #${idx + 1} 탄수화물:`,
        parsed?.["탄수화물"],
        parsed
      );
    });
  }
  myAnalyses.forEach((a: any) => {
    if (a.result) parseNutrition(a.result);
  });

  // 모든 차트에 사용할 영양소 데이터 파싱 및 계산 통일
  const parsedAnalyses: Record<string, number>[] = myAnalyses.map(
    (a) => parseNutrition(a.result) as Record<string, number>
  );
  // 최신 분석 결과 (영양소 값이 0이 아닌 가장 마지막 데이터)
  let latestNutrition = null;
  let latestNutritionDate = null;
  for (let i = 0; i < parsedAnalyses.length; i++) {
    const nutrition = parsedAnalyses[i];
    if (nutrition && Object.values(nutrition).some((v) => v > 0)) {
      latestNutrition = nutrition;
      latestNutritionDate = myAnalyses[i]?.analyzed_at || null;
      break;
    }
  }
  // 최근 N회 평균
  const N = Math.min(5, parsedAnalyses.length);
  const avgNutrition = (() => {
    if (!N) return null;
    const sums = Object.fromEntries(NUTRIENTS.map((k) => [k, 0]));
    for (let i = 0; i < N; i++) {
      NUTRIENTS.forEach((k) => {
        sums[k] += parsedAnalyses[i][k] || 0;
      });
    }
    const avg = Object.fromEntries(
      NUTRIENTS.map((k) => [k, Math.round((sums[k] / N) * 100) / 100])
    );
    return avg;
  })();

  // TODO: 권장량 대비 섭취율(%) 계산 및 시각화 로직을 고도화할 것 (연령별/식사별 권장량, 누적/평균 섭취율 등 다양한 방식 지원)
  // 권장량도 11개 영양소로 맞춤 (6~8세 아동 1회 권장량)
  const recommended: Record<string, number> = {
    열량: 530,
    탄수화물: 82.5, // 평균값 (75~90g)
    단백질: 10, // 평균값 (8~12g)
    지방: 15, // 평균값 (13~17g)
    식이섬유: 5.5, // 평균값 (5~6g)
    칼슘: 250, // 평균값 (230~270mg)
    철분: 3, // 평균값 (2.5~3.5mg)
    "비타민 C": 16.5, // 평균값 (13~20mg)
    "비타민 D": 3.3, // ㎍ (133 IU)
    "당류 (당분)": 8,
    나트륨: 400,
  };

  // 5번 차트: 부족 영양소 통계 계산
  const deficiencyCounts = (() => {
    const counts: { [key: string]: number } = Object.fromEntries(
      NUTRIENTS.map((k) => [k, 0])
    );
    parsedAnalyses.forEach((nutrition) => {
      NUTRIENTS.forEach((nutrient) => {
        if ((nutrition[nutrient] ?? 0) < (recommended[nutrient] ?? 0)) {
          counts[nutrient] += 1;
        }
      });
    });
    return counts;
  })();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <Link
        href="/"
        className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 홈으로 돌아가기
      </Link>
      {/* 분석 차트 섹션 */}
      {userEmail && myAnalyses.length > 0 && (
        <section className="w-full max-w-2xl bg-white border border-green-200 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8 mb-12">
          <div className="text-2xl font-bold text-green-700 mb-2">
            자녀의 식단 분석 리포트
          </div>
          <div>
            <div className="font-bold text-base mb-1 text-green-700">
              1. 날짜별 영양소 트렌드
            </div>
            <NutritionTrendChart analyses={myAnalyses.slice().reverse()} />
          </div>
          {latestNutrition && typeof latestNutrition === "object" && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-bold text-base mb-1 text-green-700">
                  2. 최근 분석 영양소 비율
                  {latestNutritionDate && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({latestNutritionDate} 기준)
                    </span>
                  )}
                </div>
                <NutritionPieChart
                  nutrition={latestNutrition as { [key: string]: number }}
                />
              </div>
              <div>
                <div className="font-bold text-base mb-1 text-green-700">
                  3. 최근 분석 영양소 균형
                </div>
                <NutritionRadarChart
                  nutrition={latestNutrition as { [key: string]: number }}
                />
              </div>
            </div>
          )}
          {avgNutrition && (
            <div className="w-full">
              <div className="font-bold text-base mb-1 text-green-700">
                4. 최근 {N}회 평균 vs 권장량
              </div>
              <NutritionAverageBarChart
                nutrition={avgNutrition}
                target={recommended}
              />
            </div>
          )}
          {/* 5번 차트: 부족 영양소 바 차트 */}
          <div className="w-full">
            <div className="font-bold text-base mb-1 text-green-700">
              5. 부족 영양소 통계
            </div>
            <NutritionDeficiencyBarChart deficiencyCounts={deficiencyCounts} />
          </div>
          {/* 부족 영양소 통계 등 추가 차트 필요시 여기에 */}
        </section>
      )}
      <main className="flex flex-col items-center gap-8 w-full">
        <Title>아이와 부모가 함께 만드는 하루 습관</Title>
        <Body>칭찬과 피드백으로 자라는 성장 여정</Body>
        {/* 목표 카드 예시 */}
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
