"use client";

import { useState, useEffect } from "react";

function getTodayKey() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `breakfastAnalyzed_${yyyy}${mm}${dd}`;
}

export default function BreakfastPage() {
  function NutritionForm() {
    const [meal, setMeal] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [alreadyAnalyzed, setAlreadyAnalyzed] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const key = getTodayKey();
        setAlreadyAnalyzed(!!localStorage.getItem(key));
      }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setResult("");
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal }),
      });
      const data = await res.json();
      setResult(data.result || data.error);
      setLoading(false);

      // 분석 성공 시 오늘 날짜로 localStorage에 기록 + 즉시 비활성화
      if (typeof window !== "undefined" && data.result) {
        const key = getTodayKey();
        localStorage.setItem(key, "1");
        setAlreadyAnalyzed(true);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto mt-20 w-full"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-700 mb-2">
          오늘의 아침 식단을 기록해보세요
        </h2>
        <textarea
          className="border rounded p-2"
          rows={3}
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          placeholder="예: 닭가슴살 50g, 바나나 1개, 우유 200ml"
          required
          disabled={alreadyAnalyzed}
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
          disabled={loading || alreadyAnalyzed}
        >
          {alreadyAnalyzed
            ? "오늘은 이미 분석 완료"
            : loading
            ? "분석 중..."
            : "식단 분석하기"}
        </button>
        {alreadyAnalyzed && (
          <div className="text-green-500 text-sm text-center">
            오늘은 이미 분석을 완료했어요. 내일 다시 시도해 주세요!
          </div>
        )}
        {result && (
          <div
            className="bg-white border border-green-300 rounded p-4 whitespace-pre-line mt-2 text-base leading-relaxed max-h-80 overflow-y-auto shadow text-gray-800"
            style={{ wordBreak: "break-word" }}
          >
            {result}
          </div>
        )}
      </form>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <NutritionForm />
    </div>
  );
}
