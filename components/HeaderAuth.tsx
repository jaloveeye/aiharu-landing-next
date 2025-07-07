"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

export default function HeaderAuth() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    const supabase = createClient();
    // 최초 유저 정보
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
    });
    // 인증 상태 변경 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserEmail(null);
    window.location.reload();
  };
  return (
    <header className="w-full flex justify-end items-center px-6 py-3 bg-white border-b min-h-[48px]">
      {userEmail ? (
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <span>{userEmail}</span>
          <a
            href="/history"
            className="ml-2 px-3 py-1 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-300 rounded hover:bg-yellow-100 transition-colors"
          >
            분석 내역
          </a>
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <a
          href="/login"
          className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          로그인하기
        </a>
      )}
    </header>
  );
}
