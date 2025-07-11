"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Alert from "@/components/ui/Alert";
import { useApiData } from "@/app/hooks/useApiData";
import { ImageIcon, TextIcon } from "@/components/ui/IconAnalysisType";

/**
 * 분석 상세 페이지
 */
export default function HistoryDetailPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

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

  const { data, error, isLoading } = useApiData<any>(
    userEmail && id ? `/api/analyze-meal?id=${id}` : null
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full mt-6 mx-auto">
        <Link
          href="/history"
          className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
        >
          ← 분석 내역으로 돌아가기
        </Link>
        <div className="text-2xl font-bold text-yellow-700 mb-4 text-center">
          분석 상세
        </div>
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : error ? (
          <Alert variant="error">불러오기 실패: {error.message}</Alert>
        ) : !data ? (
          <div className="text-gray-400 text-center py-8">
            데이터를 찾을 수 없습니다.
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-500">
                {formatDateToLocal(data.analyzed_at)}
              </div>
              {data.source_type && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                    data.source_type === "image"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}
                >
                  {data.source_type === "image" ? <ImageIcon /> : <TextIcon />}
                  {data.source_type === "image" ? "이미지" : "텍스트"}
                </span>
              )}
            </div>
            <div className="mb-4">
              <div className="text-yellow-700 font-bold mb-1">입력한 식단</div>
              <div className="text-yellow-900 whitespace-pre-line break-words">
                {data.meal_text}
              </div>
            </div>
            <div>
              <div className="text-green-700 font-bold mb-1">분석 결과</div>
              <div className="text-green-900 whitespace-pre-line break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.result}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
