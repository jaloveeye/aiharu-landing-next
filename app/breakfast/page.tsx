"use client";

import { useState, useEffect } from "react";
import { getAnonId } from "@/app/utils/common";
import Button from "@/components/ui/Button";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import { useApiData } from "@/app/hooks/useApiData";

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
    const [isReady, setIsReady] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageBase64, setImageBase64] = useState<string>("");
    const [imageError, setImageError] = useState<string>("");

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
        setIsReady(true); // userEmail까지 세팅된 후 isReady
      });
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUserEmail(session?.user?.email ?? null);
          setIsReady(true);
        }
      );
      return () => {
        listener?.subscription.unsubscribe();
      };
    }, []);

    const { data, error, isLoading } = useApiData<any>(
      isReady && (userEmail || anonId)
        ? userEmail
          ? `/api/analyze-meal?email=${encodeURIComponent(userEmail)}&latest=1`
          : `/api/analyze-meal?anon_id=${anonId}&latest=1`
        : null
    );

    useEffect(() => {
      if (!isLoading && data) {
        if (data.result) {
          setResult(data.result);
          setAnalyzedAt(data.lastAnalyzedAt);
          if (userEmail) {
            const analyzedDate = new Date(data.lastAnalyzedAt);
            const today = new Date();
            const isToday =
              analyzedDate.getFullYear() === today.getFullYear() &&
              analyzedDate.getMonth() === today.getMonth() &&
              analyzedDate.getDate() === today.getDate();
            setAlreadyAnalyzed(isToday);
          } else {
            setAlreadyAnalyzed(true);
          }
        } else {
          setResult("");
          setAnalyzedAt("");
          setAlreadyAnalyzed(false);
        }
      }
    }, [data, isLoading, userEmail]);

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
        ? { meal, anon_id: anonId, email: userEmail, imageBase64 }
        : { meal, anon_id: anonId, imageBase64 };
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
        {/* isReady가 false면 아무 메시지도 렌더링하지 않음 */}
        {!isReady ? null : (
          <>
            <Link
              href="/"
              className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
            >
              ← 홈으로 돌아가기
            </Link>
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
                required={!imageBase64}
                disabled={loading || alreadyAnalyzed || userEmail === undefined}
                aria-label="아침 식단 입력"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-800">
                  또는 사진으로 업로드
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  disabled={
                    loading || alreadyAnalyzed || userEmail === undefined
                  }
                  className="file:bg-green-700 file:text-white file:font-bold file:rounded file:px-3 file:py-1 file:border-none file:mr-2 file:cursor-pointer text-gray-800"
                  style={{ background: "#f9fafb" }}
                  onChange={async (e) => {
                    setImageError("");
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const allowedTypes = [
                      "image/png",
                      "image/jpeg",
                      "image/jpg",
                      "image/gif",
                      "image/webp",
                    ];
                    if (!allowedTypes.includes(file.type)) {
                      setImageError(
                        "지원하지 않는 이미지 형식입니다. png, jpg, gif, webp만 업로드할 수 있습니다."
                      );
                      setImageFile(null);
                      setImagePreview("");
                      setImageBase64("");
                      return;
                    }
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                      setImageBase64(
                        (reader.result as string).split(",")[1] || ""
                      );
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {imageError && <Alert variant="error">{imageError}</Alert>}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="업로드된 식단 사진 미리보기"
                    className="w-32 h-32 object-cover rounded border mt-2"
                  />
                )}
                {imageFile && (
                  <button
                    type="button"
                    className="text-xs font-bold text-red-600 underline mt-1"
                    style={{
                      background: "#fff8f8",
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      setImageBase64("");
                    }}
                  >
                    사진 삭제
                  </button>
                )}
              </div>
              <button
                type="submit"
                className={`rounded px-4 py-2 ${
                  loading || alreadyAnalyzed
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                disabled={loading || alreadyAnalyzed || userEmail === undefined}
                aria-label="식단 분석하기 버튼"
              >
                {loading ? <Spinner size={18} /> : "식단 분석하기"}
              </button>
              {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
              {alreadyAnalyzed && (
                <Alert variant="info">오늘은 이미 분석이 완료되었습니다.</Alert>
              )}
              {result && !errorMsg && !alreadyAnalyzed && (
                <Alert variant="success">분석이 완료되었습니다!</Alert>
              )}
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
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <NutritionForm />
    </div>
  );
}
