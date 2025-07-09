"use client";

import Link from "next/link";
import MealAnalysisForm from "@/components/MealAnalysisForm";

export default function BreakfastPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <Link
        href="/"
        className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 홈으로 돌아가기
      </Link>
      <h2 className="text-2xl font-bold text-center text-yellow-700 mb-2">
        오늘의 아침 식단을 기록해보세요
      </h2>
      <MealAnalysisForm />
    </div>
  );
}
