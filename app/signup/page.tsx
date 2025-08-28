"use client";
import { useState, useRef } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const loginLinkRef = useRef<HTMLAnchorElement>(null);

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrorMsg("");
    
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200/50 animate-fade-in-scale">
          <div className="text-center mb-8">
            <Title className="text-3xl mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              시작하기
            </Title>
            <Body className="text-neutral-600">
              구글 계정으로 간편하게 시작하세요
            </Body>
          </div>

          <div className="space-y-6">
            {/* Google Sign Up Button */}
            <Button
              onClick={handleGoogleSignup}
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {loading ? "처리 중..." : "구글로 시작하기"}
            </Button>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm text-center animate-fade-in-up">
                {errorMsg}
              </div>
            )}


          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            회원가입 시{" "}
            <a href="/privacy" className="text-primary hover:underline">
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
