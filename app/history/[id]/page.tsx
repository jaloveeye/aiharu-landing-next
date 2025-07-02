"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function HistoryDetailPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [detail, setDetail] = useState<{
    meal_text: string;
    result: string;
    analyzed_at: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (userEmail && id) {
      setLoading(true);
      fetch(`/api/analyze-meal?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDetail(data);
          setLoading(false);
        });
    }
  }, [userEmail, id]);

  if (checking) return null;
  if (!userEmail) return null;

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
        {loading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : !detail ? (
          <div className="text-gray-400 text-center py-8">
            데이터를 찾을 수 없습니다.
          </div>
        ) : (
          <div>
            <div className="text-xs text-gray-500 mb-2 text-right">
              {detail.analyzed_at}
            </div>
            <div className="mb-4">
              <div className="text-yellow-700 font-bold mb-1">입력한 식단</div>
              <div className="text-yellow-900 whitespace-pre-line break-words">
                {detail.meal_text}
              </div>
            </div>
            <div>
              <div className="text-green-700 font-bold mb-1">분석 결과</div>
              <div className="text-green-900 whitespace-pre-line break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {detail.result}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
