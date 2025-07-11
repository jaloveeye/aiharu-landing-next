"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import Alert from "@/components/ui/Alert";
import { useApiData } from "@/app/hooks/useApiData";
import { ImageIcon, TextIcon } from "@/components/ui/IconAnalysisType";
import Card from "@/components/ui/Card";
import NutritionTrendChart from "@/components/ui/NutritionTrendChart";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 분석 히스토리(목록) 페이지
 */
export default function HistoryPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
        setChecking(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!checking && !userEmail) {
      router.replace("/login?redirect=/history");
    }
  }, [checking, userEmail, router]);

  const { data, error, isLoading } = useApiData<{ history: any[] }>(
    userEmail
      ? `/api/analyze-meal?email=${encodeURIComponent(userEmail)}`
      : null
  );

  if (checking) return null;
  if (!userEmail) return null;

  function formatDateToLocal(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  // result에서 장점, 개선사항, 추천 식단 각각 분리 추출 함수
  function extractHighlights(result: string) {
    if (!result) return {};
    // 5. 식단의 장점과 개선이 필요한 점
    const advImpMatch = result.match(
      /####? ?5[\.|\)]? ?([\s\S]*?)(####|6[\.|\)]|7[\.|\)]|$)/
    );
    let advantage = null,
      improvement = null;
    if (advImpMatch) {
      const section = advImpMatch[1];
      const advMatch = section.match(
        /\*\*장점\*\*:\s*([\s\S]*?)(\*\*개선이 필요한 점\*\*|$)/
      );
      if (advMatch) advantage = advMatch[1].trim();
      const impMatch = section.match(/\*\*개선이 필요한 점\*\*:\s*([\s\S]*)/);
      if (impMatch) improvement = impMatch[1].trim();
    }
    // 6. 내일 아침 추천 식단 제안
    let suggestion = null;
    const suggestionMatch = result.match(
      /####? ?6[\.|\)]? ?([\s\S]*?)(####|7[\.|\)]|$)/
    );
    if (suggestionMatch) {
      suggestion = suggestionMatch[1].trim();
    }
    return { advantage, improvement, suggestion };
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-2xl w-full mt-6 mx-auto">
        <Link
          href="/"
          className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
        >
          ← 홈으로 돌아가기
        </Link>
        <div className="text-2xl font-bold text-yellow-700 mb-4 text-center">
          분석 히스토리
        </div>
        {/* 분석 이력이 있을 때만 트렌드 차트 표시 */}
        {Array.isArray(data?.history) && data.history.length > 1 && (
          <div className="mb-8">
            <div className="text-lg font-bold text-blue-700 mb-2 text-center">
              최근 영양소 섭취 트렌드
            </div>
            <NutritionTrendChart
              analyses={data.history.map((h) => ({
                analyzed_at: h.analyzed_at,
                result: h.result,
              }))}
            />
          </div>
        )}
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : error ? (
          <Alert variant="error">불러오기 실패: {error.message}</Alert>
        ) : !data?.history?.length ? (
          <div className="text-gray-400 text-center py-8">
            분석 내역이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.history.map((item) => {
              const { advantage, improvement, suggestion } = extractHighlights(
                item.result || ""
              );
              // 추천 식단 텍스트 후처리: 타이틀/머릿말/식단: 제거
              let suggestionText = "";
              if (suggestion) {
                suggestionText = suggestion
                  .replace(/^내일 아침 추천 식단 제안[:：]?/i, "")
                  // 리스트 항목 전체가 식단 머릿말일 경우 해당 줄 완전 제거
                  .split(/\r?\n/)
                  .map((line) =>
                    line.match(
                      /^\s*-\s*(\*\*|<strong>|<b>)?식단(\*\*|<\/strong>|<\/b>)?\s*:?\s*$/i
                    )
                      ? ""
                      : line
                          .replace(/^\*\*?식단\*\*?\s*:\s*/i, "추천식단: ")
                          .replace(/^식단\s*:\s*/i, "추천식단: ")
                          .replace(
                            /^<strong>식단<\/strong>\s*:?/i,
                            "추천식단: "
                          )
                          .replace(/^<b>식단<\/b>\s*:?/i, "추천식단: ")
                  )
                  .filter(Boolean)
                  .join("\n")
                  .replace(/^\s*-\s*/gm, "- ")
                  .trim();
              }
              return (
                <Card key={item.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-2">
                    {/* 날짜, 아이콘, 상세보기 링크를 한 줄에 */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                        {formatDateToLocal(item.analyzed_at)}
                      </span>
                      {item.source_type === "image" ? (
                        <ImageIcon className="w-6 h-6 text-blue-500" />
                      ) : (
                        <TextIcon className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    <Link
                      href={`/history/${item.id}`}
                      className="text-xs text-blue-700 hover:underline font-bold"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                  <div className="text-xl font-bold text-yellow-900 break-words mb-1">
                    {item.meal_text?.slice(0, 40) || "(식단 정보 없음)"}
                  </div>
                  {/* 장점, 개선사항, 추천 식단을 각각 별도 박스로 표시 */}
                  {advantage && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-2 rounded mt-1">
                      <div className="font-semibold text-green-700 mb-1 text-sm">
                        장점
                      </div>
                      <div className="prose prose-sm text-green-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {advantage}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {improvement && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded mt-1">
                      <div className="font-semibold text-yellow-700 mb-1 text-sm">
                        개선사항
                      </div>
                      <div className="prose prose-sm text-yellow-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {improvement}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {suggestionText && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded mt-1">
                      <div className="font-semibold text-blue-700 mb-1 text-sm">
                        추천식단
                      </div>
                      <div className="prose prose-sm text-blue-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {suggestionText}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
