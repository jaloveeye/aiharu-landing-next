"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import Alert from "@/components/ui/Alert";
import { useApiData } from "@/app/hooks/useApiData";
import { ImageIcon, TextIcon } from "@/components/ui/IconAnalysisType";
import Card from "@/components/ui/Card";

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
            {data.history.map((item) => (
              <Card key={item.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span>
                    {item.source_type === "image" ? (
                      <ImageIcon className="w-6 h-6 text-blue-500" />
                    ) : (
                      <TextIcon className="w-6 h-6 text-green-500" />
                    )}
                  </span>
                </div>
                <div className="text-xl font-bold text-yellow-900 break-words mb-1">
                  {item.meal_text?.slice(0, 40) || "(식단 정보 없음)"}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                    {item.analyzed_at}
                  </span>
                  <Link
                    href={`/history/${item.id}`}
                    className="text-xs text-blue-700 hover:underline font-bold"
                  >
                    상세 보기 →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
