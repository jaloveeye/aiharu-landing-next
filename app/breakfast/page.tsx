"use client";

import { useState } from "react";

export default function BreakfastPage() {
  function NutritionForm() {
    const [meal, setMeal] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

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
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto mt-20 w-full"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          오늘의 아침 식단을 기록해보세요
        </h2>
        <textarea
          className="border rounded p-2"
          rows={3}
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          placeholder="예: 닭가슴살 50g, 바나나 1개, 우유 200ml"
          required
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
          disabled={loading}
        >
          {loading ? "분석 중..." : "식단 분석하기"}
        </button>
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

  return <NutritionForm />;
}
