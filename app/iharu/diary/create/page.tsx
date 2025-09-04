"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useState } from "react";

export default function CreateDiaryPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ date: "", mood_rating: 3, notes: "" });
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      alert("일기 작성은 곧 연결됩니다. (UI만 준비됨)");
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
            href="/iharu/diary"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
          >
            ← 일일 기록으로 돌아가기
          </Link>
        </div>

        <div className="text-center mb-8">
          <Title>기록 작성하기</Title>
          <Body>오늘의 순간을 간단히 남겨보세요</Body>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  날짜
                </label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기분
                </label>
                <select
                  value={form.mood_rating}
                  onChange={(e) =>
                    handleChange("mood_rating", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                메모
              </label>
              <textarea
                id="notes"
                rows={4}
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="오늘 있었던 일이나 느낀 점을 적어보세요"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Link
                href="/iharu/diary"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "작성 중..." : "기록 작성하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
