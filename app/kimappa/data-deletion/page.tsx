"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function KimappaDataDeletionPage() {
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
      id: "user_profile",
      label: "프로필 정보",
      description: "이름, 이메일, 역할(부모/자녀) 등 개인 프로필 정보",
    },
    {
      id: "profile_photo",
      label: "프로필 사진",
      description: "업로드한 프로필 사진 이미지",
    },
    {
      id: "adventure_data",
      label: "모험 게임 데이터",
      description: "생성한 모험, 진행 중인 모험, 완료한 모험 기록",
    },
    {
      id: "daily_play",
      label: "일일 놀이 기록",
      description: "수수께끼 놀이 완료 기록 및 마법사탕 획득 내역",
    },
    {
      id: "family_data",
      label: "가족 구성원 정보",
      description: "가족 그룹 정보 및 구성원 관계 데이터",
    },
    {
      id: "service_logs",
      label: "서비스 이용 기록",
      description: "로그인 기록, 앱 사용 기록 등",
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

    if (!email) {
      setMessage({
        type: "error",
        text: "이메일 주소를 입력해 주세요.",
      });
      return;
    }

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
      // 이메일로 데이터 삭제 요청 전송
      const mailtoLink = `mailto:jaloveeye@gmail.com?subject=김아빠 데이터 삭제 요청&body=이메일: ${email}%0D%0A%0D%0A삭제 요청 데이터:%0D%0A${selectedData.map(id => {
        const dataType = dataTypes.find(d => d.id === id);
        return `- ${dataType?.label || id}`;
      }).join('%0D%0A')}%0D%0A%0D%0A위 데이터 삭제를 요청합니다.`;
      
      window.location.href = mailtoLink;

      setMessage({
        type: "success",
        text: "이메일 클라이언트가 열렸습니다. 이메일을 전송해주시면 7일 이내에 선택한 데이터가 삭제됩니다.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "오류가 발생했습니다. 직접 jaloveeye@gmail.com으로 이메일을 보내주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Link
          href="/kimappa"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 transition-colors"
        >
          ← 김아빠로 돌아가기
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <Title className="text-center mb-8 text-green-800">
            데이터 삭제 요청
          </Title>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              데이터 삭제 안내사항
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">
                  ℹ️ 안내사항
                </h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• 회원 탈퇴 없이 특정 데이터만 삭제할 수 있습니다.</li>
                  <li>• 삭제된 데이터는 복구할 수 없습니다.</li>
                  <li>• 삭제 요청 후 7일 이내에 선택한 데이터가 삭제됩니다.</li>
                  <li>• 계정은 유지되며 서비스 이용이 가능합니다.</li>
                </ul>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl">
                <h3 className="font-semibold text-amber-800 mb-2">
                  ⚠️ 주의사항
                </h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• 삭제된 데이터는 영구적으로 복구할 수 없습니다.</li>
                  <li>
                    • 서비스 이용에 필요한 데이터 삭제 시 기능이 제한될 수
                    있습니다.
                  </li>
                  <li>• 삭제 요청은 취소할 수 없습니다.</li>
                  <li>• 프로필 사진 삭제 시 기본 이미지로 변경됩니다.</li>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    전체 선택
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    전체 해제
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {dataTypes.map((dataType) => (
                  <label
                    key={dataType.id}
                    className="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedData.includes(dataType.id)}
                      onChange={() => handleDataSelection(dataType.id)}
                      className="mt-1 mr-3 w-5 h-5 text-green-600 focus:ring-green-500 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
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

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">✅ 확인사항</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 mr-3 w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span>선택한 데이터가 삭제되며 복구할 수 없음을 이해합니다.</span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 mr-3 w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span>데이터 삭제로 인한 서비스 기능 제한을 이해합니다.</span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 mr-3 w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span>입력한 이메일 주소가 정확함을 확인합니다.</span>
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
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
              >
                {isLoading ? "처리 중..." : "데이터 삭제 요청"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/kimappa")}
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg"
              >
                취소
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">📞 문의사항</h3>
            <p className="text-sm text-gray-600 mb-2">
              데이터 삭제 관련 문의사항이 있으시면 개인정보 보호책임자에게
              연락해 주세요.
            </p>
            <p className="text-sm text-gray-600">
              이메일:{" "}
              <a
                href="mailto:jaloveeye@gmail.com"
                className="text-green-600 hover:text-green-700 underline font-semibold"
              >
                jaloveeye@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

