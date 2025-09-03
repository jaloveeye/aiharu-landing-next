"use client";
import { useState } from "react";
import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface QualityMetrics {
  structureScore: number;
  expertiseScore: number;
  contextScore: number;
  practicalityScore: number;
  questionClarityScore: number;
  questionExpertiseScore: number;
  questionComplexityScore: number;
  overallScore: number;
  details: {
    hasStepByStep: boolean;
    hasWarnings: boolean;
    hasAlternatives: boolean;
    hasConcreteMethods: boolean;
    tokenEfficiency: number;
    categoryKeywords: string[];
    questionHasSpecificity: boolean;
    questionHasComplexity: boolean;
    questionHasProfessionalTerms: boolean;
  };
}

interface AnalysisResult {
  success: boolean;
  quality_metrics: QualityMetrics;
  quality_grade: string;
  quality_suggestions: string[];
  analysis_summary: {
    overall_score: number;
    grade: string;
    strengths: string[];
    areas_for_improvement: string[];
    category_performance: {
      structure: string;
      expertise: string;
      context: string;
      practicality: string;
    };
  };
}

export default function PromptQualityPage() {
  const [promptContent, setPromptContent] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [category, setCategory] = useState("육아");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState("");

  const categories = [
    { id: "육아", name: "육아" },
    { id: "육아창업", name: "육아창업" },
    { id: "비즈니스마케팅", name: "비즈니스마케팅" },
    { id: "코드리뷰", name: "코드리뷰" },
    { id: "디버깅", name: "디버깅" },
    { id: "아키텍처", name: "아키텍처" },
    { id: "성능최적화", name: "성능최적화" },
    { id: "보안", name: "보안" },
    { id: "테스트", name: "테스트" },
  ];

  const handleAnalyze = async () => {
    if (!promptContent.trim() || !aiResult.trim()) {
      setError("프롬프트와 AI 답변을 모두 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-prompt-quality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptContent,
          aiResult,
          category,
          tokensUsed: Math.ceil((aiResult.length * 1.3) / 4), // 대략적인 토큰 수 추정
        }),
      });

      if (!response.ok) {
        throw new Error("분석 중 오류가 발생했습니다.");
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-yellow-600";
    if (grade.startsWith("C")) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 헤더 */}
        <div className="mb-12">
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200 mb-6 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-200">
              ←
            </span>
            AI 메인으로 돌아가기
          </Link>
          <div className="text-center">
            <Title className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              프롬프트 품질 분석
            </Title>
            <Body className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
              AI 프롬프트의 품질을 분석하고 개선 방안을 제시합니다
            </Body>
            <div className="flex justify-center">
              <Link
                href="/ai/prompt-quality/about"
                className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200 group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                  📚
                </span>
                품질 측정 방식 자세히 보기
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 입력 폼 */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">✍️</span>
              분석할 내용 입력
            </h2>

            {/* 카테고리 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 프롬프트 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                프롬프트 (질문)
              </label>
              <textarea
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                placeholder="분석할 프롬프트를 입력하세요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-36 resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* AI 답변 입력 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                AI 답변
              </label>
              <textarea
                value={aiResult}
                onChange={(e) => setAiResult(e.target.value)}
                placeholder="AI가 생성한 답변을 입력하세요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-44 resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* 분석 버튼 */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              variant="primary"
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-2xl hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  분석 중...
                </div>
              ) : (
                "품질 분석하기"
              )}
            </Button>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </div>
              </div>
            )}
          </div>

          {/* 분석 결과 */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              분석 결과
            </h2>

            {!analysisResult ? (
              <div className="text-center text-gray-500 py-16">
                <div className="text-6xl mb-6 animate-pulse">📊</div>
                <p className="text-lg mb-2">
                  왼쪽에 프롬프트와 AI 답변을 입력하고
                </p>
                <p className="text-lg">분석하기 버튼을 클릭하세요</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 종합 점수와 등급만 표시 */}
                <div className="text-center p-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-800 mb-3">
                    종합 점수
                  </div>
                  <div
                    className={`text-7xl font-extrabold ${getGradeColor(
                      analysisResult.quality_grade
                    )} mb-4 drop-shadow-lg`}
                  >
                    {analysisResult.analysis_summary.overall_score}
                  </div>
                  <div
                    className={`text-3xl font-semibold ${getGradeColor(
                      analysisResult.quality_grade
                    )} bg-white/70 px-6 py-2 rounded-2xl inline-block`}
                  >
                    {analysisResult.quality_grade}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-16">
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              프롬프트 품질 분석이란?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
              <div className="group hover:scale-105 transition-transform duration-200 text-left">
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    📝
                  </div>
                  <p className="text-lg leading-relaxed">
                    구조화, 전문성, 맥락 연관성, 실용성 등 4가지 차원에서
                    프롬프트의 품질을 평가합니다.
                  </p>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-200 text-left">
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    🎯
                  </div>
                  <p className="text-lg leading-relaxed">
                    질문과 답변 모두를 분석하여 종합적인 품질 점수를 제공합니다.
                  </p>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-200 text-left">
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    🚀
                  </div>
                  <p className="text-lg leading-relaxed">
                    구체적인 개선 방안을 제시하여 더 나은 프롬프트 작성에 도움을
                    줍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
