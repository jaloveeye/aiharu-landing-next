"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HABIT_CATEGORIES, HABIT_FREQUENCIES } from "@/app/utils/iharu/types";

export default function CreateHabitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "morning" as const,
    frequency: "daily" as const,
    target_count: 1,
    child_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/iharu/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category,
          frequency: formData.frequency,
          target_count: formData.target_count,
          child_name: formData.child_name || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/iharu/habits");
      } else {
        setError(data.error || "습관 생성에 실패했습니다.");
      }
    } catch (error) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/iharu/habits"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
          >
            ← 습관 관리로 돌아가기
          </Link>
        </div>

        {/* 메인 타이틀 */}
        <div className="text-center mb-8">
          <Title>새 습관 만들기</Title>
          <Body>아이와 함께 성장할 습관을 설정해보세요</Body>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 습관 제목 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                습관 제목 *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 매일 독서하기, 정리정돈하기"
                required
              />
            </div>

            {/* 설명 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                설명 (선택사항)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="습관에 대한 자세한 설명을 적어주세요"
                rows={3}
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {HABIT_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("category", category.value)
                    }
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      formData.category === category.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{category.emoji}</div>
                    <div className="font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 빈도 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                빈도 *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {HABIT_FREQUENCIES.map((frequency) => (
                  <button
                    key={frequency.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("frequency", frequency.value)
                    }
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      formData.frequency === frequency.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{frequency.emoji}</div>
                    <div className="font-medium">{frequency.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 목표 횟수 */}
            <div>
              <label
                htmlFor="target_count"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                하루 목표 횟수
              </label>
              <input
                type="number"
                id="target_count"
                value={formData.target_count}
                onChange={(e) =>
                  handleInputChange(
                    "target_count",
                    parseInt(e.target.value) || 1
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="10"
              />
              <p className="text-sm text-gray-500 mt-1">
                하루에 몇 번 수행할 목표인지 설정해주세요
              </p>
            </div>

            {/* 아이 이름 */}
            <div>
              <label
                htmlFor="child_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                아이 이름 (선택사항)
              </label>
              <input
                type="text"
                id="child_name"
                value={formData.child_name}
                onChange={(e) =>
                  handleInputChange("child_name", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 민수, 지영"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/iharu/habits"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.title}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "생성 중..." : "습관 만들기"}
              </button>
            </div>
          </form>
        </div>

        {/* 도움말 */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h3 className="font-bold text-blue-900 mb-3">💡 습관 만들기 팁</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 구체적이고 명확한 제목을 사용해주세요</li>
            <li>• 처음에는 쉬운 습관부터 시작하는 것이 좋아요</li>
            <li>• 매일 같은 시간에 수행할 수 있는 습관을 선택해보세요</li>
            <li>• 아이와 함께 이야기하며 습관을 정해보세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
