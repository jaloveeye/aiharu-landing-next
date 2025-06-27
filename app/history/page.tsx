"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";

export default function HistoryPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [history, setHistory] = useState<
    { id: number; meal_text: string; result: string; analyzed_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("[HISTORY] useEffect: checking session...");
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      console.log("[HISTORY] getUser result:", data);
      setUserEmail(data?.user?.email ?? null);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("[HISTORY] onAuthStateChange:", session);
        setUserEmail(session?.user?.email ?? null);
        setChecking(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    console.log("[HISTORY] checking:", checking, "userEmail:", userEmail);
    if (!checking && !userEmail) {
      console.log("[HISTORY] redirecting to login");
      router.replace("/login?redirect=/history");
    }
  }, [checking, userEmail, router]);

  useEffect(() => {
    console.log("[HISTORY] userEmail changed:", userEmail);
    if (userEmail) {
      setLoading(true);
      fetch(`/api/analyze-meal?email=${encodeURIComponent(userEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          setHistory(data.history || []);
          setLoading(false);
        });
    }
  }, [userEmail]);

  if (checking) return null;
  if (!userEmail) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full mt-6 mx-auto">
        <Link
          href="/child"
          className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
        >
          ← 아이하루로 돌아가기
        </Link>
        <div className="text-2xl font-bold text-yellow-700 mb-4 text-center">
          나의 분석 히스토리
        </div>
        {loading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : history.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            분석 이력이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-yellow-100">
            {history.map((h) => (
              <li
                key={h.id}
                className="py-3 text-left hover:bg-yellow-100 transition-colors cursor-pointer rounded"
              >
                <Link href={`/history/${h.id}`} className="block px-2 py-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {h.analyzed_at}
                  </div>
                  <div className="text-yellow-800 font-semibold mb-1 truncate">
                    {h.meal_text}
                  </div>
                  <div className="text-green-700 text-sm whitespace-pre-line line-clamp-3">
                    {h.result.slice(0, 200)}...
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
