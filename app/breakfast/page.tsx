"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@/components/ui/Button";
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

export default function BreakfastPage() {
  function NutritionForm() {
    const [meal, setMeal] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [alreadyAnalyzed, setAlreadyAnalyzed] = useState(false);
    const [anonId, setAnonId] = useState("");
    const [analyzedAt, setAnalyzedAt] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setAnonId(getAnonId());
      }
    }, []);

    useEffect(() => {
      // 로그인된 사용자 정보 가져오기
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data?.user?.email ?? null);
      });
    }, []);

    useEffect(() => {
      // 로그인된 사용자는 email 기준, 비로그인 사용자는 anon_id 기준으로 최신 분석 결과 조회
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
            setResult(data.result);
            setAnalyzedAt(data.lastAnalyzedAt);
            setAlreadyAnalyzed(true);
          } else {
            setResult("");
            setAnalyzedAt("");
            setAlreadyAnalyzed(false);
          }
        });
    }, [userEmail, anonId]);

    const handleLogout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUserEmail(null);
      window.location.reload();
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg("");
      setResult("");
      const body = userEmail
        ? { meal, anon_id: anonId, email: userEmail }
        : { meal, anon_id: anonId };
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
        setResult(data.result || "");
        setAnalyzedAt(data.lastAnalyzedAt || "");
        setAlreadyAnalyzed(true);
        return;
      }
      setResult(
        data.result ||
          (typeof data.error === "object"
            ? JSON.stringify(data.error, null, 2)
            : data.error)
      );
      if (data.result) {
        setAnalyzedAt(data.lastAnalyzedAt || "");
        setAlreadyAnalyzed(true);
      }
    };

    return (
      <>
        {userEmail && (
          <div
            className="w-full flex justify-center items-center mb-4 gap-2 bg-blue-50 border border-blue-200 rounded-lg py-2 px-4 shadow text-base font-semibold text-blue-800"
            style={{ position: "relative", top: "-24px", zIndex: 10 }}
          >
            <span>
              로그인: <b>{userEmail}</b>
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 text-xs font-bold text-blue-700 bg-white border border-blue-300 rounded hover:bg-blue-100 transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-md mx-auto mt-20 w-full"
        >
          <h2 className="text-2xl font-bold text-center text-yellow-700 mb-2">
            오늘의 아침 식단을 기록해보세요
          </h2>
          <textarea
            className={`border rounded p-2 text-gray-800 placeholder-gray-400 ${
              loading || alreadyAnalyzed
                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                : ""
            }`}
            rows={3}
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            placeholder="예: 닭가슴살 50g, 바나나 1개, 우유 200ml"
            required
            disabled={loading || alreadyAnalyzed || userEmail === undefined}
          />
          <button
            type="submit"
            className={`rounded px-4 py-2 ${
              loading || alreadyAnalyzed
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            disabled={loading || alreadyAnalyzed || userEmail === undefined}
          >
            {loading ? "분석 중..." : "식단 분석하기"}
          </button>
          {errorMsg && (
            <div className="text-red-500 text-sm text-center mt-2">
              {errorMsg}
            </div>
          )}
          {alreadyAnalyzed && (
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
          {result && (
            <div>
              {analyzedAt &&
                analyzedAt !== new Date().toISOString().slice(0, 10) && (
                  <div className="text-base font-bold text-red-600 text-center mb-2 border border-red-200 bg-red-50 rounded p-2">
                    ※ 이 결과는 {analyzedAt}에 분석된 내용입니다
                  </div>
                )}
              <div
                className="bg-white border border-green-300 rounded p-4 whitespace-pre-line mt-2 text-base leading-relaxed max-h-80 overflow-y-auto shadow text-gray-800"
                style={{ wordBreak: "break-word" }}
              >
                {result}
              </div>
              {analyzedAt &&
                analyzedAt === new Date().toISOString().slice(0, 10) && (
                  <div className="text-xs text-gray-500 text-right mt-1">
                    분석일: {analyzedAt}
                  </div>
                )}
            </div>
          )}
        </form>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <NutritionForm />
    </div>
  );
}
