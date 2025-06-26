"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
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

function extractMealAndConclusion(
  result: string,
  mealText?: string
): { meal: string; conclusion: string } {
  let meal = mealText || "";
  let conclusion = "";
  // 결론/추천 부분 추출 (추천 식사, 내일 보완, 결론 등 키워드 이후)
  if (result) {
    const conclusionMatch = result.match(
      /(추천 식단[:：]?|추천 식사[:：]?|내일 보완할 수 있는 추천 식사[:：]?|추천|결론|Summary|Conclusion)[^\n\r]*[\n\r]+([\s\S]*)/i
    );
    if (conclusionMatch && conclusionMatch[2]) {
      conclusion = conclusionMatch[2].trim();
    } else {
      // 백업: "내일" 또는 "추천"이 들어간 마지막 3줄
      const lines = result.split(/\r?\n/).filter(Boolean);
      const summaryLines = lines.filter((line) =>
        /추천|내일|결론|Summary|Conclusion/i.test(line)
      );
      if (summaryLines.length > 0) {
        conclusion = summaryLines.slice(-2).join("\n");
      } else {
        conclusion = lines.slice(-3).join("\n");
      }
    }
  }
  return { meal, conclusion };
}

export default function BreakfastPreview() {
  const [alreadyAnalyzed, setAlreadyAnalyzed] = useState(false);
  const [anonId, setAnonId] = useState("");
  const [meal, setMeal] = useState("");
  const [conclusion, setConclusion] = useState("");

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
            const { meal, conclusion } = extractMealAndConclusion(
              found.result,
              found.meal_text
            );
            setMeal(meal);
            setConclusion(conclusion);
          }
        }
      });
  }, [anonId]);

  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
      {alreadyAnalyzed ? (
        meal || conclusion ? (
          <>
            {meal && (
              <div className="text-yellow-700 text-sm font-semibold whitespace-pre-line mb-2">
                <span className="block mb-1 text-yellow-500 font-bold">
                  입력한 식단
                </span>
                {meal}
              </div>
            )}
            {conclusion && (
              <div className="text-green-700 text-sm font-semibold whitespace-pre-line">
                <span className="block mb-1 text-green-500 font-bold">
                  결론/추천
                </span>
                {conclusion}
              </div>
            )}
          </>
        ) : (
          <div className="text-yellow-500 text-sm font-semibold">
            오늘은 이미 분석을 완료했어요. 내일 다시 시도해 주세요!
          </div>
        )
      ) : (
        <Button
          as="a"
          href="/breakfast"
          variant="primary"
          className="w-fit mx-auto text-white"
        >
          아침 식단 기록/분석하기
        </Button>
      )}
    </div>
  );
}
