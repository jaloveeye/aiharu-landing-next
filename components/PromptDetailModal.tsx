import { useState } from "react";
import { PromptResult } from "@/app/utils/promptResults";
import { Title, Body } from "@/components/ui/Typography";

interface PromptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptResult: PromptResult | null;
}

export default function PromptDetailModal({
  isOpen,
  onClose,
  promptResult,
}: PromptDetailModalProps) {
  if (!isOpen || !promptResult) return null;

  const getCategoryColor = (category: string) => {
    const colors = {
      코드리뷰: "bg-blue-100 text-blue-800",
      디버깅: "bg-red-100 text-red-800",
      아키텍처: "bg-purple-100 text-purple-800",
      성능최적화: "bg-green-100 text-green-800",
      보안: "bg-orange-100 text-orange-800",
      테스트: "bg-indigo-100 text-indigo-800",
      문서화: "bg-gray-100 text-gray-800",
      리팩토링: "bg-pink-100 text-pink-800",
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex-1">
            <Title className="text-xl mb-3 text-gray-800">
              {promptResult.prompt_title}
            </Title>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getCategoryColor(
                  promptResult.prompt_category
                )}`}
              >
                {promptResult.prompt_category}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getDifficultyColor(
                  promptResult.prompt_difficulty
                )}`}
              >
                {promptResult.prompt_difficulty}
              </span>
              <span className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                📅{" "}
                {new Date(promptResult.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 ml-4 text-white font-bold text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] pb-12 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* 원본 프롬프트 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">원본 프롬프트</h3>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
              <Body className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {promptResult.prompt_content}
              </Body>
            </div>
          </div>

          {/* AI 답변 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">AI 답변</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
              <Body className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {promptResult.ai_result}
              </Body>
            </div>
          </div>

          {/* 메타데이터 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">메타데이터</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">AI 모델</div>
                <div className="font-semibold text-gray-800">
                  {promptResult.ai_model}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">토큰 사용량</div>
                <div className="font-semibold text-gray-800">
                  {(promptResult.tokens_used || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">생성일</div>
                <div className="font-semibold text-gray-800">
                  {new Date(promptResult.created_at).toLocaleString("ko-KR")}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">태그</div>
                <div className="flex flex-wrap gap-1">
                  {promptResult.prompt_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
