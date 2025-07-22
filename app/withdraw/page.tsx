"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { createClient } from "@/app/utils/supabase/client";

export default function WithdrawPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // 회원 탈퇴 요청 API 호출
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "회원 탈퇴 요청이 성공적으로 접수되었습니다. 30일 이내에 모든 데이터가 삭제됩니다.",
        });
        setEmail("");
        setReason("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "회원 탈퇴 요청 처리 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "네트워크 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-20">
      <Link
        href="/"
        className="self-start mb-4 text-gray-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 홈으로 돌아가기
      </Link>
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <Title className="text-center mb-8">회원 탈퇴 및 데이터 삭제</Title>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow w-full">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              탈퇴 안내사항
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ 주의사항
                </h3>
                <ul className="text-sm space-y-1">
                  <li>
                    • 탈퇴 시 모든 개인정보와 서비스 이용 데이터가 삭제됩니다.
                  </li>
                  <li>• 삭제된 데이터는 복구할 수 없습니다.</li>
                  <li>
                    • 탈퇴 후 30일 이내에 모든 데이터가 완전히 삭제됩니다.
                  </li>
                  <li>• 탈퇴 처리 중에는 서비스 이용이 제한될 수 있습니다.</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📋 삭제되는 데이터
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• 회원 계정 정보 (이메일, 프로필 등)</li>
                  <li>• 서비스 이용 기록 및 분석 데이터</li>
                  <li>• 개인 설정 및 선호도 정보</li>
                  <li>• 업로드된 이미지 및 파일</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <h3 className="font-semibold text-green-800 mb-2">
                  💡 다른 선택지
                </h3>
                <p className="text-sm mb-2">
                  회원 탈퇴 없이 특정 데이터만 삭제하고 싶으시다면, 데이터 삭제
                  요청 페이지를 이용해 보세요.
                </p>
                <a
                  href="/data-deletion"
                  className="inline-block px-3 py-1 bg-white text-green-700 border border-green-600 text-sm font-medium rounded hover:bg-green-50 transition-colors"
                >
                  데이터 삭제 요청하기
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                회원 이메일 주소 *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="가입 시 사용한 이메일 주소를 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                탈퇴 사유 (선택사항)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="탈퇴 사유를 알려주시면 서비스 개선에 도움이 됩니다."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 확인사항</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input type="checkbox" required className="mr-2" />
                  탈퇴 시 모든 데이터가 삭제되며 복구할 수 없음을 이해합니다.
                </label>
                <label className="flex items-center">
                  <input type="checkbox" required className="mr-2" />
                  탈퇴 처리 중 서비스 이용이 제한될 수 있음을 이해합니다.
                </label>
                <label className="flex items-center">
                  <input type="checkbox" required className="mr-2" />
                  입력한 이메일 주소가 정확함을 확인합니다.
                </label>
              </div>
            </div>

            {message && (
              <Alert variant={message.type === "success" ? "success" : "error"}>
                {message.text}
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
              >
                {isLoading ? "처리 중..." : "회원 탈퇴 요청"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/")}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">📞 문의사항</h3>
            <p className="text-sm text-gray-600">
              회원 탈퇴 관련 문의사항이 있으시면 개인정보 보호책임자에게 연락해
              주세요.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              이메일:{" "}
              <a
                href="mailto:jaloveeye@gmail.com"
                className="text-blue-600 hover:underline"
              >
                jaloveeye@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
