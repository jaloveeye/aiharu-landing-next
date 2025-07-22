"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function DataDeletionPage() {
  const [email, setEmail] = useState("");
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const dataTypes = [
    {
      id: "meal_analysis",
      label: "식단 분석 기록",
      description: "업로드한 식단 사진과 분석 결과 데이터",
    },
    {
      id: "user_profile",
      label: "프로필 정보",
      description: "이름, 생년월일, 성별 등 개인 프로필 정보",
    },
    {
      id: "preferences",
      label: "설정 및 선호도",
      description: "알림 설정, 영양소 선호도 등 개인 설정",
    },
    {
      id: "uploaded_images",
      label: "업로드된 이미지",
      description: "식단 분석을 위해 업로드한 모든 이미지 파일",
    },
    {
      id: "service_logs",
      label: "서비스 이용 기록",
      description: "로그인 기록, 페이지 방문 기록 등",
    },
  ];

  const handleDataSelection = (dataId: string) => {
    setSelectedData((prev) =>
      prev.includes(dataId)
        ? prev.filter((id) => id !== dataId)
        : [...prev, dataId]
    );
  };

  const handleSelectAll = () => {
    setSelectedData(dataTypes.map((type) => type.id));
  };

  const handleDeselectAll = () => {
    setSelectedData([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedData.length === 0) {
      setMessage({
        type: "error",
        text: "삭제할 데이터를 하나 이상 선택해 주세요.",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          dataTypes: selectedData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "데이터 삭제 요청이 성공적으로 접수되었습니다. 7일 이내에 선택한 데이터가 삭제됩니다.",
        });
        setEmail("");
        setSelectedData([]);
      } else {
        setMessage({
          type: "error",
          text: data.error || "데이터 삭제 요청 처리 중 오류가 발생했습니다.",
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
      <main className="flex flex-col items-center gap-8 w-full max-w-3xl">
        <Title className="text-center mb-8">데이터 삭제 요청</Title>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow w-full">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              데이터 삭제 안내사항
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold text-blue-800 mb-2">
                  ℹ️ 안내사항
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• 회원 탈퇴 없이 특정 데이터만 삭제할 수 있습니다.</li>
                  <li>• 삭제된 데이터는 복구할 수 없습니다.</li>
                  <li>• 삭제 요청 후 7일 이내에 선택한 데이터가 삭제됩니다.</li>
                  <li>• 계정은 유지되며 서비스 이용이 가능합니다.</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ 주의사항
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• 삭제된 데이터는 영구적으로 복구할 수 없습니다.</li>
                  <li>
                    • 서비스 이용에 필요한 데이터 삭제 시 기능이 제한될 수
                    있습니다.
                  </li>
                  <li>• 삭제 요청은 취소할 수 없습니다.</li>
                </ul>
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
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  삭제할 데이터 선택 *
                </label>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    전체 선택
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    전체 해제
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {dataTypes.map((dataType) => (
                  <label
                    key={dataType.id}
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedData.includes(dataType.id)}
                      onChange={() => handleDataSelection(dataType.id)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {dataType.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {dataType.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 확인사항</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input type="checkbox" required className="mr-2" />
                  선택한 데이터가 삭제되며 복구할 수 없음을 이해합니다.
                </label>
                <label className="flex items-center">
                  <input type="checkbox" required className="mr-2" />
                  데이터 삭제로 인한 서비스 기능 제한을 이해합니다.
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
                disabled={isLoading || selectedData.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? "처리 중..." : "데이터 삭제 요청"}
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
              데이터 삭제 관련 문의사항이 있으시면 개인정보 보호책임자에게
              연락해 주세요.
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
