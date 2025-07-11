import { useState, useEffect, useCallback } from "react";
import { getAnonId } from "@/app/utils/common";
import { createClient } from "@/app/utils/supabase/client";
import { useApiData } from "@/app/hooks/useApiData";

interface UseMealAnalysisFormOptions {
  extractMealAndConclusion?: (
    result: string,
    mealText?: string
  ) => { meal: string; conclusion: string };
  withConclusion?: boolean;
}

export function useMealAnalysisForm(options: UseMealAnalysisFormOptions = {}) {
  const { extractMealAndConclusion, withConclusion } = options;
  const [mealInput, setMealInput] = useState("");
  const [result, setResult] = useState("");
  const [meal, setMeal] = useState("");
  const [conclusion, setConclusion] = useState("");
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
  const [sourceType, setSourceType] = useState<"image" | "text" | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnonId(getAnonId());
    }
  }, []);

  useEffect(() => {
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
        if (withConclusion && extractMealAndConclusion) {
          const { meal, conclusion } = extractMealAndConclusion(data.result);
          setMeal(meal);
          setConclusion(conclusion);
          setResult(data.result); // 전체 분석 결과도 항상 저장
        } else {
          setResult(data.result);
        }
        setAnalyzedAt(data.lastAnalyzedAt);
        setSourceType(data.sourceType || null);
        setAnalysisId(data.id || null);
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
        setMeal("");
        setConclusion("");
        setAnalyzedAt("");
        setAlreadyAnalyzed(false);
        setSourceType(null);
        setAnalysisId(null);
      }
    }
  }, [data, isLoading, userEmail, extractMealAndConclusion, withConclusion]);

  const handleImageChange = useCallback((file: File | null) => {
    setImageError("");
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      setImageBase64("");
      return;
    }
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
      setImageBase64((reader.result as string).split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg("");
      setSourceType(null);
      if (withConclusion) {
        setMeal("");
        setConclusion("");
        setResult(""); // 전체 분석 결과도 초기화
      } else {
        setResult("");
      }
      // 브라우저 로컬 날짜(yyyy-mm-dd) 생성
      const now = new Date();
      const todayLocal = now.toISOString().slice(0, 10);
      const body = userEmail
        ? {
            meal: mealInput,
            anon_id: anonId,
            email: userEmail,
            imageBase64,
            todayLocal,
          }
        : { meal: mealInput, anon_id: anonId, imageBase64, todayLocal };
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
        if (withConclusion) {
          setMeal("");
          setConclusion("");
          setResult(""); // 전체 분석 결과도 초기화
        } else {
          setResult("");
        }
        setAnalyzedAt(data.lastAnalyzedAt || "");
        setAlreadyAnalyzed(true);
        setSourceType(data.sourceType || null);
        return;
      }
      if (data.result) {
        if (withConclusion && extractMealAndConclusion) {
          const { meal, conclusion } = extractMealAndConclusion(data.result);
          setMeal(meal);
          setConclusion(conclusion);
          setResult(data.result); // 전체 분석 결과도 저장
        } else {
          setResult(data.result);
        }
        setAnalyzedAt(data.lastAnalyzedAt || "");
        setAlreadyAnalyzed(true);
        setErrorMsg("");
        setSourceType(data.sourceType || null);
      } else {
        setErrorMsg(data.error || "분석에 실패했습니다.");
        setSourceType(null);
      }
    },
    [
      userEmail,
      mealInput,
      anonId,
      imageBase64,
      withConclusion,
      extractMealAndConclusion,
    ]
  );

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserEmail(null);
    window.location.reload();
  }, []);

  return {
    mealInput,
    setMealInput,
    result,
    meal,
    conclusion,
    loading,
    alreadyAnalyzed,
    anonId,
    analyzedAt,
    errorMsg,
    userEmail,
    isReady,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    imageBase64,
    setImageBase64,
    imageError,
    setImageError,
    sourceType,
    setSourceType,
    handleImageChange,
    handleSubmit,
    handleLogout,
    analysisId,
  };
}
