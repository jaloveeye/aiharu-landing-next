"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Title, Body } from "@/components/ui/Typography";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // URL에서 인증 코드 추출
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setMessage("인증 중 오류가 발생했습니다. 다시 시도해주세요.");
          return;
        }

        if (data.session) {
          setStatus("success");
          setMessage("로그인 성공! 환영합니다.");
          
          // 잠시 후 메인 페이지로 리다이렉트
          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          setStatus("error");
          setMessage("인증이 완료되지 않았습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setStatus("error");
        setMessage("예상치 못한 오류가 발생했습니다. 다시 시도해주세요.");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-neutral-200/50 animate-fade-in-scale">
          <div className="text-center">
            {status === "loading" && (
              <>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <Title className="text-2xl mb-4 text-neutral-900">
                  인증 처리 중...
                </Title>
                <Body className="text-neutral-600">
                  구글 인증을 처리하고 있습니다. 잠시만 기다려주세요.
                </Body>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Title className="text-2xl mb-4 text-green-600">
                  로그인 성공!
                </Title>
                <Body className="text-neutral-600">
                  {message}
                </Body>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <Title className="text-2xl mb-4 text-red-600">
                  인증 실패
                </Title>
                <Body className="text-neutral-600 mb-6">
                  {message}
                </Body>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-6 py-3 bg-primary-gradient text-white font-semibold rounded-xl hover:shadow-medium transition-all duration-200"
                >
                  다시 시도하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
