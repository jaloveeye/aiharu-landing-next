"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useState } from "react";

export default function CreateRewardPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    points: 1000,
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
      alert("보상 생성은 곧 연결됩니다. (UI만 준비됨)");
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/iharu/rewards"
            className="text-yellow-700 hover:underline flex items-center gap-1 text-sm"
          >
            ← 보상 목록으로 돌아가기
          </Link>
        </div>

        <div className="text-center mb-8">
          <Title>새 보상 만들기</Title>
          <Body>포인트로 교환할 보상을 만들어 보세요</Body>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                보상명 *
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="예: 아이스크림, 영화 보기"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="보상에 대한 설명을 적어주세요"
              />
            </div>

            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                필요 포인트
              </label>
              <input
                id="points"
                type="number"
                min={0}
                value={form.points}
                onChange={(e) =>
                  handleChange("points", parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Link
                href="/iharu/rewards"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading || !form.title}
                className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "생성 중..." : "보상 만들기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
