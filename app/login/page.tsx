"use client";
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
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
      router.push("/child");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 max-w-sm w-full border rounded-xl p-8 shadow"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-700 mb-2">
          로그인
        </h2>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          aria-label="이메일 입력"
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="current-password"
          aria-label="비밀번호 입력"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
          disabled={loading}
          aria-label="로그인 버튼"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
        {errorMsg && <Alert variant="error">{errorMsg}</Alert>}
        {success && <Alert variant="success">로그인 성공! 환영합니다.</Alert>}
      </form>
    </div>
  );
}
