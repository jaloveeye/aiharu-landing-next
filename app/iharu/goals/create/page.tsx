"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useState } from "react";

export default function CreateGoalPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    target_value: 100,
    unit: "회",
    target_date: "",
  });
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Placeholder: API 연동 전까지 알림만 표시
      alert("목표 생성은 곧 연결됩니다. (UI만 준비됨)");
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/iharu/goals"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
          >
            ← 목표 관리로 돌아가기
          </Link>
        </div>

        {/* 타이틀 */}
        <div className="text-center mb-8">
          <Title>새 목표 만들기</Title>
          <Body>아이와 함께 도전할 목표를 설정해보세요</Body>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                목표 제목 *
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 책 100쪽 읽기, 줄넘기 500회"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                설명 (선택)
              </label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="목표에 대한 자세한 설명을 적어주세요"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="target_value"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  목표 값
                </label>
                <input
                  id="target_value"
                  type="number"
                  min={1}
                  value={form.target_value}
                  onChange={(e) =>
                    handleChange("target_value", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  단위
                </label>
                <input
                  id="unit"
                  type="text"
                  value={form.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 회, 쪽, 분"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="target_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                목표일 (선택)
              </label>
              <input
                id="target_date"
                type="date"
                value={form.target_date}
                onChange={(e) => handleChange("target_date", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Link
                href="/iharu/goals"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading || !form.title}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "생성 중..." : "목표 만들기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
