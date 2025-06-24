"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

function getTodayKey() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `breakfastAnalyzed_${yyyy}${mm}${dd}`;
}

export default function BreakfastPreview() {
  const [alreadyAnalyzed, setAlreadyAnalyzed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = getTodayKey();
      setAlreadyAnalyzed(!!localStorage.getItem(key));
    }
  }, []);

  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
      {alreadyAnalyzed ? (
        <div className="text-yellow-500 text-sm font-semibold">
          오늘은 이미 분석을 완료했어요. 내일 다시 시도해 주세요!
        </div>
      ) : (
        <Button
          as="a"
          href="/breakfast"
          variant="primary"
          className="w-fit mx-auto"
        >
          아침 식단 기록/분석하기
        </Button>
      )}
    </div>
  );
}
