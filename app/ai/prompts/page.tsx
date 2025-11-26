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

  // 품질 분석 관련 상태 제거됨

  // 결과 로드 함수
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

      if (today) {
        setAiResult(today.ai_result);
      }
    } catch (error) {
      console.error("Error loading results:", error);
    }
  };

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

        // 품질 분석이 필요한 프롬프트 개수 확인
        // checkPendingAnalysisCount(); // 이 함수는 제거되었으므로 주석 처리
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

  // 개별 프롬프트 품질 분석
  const handleAnalyzeIndividualPrompt = async (promptResult: PromptResult) => {
    if (
      !confirm(
        `"${promptResult.prompt_title}" 프롬프트에 대해 품질 분석을 수행하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/analyze-prompt-quality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptContent: promptResult.prompt_content,
          aiResult: promptResult.ai_result,
          category: promptResult.prompt_category,
          tokensUsed:
            promptResult.tokens_used ||
            Math.ceil((promptResult.ai_result.length * 1.3) / 4),
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // 데이터베이스 업데이트
        const updateResponse = await fetch(`/api/update-prompt-quality`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promptId: promptResult.id,
            qualityMetrics: result.quality_metrics,
            qualityGrade: result.quality_grade,
            qualitySuggestions: result.quality_suggestions,
          }),
        });

        if (updateResponse.ok) {
          alert("품질 분석이 완료되었습니다!");
          // 결과 다시 로드
          await loadResults();
          // checkPendingAnalysisCount(); // 이 함수는 제거되었으므로 주석 처리
        } else {
          alert("품질 분석은 완료되었지만 저장에 실패했습니다.");
        }
      } else {
        alert("품질 분석에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error analyzing individual prompt:", error);
      alert("품질 분석 중 오류가 발생했습니다.");
    }
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">

        <div className="text-center mb-16">
          <Title className="mb-6" style={{ color: 'var(--color-on-background)' }}>매일의 AI 프롬프트</Title>
          <div className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
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

          {/* 벡터 기반 맥락 인식 시스템 소개 */}
          <div className="mt-8 p-6 border" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-background)' }}>
                AI 지능의 진화
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                  <span className="font-bold">1</span>
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--color-on-background)' }}>맥락 기억</p>
                <p style={{ color: 'var(--color-on-surface-variant)' }}>
                  이전 대화를 기억하고 연속성 유지
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                  <span className="font-bold">2</span>
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--color-on-background)' }}>벡터 검색</p>
                <p style={{ color: 'var(--color-on-surface-variant)' }}>
                  OpenAI + pgvector로 정확한 유사도 매칭
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                  <span className="font-bold">3</span>
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--color-on-background)' }}>체계적 학습</p>
                <p style={{ color: 'var(--color-on-surface-variant)' }}>중복 없는 체계적인 지식 구조화</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-medium" style={{ color: 'var(--color-primary)' }}>
                이제 AI는 단순한 질문 생성기가 아닌,{" "}
                <strong style={{ color: 'var(--color-on-background)' }}>지능적인 학습 동반자</strong>입니다!
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 프롬프트가 없을 때 안내 메시지 */}
        {!todayResult && !selectedCategory && (
          <div className="border p-8 mb-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
              <p className="text-lg mb-2">
                오늘의 프롬프트가 아직 생성되지 않았습니다.
              </p>
              <p className="text-sm">매일 오전 9시에 자동으로 생성됩니다.</p>
            </div>
          </div>
        )}

        {/* 카테고리별 프롬프트 결과들 */}
        {selectedCategory && (
          <div className="border p-8 mb-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-background)' }}>
                {selectedCategory} 카테고리 프롬프트 결과
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCategoryResults([]);
                }}
                className="px-4 py-2 font-medium text-sm flex items-center gap-2 transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  borderRadius: 'var(--border-radius-medium)',
                  border: '1px solid var(--color-outline)'
                }}
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
                    className="border p-4 transition-shadow hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-outline)',
                      borderRadius: 'var(--border-radius-medium)'
                    }}
                    onClick={() => handlePromptClick(result)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold" style={{ color: 'var(--color-on-background)' }}>
                        {result.prompt_title}
                      </h4>
                      <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {new Date(result.created_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#000000',
                          borderRadius: 'var(--border-radius-medium)'
                        }}
                      >
                        {result.prompt_category}
                      </span>
                      <span
                        className="px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-on-surface)',
                          borderRadius: 'var(--border-radius-medium)',
                          border: '1px solid var(--color-outline)'
                        }}
                      >
                        {result.prompt_difficulty}
                      </span>
                      {/* 품질 점수 표시 */}
                      {result.quality_metrics && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>품질:</div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                            {Math.round(result.quality_metrics.overall_score)}점
                          </div>
                          {result.quality_grade && (
                            <div
                              className="text-xs px-2 py-1"
                              style={{
                                backgroundColor: result.quality_grade.startsWith("A")
                                  ? 'var(--color-primary)'
                                  : 'var(--color-surface)',
                                color: result.quality_grade.startsWith("A") ? '#000000' : 'var(--color-on-surface)',
                                borderRadius: 'var(--border-radius-medium)',
                                border: result.quality_grade.startsWith("A") ? 'none' : '1px solid var(--color-outline)'
                              }}
                            >
                              {result.quality_grade}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {result.ai_result.substring(0, 150)}...
                    </p>
                    <button className="text-sm font-medium px-3 py-1" style={{ color: '#000000' }}>
                      자세히 보기 →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: 'var(--color-on-surface-variant)' }}>
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
          <div className="border p-8 mb-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-background)' }}>
                최근 프롬프트 결과
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium" style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#000000',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  맥락 인식
                </span>
                <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  AI가 이전 결과를 참고하여 연속성 있는 질문 생성
                </span>
              </div>
            </div>
            <div className="grid gap-4">
              {recentResults.slice(0, 5).map((result) => (
                <div
                  key={result.id}
                  className="border p-4 transition-shadow hover:shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}
                  onClick={() => handlePromptClick(result)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold" style={{ color: 'var(--color-on-background)' }}>
                      {result.prompt_title}
                    </h4>
                    <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {new Date(result.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: '#000000',
                        borderRadius: 'var(--border-radius-medium)'
                      }}
                    >
                      {result.prompt_category}
                    </span>
                    <span
                      className="px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-on-surface)',
                        borderRadius: 'var(--border-radius-medium)',
                        border: '1px solid var(--color-outline)'
                      }}
                    >
                      {result.prompt_difficulty}
                    </span>
                  </div>

                  {/* 품질 점수 표시 */}
                  {result.quality_metrics && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>품질:</div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                        {Math.round(result.quality_metrics.overall_score)}점
                      </div>
                      {result.quality_grade && (
                        <div
                          className="text-xs px-2 py-1"
                          style={{
                            backgroundColor: result.quality_grade.startsWith("A")
                              ? 'var(--color-primary)'
                              : 'var(--color-surface)',
                            color: result.quality_grade.startsWith("A") ? '#000000' : 'var(--color-on-surface)',
                            borderRadius: 'var(--border-radius-medium)',
                            border: result.quality_grade.startsWith("A") ? 'none' : '1px solid var(--color-outline)'
                          }}
                        >
                          {result.quality_grade}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {result.ai_result.substring(0, 150)}...
                  </p>
                  <button className="text-sm font-medium px-3 py-1" style={{ color: '#000000' }}>
                    자세히 보기 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 프롬프트 카테고리 목록 */}
        <div className="border p-8" style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-outline)',
          borderRadius: 'var(--border-radius-medium)'
        }}>
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
            프롬프트 카테고리
          </h3>

          {/* 기술 스택 표시 */}
          <div className="mb-6 p-4 border" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold" style={{ color: 'var(--color-on-background)' }}>
                Powered by Advanced AI Technology
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {['OpenAI GPT-3.5-turbo', 'OpenAI Embedding API', 'Supabase pgvector', 'Cosine Similarity', 'Context Awareness'].map((tech) => (
                <span key={tech} className="px-2 py-1" style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#000000',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from(new Set(promptTemplates.map((p) => p.category))).map(
              (category) => (
                <div
                  key={category}
                  className="p-4 border transition-shadow hover:shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div
                    className="inline-block px-3 py-1 text-sm font-medium mb-2"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: '#000000',
                      borderRadius: 'var(--border-radius-medium)'
                    }}
                  >
                    {category}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {categoryCounts[category] || 0}개의 프롬프트
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* 맥락 인식 시스템 작동 원리 설명 */}
        <div className="border p-8 mt-8" style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-outline)',
          borderRadius: 'var(--border-radius-medium)'
        }}>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-on-background)' }}>
              맥락 인식 시스템 작동 원리
            </h3>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>
              AI가 어떻게 이전 대화를 기억하고 연속성 있는 질문을 생성하는지
              알아보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 왼쪽: 작동 과정 */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-on-background)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                작동 과정
              </h4>
              <div className="space-y-4">
                {[
                  { num: 1, title: '프롬프트 생성', desc: 'AI가 새로운 질문과 답변을 생성' },
                  { num: 2, title: '벡터 변환', desc: 'OpenAI Embedding API로 1536차원 벡터 생성' },
                  { num: 3, title: '벡터 저장', desc: 'Supabase pgvector에 벡터 데이터 저장' },
                  { num: 4, title: '맥락 검색', desc: '코사인 유사도로 관련 프롬프트 검색' },
                  { num: 5, title: '연속성 생성', desc: '이전 맥락을 참고한 새로운 질문 생성' }
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                      {item.num}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-on-background)' }}>{item.title}</p>
                      <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 실제 예시 */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-on-background)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                실제 예시
              </h4>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="space-y-3">
                  {[
                    { day: '1일차', text: '"아이 감정 통제 문제"' },
                    { day: '2일차 (맥락 인식)', text: '"감정 통제 후 사회성 발달 방법"' },
                    { day: '3일차 (맥락 인식)', text: '"사회성 발달을 위한 놀이 방법"' }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="p-3 border" style={{ 
                        backgroundColor: 'var(--color-background)', 
                        borderColor: 'var(--color-outline)',
                        borderRadius: 'var(--border-radius-medium)'
                      }}>
                        <p className="text-xs mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>{item.day}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-on-background)' }}>{item.text}</p>
                      </div>
                      {idx < 2 && (
                        <div className="flex justify-center my-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                    체계적이고 연속성 있는 학습 경험 제공
                  </p>
                </div>
              </div>
            </div>
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
