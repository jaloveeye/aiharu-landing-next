"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

function getAnonId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("anon_id") || "";
  if (!isValidUUID(id)) {
    id = uuidv4();
    localStorage.setItem("anon_id", id);
  }
  return id;
}

export default function BreakfastPage() {
  function NutritionForm() {
    const [meal, setMeal] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [alreadyAnalyzed, setAlreadyAnalyzed] = useState(false);
    const [anonId, setAnonId] = useState("");

    useEffect(() => {
      if (typeof window !== "undefined") {
        setAnonId(getAnonId());
      }
    }, []);

    useEffect(() => {
      if (!anonId) return;
      // 1. 오늘 분석 여부 확인
      fetch(`/api/analyze-meal?anon_id=${anonId}`)
        .then((res) => res.json())
        .then((data) => setAlreadyAnalyzed(!!data.analyzed));
      // 2. 오늘 분석 결과 받아오기 (존재할 때만)
      fetch(`/api/test-meal-analysis`)
        .then((res) => res.json())
        .then(({ data }) => {
          if (Array.isArray(data)) {
            const today = new Date().toISOString().slice(0, 10);
            const found = data.find(
              (row) => row.anon_id === anonId && row.analyzed_at === today
            );
            if (found && found.result) {
              setResult(found.result);
            }
          }
        });
    }, [anonId]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setResult("");
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal, anon_id: anonId }),
      });
      const data = await res.json();
      setResult(
        data.result ||
          (typeof data.error === "object"
            ? JSON.stringify(data.error, null, 2)
            : data.error)
      );
      setLoading(false);
      if (data.result) {
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
        {alreadyAnalyzed && result ? (
          <div
            className="bg-white border border-green-300 rounded p-4 whitespace-pre-line mt-2 text-base leading-relaxed max-h-80 overflow-y-auto shadow text-gray-800"
            style={{ wordBreak: "break-word" }}
          >
            {result}
          </div>
        ) : (
          <>
            <textarea
              className="border rounded p-2 text-gray-800 placeholder-gray-400"
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
          </>
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
