"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/app/utils/supabase/client";
import Alert from "@/components/ui/Alert";
import { getAnonId } from "@/app/utils/common";
import { useApiData } from "@/app/hooks/useApiData";

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
  const [isReady, setIsReady] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [sourceType, setSourceType] = useState<"image" | "text" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnonId(getAnonId());
    }
  }, []);

  useEffect(() => {
    // Supabase userEmail 세팅 후 isReady
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
      setIsReady(true);
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
        const { meal, conclusion } = extractMealAndConclusion(data.result);
        setMeal(meal);
        setConclusion(conclusion);
        setAnalyzedAt(data.lastAnalyzedAt);
        setSourceType(data.sourceType || null);
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
        setMeal("");
        setConclusion("");
        setAnalyzedAt("");
        setAlreadyAnalyzed(false);
        setSourceType(null);
      }
    }
  }, [data, isLoading, userEmail]);

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
    setSourceType(null);
    // 분석 시도
    const body = userEmail
      ? { meal: mealInput, anon_id: anonId, email: userEmail, imageBase64 }
      : { meal: mealInput, anon_id: anonId, imageBase64 };
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
      setSourceType(data.sourceType || null);
      return;
    }
    if (data.result) {
      const { meal, conclusion } = extractMealAndConclusion(data.result);
      setMeal(meal);
      setConclusion(conclusion);
      setAnalyzedAt(data.lastAnalyzedAt || "");
      setAlreadyAnalyzed(true);
      setErrorMsg("");
      setSourceType(data.sourceType || null);
    } else {
      setErrorMsg(data.error || "분석에 실패했습니다.");
      setSourceType(null);
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
      {/* isReady가 false면 아무 메시지도 렌더링하지 않음 */}
      {!isReady ? null : (
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
              required={!imageBase64}
              disabled={loading || alreadyAnalyzed || userEmail === undefined}
            />
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-bold text-gray-800">
                또는 사진으로 업로드
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                disabled={loading || alreadyAnalyzed || userEmail === undefined}
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
                  className="w-32 h-32 object-cover rounded border mt-2 mx-auto"
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
                  <div
                    className="text-base font-bold text-red-600 text-center mb-2 border border-red-200 bg-red-50 rounded p-2"
                    role="alert"
                    aria-live="polite"
                  >
                    ※ 이 결과는 {analyzedAt}에 분석된 내용입니다
                  </div>
                )}
              {meal && (
                <div className="text-yellow-700 text-sm font-semibold whitespace-pre-line mb-2">
                  <span className="block mb-1 text-yellow-500 font-bold">
                    입력한 식단
                    {sourceType === "image" && (
                      <span title="사진 분석" className="ml-1">
                        📷
                      </span>
                    )}
                    {sourceType === "text" && (
                      <span title="직접 입력" className="ml-1">
                        ✍️
                      </span>
                    )}
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
      )}
      {/* 분석 히스토리 */}
      {/* 히스토리 전용 페이지로 이동됨 */}
    </>
  );
}
