"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { promptTemplates, PromptExample } from "@/data/prompts";
import {
  PromptResult,
  getTodayPromptResult,
  getRecentPromptResults,
  getPromptCountByCategory,
  getPromptResultsByCategory,
} from "@/app/utils/promptResults";
import PromptDetailModal from "@/components/PromptDetailModal";

export default function AiPromptsPage() {
  const [aiResult, setAiResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 저장된 프롬프트 결과들
  const [todayResult, setTodayResult] = useState<PromptResult | null>(null);
  const [recentResults, setRecentResults] = useState<PromptResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryResults, setCategoryResults] = useState<PromptResult[]>([]);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromptResult, setSelectedPromptResult] =
    useState<PromptResult | null>(null);

  useEffect(() => {
    // 페이지 로드 시 저장된 결과들 가져오기
    const loadResults = async () => {
      try {
        const [today, recent, counts] = await Promise.all([
          getTodayPromptResult(),
          getRecentPromptResults(10),
          getPromptCountByCategory(),
        ]);

        setTodayResult(today);
        setRecentResults(recent);
        setCategoryCounts(counts);

        // 오늘 결과가 있으면 AI 답변 설정
        if (today) {
          setAiResult(today.ai_result);
        }
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoadingResults(false);
      }
    };

    loadResults();
  }, []);

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    setAiResult("");
    setError("");

    try {
      // 해당 카테고리의 프롬프트 결과들 가져오기
      const results = await getPromptResultsByCategory(category);
      setCategoryResults(results);
    } catch (error) {
      console.error("Error fetching category results:", error);
      setCategoryResults([]);
    }
  };

  const handlePromptClick = (promptResult: PromptResult) => {
    setSelectedPromptResult(promptResult);
    setIsModalOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      // 육아 관련 카테고리 (최우선)
      육아: "bg-pink-100 text-pink-800",
      육아창업: "bg-indigo-100 text-indigo-800",
      // 비즈니스 관련 카테고리
      비즈니스마케팅: "bg-blue-100 text-blue-800",
      // 학습 및 개인 성장 카테고리
      학습교육: "bg-emerald-100 text-emerald-800",
      // 일상 및 기타 카테고리
      일상라이프: "bg-amber-100 text-amber-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      초급: "bg-green-100 text-green-700",
      중급: "bg-yellow-100 text-yellow-700",
      고급: "bg-red-100 text-red-700",
    };
    return (
      colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link
          href="/ai"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 transition-colors"
        >
          ← AI하루로 돌아가기
        </Link>

        <div className="text-center mb-16">
          <Title className="mb-6">매일의 AI 프롬프트</Title>
          <div className="text-lg text-gray-700 max-w-3xl mx-auto">
            <p className="mb-2">
              매일 오전 9시에 자동으로 생성되는
              <br />
              다양한 주제의 프롬프트와 AI 답변을 확인해보세요.
            </p>
            <p>
              육아, 육아창업, 비즈니스마케팅, 학습교육 등<br />
              실용적이고 전문적인 주제들을 다룹니다.
            </p>
          </div>
        </div>

        {/* 오늘의 프롬프트가 없을 때 안내 메시지 */}
        {!todayResult && !selectedCategory && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center text-gray-600">
              <p className="text-lg mb-2">
                오늘의 프롬프트가 아직 생성되지 않았습니다.
              </p>
              <p className="text-sm">매일 오전 9시에 자동으로 생성됩니다.</p>
            </div>
          </div>
        )}

        {/* 카테고리별 프롬프트 결과들 */}
        {selectedCategory && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                📂 {selectedCategory} 카테고리 프롬프트 결과
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCategoryResults([]);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
              >
                <span className="text-lg">×</span>
                닫기
              </button>
            </div>
            {categoryResults.length > 0 ? (
              <div className="grid gap-4">
                {categoryResults.map((result) => (
                  <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handlePromptClick(result)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {result.prompt_title}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          result.prompt_category
                        )}`}
                      >
                        {result.prompt_category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          result.prompt_difficulty
                        )}`}
                      >
                        {result.prompt_difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {result.ai_result.substring(0, 150)}...
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1">
                      자세히 보기 →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-8">
                <p>
                  아직 {selectedCategory} 카테고리의 프롬프트 결과가 없습니다.
                </p>
                <p className="text-sm mt-2">
                  매일 오전 9시에 자동으로 생성됩니다.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 최근 프롬프트 결과들 */}
        {!selectedCategory && !loadingResults && recentResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              📚 최근 프롬프트 결과
            </h3>
            <div className="grid gap-4">
              {recentResults.slice(0, 5).map((result) => (
                <div
                  key={result.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePromptClick(result)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {result.prompt_title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(result.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        result.prompt_category
                      )}`}
                    >
                      {result.prompt_category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        result.prompt_difficulty
                      )}`}
                    >
                      {result.prompt_difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {result.ai_result.substring(0, 150)}...
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1">
                    자세히 보기 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 프롬프트 카테고리 목록 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            📂 프롬프트 카테고리
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from(new Set(promptTemplates.map((p) => p.category))).map(
              (category) => (
                <div
                  key={category}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getCategoryColor(
                      category
                    )}`}
                  >
                    {category}
                  </div>
                  <p className="text-sm text-gray-600">
                    {categoryCounts[category] || 0}개의 프롬프트
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 프롬프트 상세 모달 */}
      <PromptDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPromptResult(null);
        }}
        promptResult={selectedPromptResult}
      />
    </div>
  );
}
