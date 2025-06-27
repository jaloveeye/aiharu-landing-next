"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/app/utils/supabase/client";

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
  const [analyzedAt, setAnalyzedAt] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mealInput, setMealInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { meal_text: string; result: string; analyzed_at: string }[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnonId(getAnonId());
    }
  }, []);

  useEffect(() => {
    // 상태 초기화
    setAnalyzedAt("");
    setAlreadyAnalyzed(false);
    setMeal("");
    setConclusion("");

    const query = userEmail
      ? `/api/analyze-meal?email=${encodeURIComponent(userEmail)}&latest=1`
      : anonId
      ? `/api/analyze-meal?anon_id=${anonId}&latest=1`
      : null;
    if (!query) return;
    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          const { meal, conclusion } = extractMealAndConclusion(data.result);
          setMeal(meal);
          setConclusion(conclusion);
          setAnalyzedAt(data.lastAnalyzedAt);
          setAlreadyAnalyzed(true);
        } else {
          setMeal("");
          setConclusion("");
          setAnalyzedAt("");
          setAlreadyAnalyzed(false);
        }
      });
  }, [userEmail, anonId]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetch(`/api/analyze-meal?email=${encodeURIComponent(userEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.history) setHistory(data.history);
        });
    } else {
      setHistory([]);
    }
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    // 분석 시도
    const body = userEmail
      ? { meal: mealInput, anon_id: anonId, email: userEmail }
      : { meal: mealInput, anon_id: anonId };
    const res = await fetch("/api/analyze-meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 403 && data.limitReached) {
      setErrorMsg(
        data.error ||
          "무료 분석 1회가 모두 소진되었습니다. 회원가입 후 계속 이용하세요."
      );
      setMeal("");
      setConclusion("");
      setAnalyzedAt(data.lastAnalyzedAt || "");
      setAlreadyAnalyzed(true);
      return;
    }
    if (data.result) {
      const { meal, conclusion } = extractMealAndConclusion(data.result);
      setMeal(meal);
      setConclusion(conclusion);
      setAnalyzedAt(data.lastAnalyzedAt || "");
      setAlreadyAnalyzed(true);
      setErrorMsg("");
    } else {
      setErrorMsg(data.error || "분석에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserEmail(null);
    window.location.reload();
  };

  return (
    <>
      <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-2 items-center"
        >
          <textarea
            className={`border rounded p-2 text-gray-800 placeholder-gray-400 w-full ${
              loading || alreadyAnalyzed
                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                : ""
            }`}
            rows={3}
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="예: 닭가슴살 50g, 바나나 1개, 우유 200ml"
            required
            disabled={loading || alreadyAnalyzed || userEmail === undefined}
          />
          <Button
            type="submit"
            variant="primary"
            className={`w-fit mx-auto text-white ${
              loading || alreadyAnalyzed
                ? "bg-gray-300 text-gray-400 cursor-not-allowed border-gray-300 hover:bg-gray-300 hover:text-gray-400"
                : ""
            }`}
            disabled={loading || alreadyAnalyzed || userEmail === undefined}
          >
            {loading ? "분석 중..." : "식단 분석하기"}
          </Button>
          {alreadyAnalyzed && !userEmail && (
            <>
              <div className="text-red-500 text-sm text-center mt-2 font-bold">
                무료 분석은 1회만 가능합니다. 다시 분석하려면 회원가입이
                필요합니다.
              </div>
              <Button
                as="a"
                href="/signup"
                className="min-w-[140px] max-w-fit m-auto !bg-blue-500 !hover:bg-blue-600 !text-white font-bold py-2 px-3 text-xs rounded text-center whitespace-nowrap mt-2"
                style={{ display: "block" }}
              >
                회원가입 하러 가기
              </Button>
            </>
          )}
          {alreadyAnalyzed && userEmail && (
            <div className="text-blue-600 text-sm text-center mt-2 font-bold">
              오늘은 이미 분석을 완료했습니다. 내일 다시 시도해 주세요.
            </div>
          )}
        </form>
        {errorMsg && (
          <div className="text-red-500 text-sm text-center mt-2">
            {errorMsg}
          </div>
        )}
        {(meal || conclusion) && (
          <div className="w-full mt-4">
            {analyzedAt &&
              analyzedAt !== new Date().toISOString().slice(0, 10) && (
                <div className="text-base font-bold text-red-600 text-center mb-2 border border-red-200 bg-red-50 rounded p-2">
                  ※ 이 결과는 {analyzedAt}에 분석된 내용입니다
                </div>
              )}
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
            {analyzedAt &&
              analyzedAt === new Date().toISOString().slice(0, 10) && (
                <div className="text-xs text-gray-500 text-right mt-2">
                  분석일: {analyzedAt}
                </div>
              )}
          </div>
        )}
      </div>
      {/* 분석 히스토리 */}
      {/* 히스토리 전용 페이지로 이동됨 */}
    </>
  );
}
