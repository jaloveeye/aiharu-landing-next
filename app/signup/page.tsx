"use client";
import { useState, useRef } from "react";
import { createClient } from "@/app/utils/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const loginLinkRef = useRef<HTMLAnchorElement>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      if (error.message.toLowerCase().includes("already registered")) {
        loginLinkRef.current?.classList.add("animate-bounce-once");
        setTimeout(() => {
          loginLinkRef.current?.classList.remove("animate-bounce-once");
        }, 700);
      }
    } else {
      setSuccess(true);
      // anon_id → email 매핑
      const anonId = localStorage.getItem("anon_id");
      if (anonId && email) {
        await fetch("/api/map-anon-to-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anon_id: anonId, email }),
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 max-w-sm w-full border rounded-xl p-8 shadow"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-700 mb-2">
          회원가입
        </h2>
        <input
          type="email"
          className="border rounded p-2 text-gray-800"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          className="border rounded p-2 text-gray-800"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
          disabled={loading}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
        {errorMsg && (
          <div className="text-red-500 text-sm text-center">{errorMsg}</div>
        )}
        {success && (
          <div className="text-green-600 text-sm text-center">
            회원가입이 완료되었습니다! 로그인해 주세요.
          </div>
        )}
        <div className="mt-4 text-center">
          <span className="text-gray-500 text-sm">이미 회원이신가요?</span>
          <a
            ref={loginLinkRef}
            href="/login"
            className="ml-2 text-blue-600 hover:underline font-bold text-sm"
          >
            로그인하기
          </a>
        </div>
      </form>
    </div>
  );
}
