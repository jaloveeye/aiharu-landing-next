"use client";
import MealAnalysisForm from "@/components/MealAnalysisForm";
import { useRouter } from "next/navigation";

function extractMealAndConclusion(
  result: string,
  mealText?: string
): { meal: string; conclusion: string } {
  let meal = mealText || "";
  // 결론/추천이 아니라 전체 분석 결과를 그대로 conclusion에 반환
  return { meal, conclusion: result };
}

export default function BreakfastPreview() {
  const router = useRouter();
  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
      <MealAnalysisForm
        extractMealAndConclusion={extractMealAndConclusion}
        withConclusion={true}
        onResultClick={(id) => router.push(`/history/${id}`)}
      />
    </div>
  );
}
