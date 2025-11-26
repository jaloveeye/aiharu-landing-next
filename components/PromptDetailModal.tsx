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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="max-w-5xl w-full max-h-[90vh] overflow-hidden border" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-8 border-b" style={{ 
          borderColor: 'var(--color-outline)',
          backgroundColor: 'var(--color-surface)'
        }}>
          <div className="flex-1">
            <Title className="text-xl mb-3" style={{ color: 'var(--color-on-background)' }}>
              {promptResult.prompt_title}
            </Title>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#000000',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                {promptResult.prompt_category}
              </span>
              <span
                className="px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  borderRadius: 'var(--border-radius-medium)',
                  border: '1px solid var(--color-outline)'
                }}
              >
                {promptResult.prompt_difficulty}
              </span>
              <span className="text-sm px-3 py-2 border" style={{ 
                color: 'var(--color-on-surface-variant)', 
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                {new Date(promptResult.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 transition-all duration-200 ml-4 font-bold text-2xl cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-on-surface)',
              borderRadius: 'var(--border-radius-medium)',
              border: '1px solid var(--color-outline)'
            }}
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] pb-12" style={{ backgroundColor: 'var(--color-background)' }}>
          {/* 원본 프롬프트 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-on-background)' }}>원본 프롬프트</h3>
            </div>
            <div className="p-6 border" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-outline)',
              borderRadius: 'var(--border-radius-medium)'
            }}>
              <Body className="whitespace-pre-wrap leading-relaxed text-left" style={{ color: 'var(--color-on-surface-variant)' }}>
                {promptResult.prompt_content}
              </Body>
            </div>
          </div>

          {/* 맥락 정보 (최근 관련 프롬프트) */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-on-background)' }}>맥락 정보</h3>
            </div>
            <div className="p-6 border" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-outline)',
              borderRadius: 'var(--border-radius-medium)'
            }}>
              <div className="leading-relaxed text-left">
                <div className="text-sm mb-3" style={{ color: 'var(--color-primary)' }}>
                  이 프롬프트는 최근 생성된 {promptResult.prompt_category}{" "}
                  관련 프롬프트들과의 맥락을 고려하여 생성되었습니다.
                </div>
                <div className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  AI가 이전 프롬프트 결과들을 참고하여 중복을 피하고 자연스럽게
                  연결되는 새로운 관점과 해결책을 제시했습니다.
                </div>
              </div>
            </div>
          </div>

          {/* AI 답변 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-on-background)' }}>AI 답변</h3>
            </div>
            <div className="p-6 border" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-outline)',
              borderRadius: 'var(--border-radius-medium)'
            }}>
              <Body className="whitespace-pre-wrap leading-relaxed text-left" style={{ color: 'var(--color-on-background)' }}>
                {promptResult.ai_result}
              </Body>
            </div>
          </div>

          {/* 품질 분석 결과: 종합 점수와 등급만 표시 */}
          {promptResult.quality_metrics && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-on-background)' }}>
                  품질 분석 결과
                </h3>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                    {Math.round(promptResult.quality_metrics.overall_score)}점
                  </div>
                  {promptResult.quality_grade && (
                    <div
                      className="text-lg font-semibold px-4 py-2 inline-block"
                      style={{
                        backgroundColor: promptResult.quality_grade.startsWith("A")
                          ? 'var(--color-primary)'
                          : 'var(--color-surface)',
                        color: promptResult.quality_grade.startsWith("A") ? '#000000' : 'var(--color-on-surface)',
                        borderRadius: 'var(--border-radius-medium)',
                        border: promptResult.quality_grade.startsWith("A") ? 'none' : '1px solid var(--color-outline)'
                      }}
                    >
                      {promptResult.quality_grade}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 메타데이터 */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-outline)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-on-background)' }}>메타데이터</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="text-sm mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>AI 모델</div>
                <div className="font-semibold" style={{ color: 'var(--color-on-background)' }}>
                  {promptResult.ai_model}
                </div>
              </div>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="text-sm mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>토큰 사용량</div>
                <div className="font-semibold" style={{ color: 'var(--color-on-background)' }}>
                  {(promptResult.tokens_used || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="text-sm mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>생성일</div>
                <div className="font-semibold" style={{ color: 'var(--color-on-background)' }}>
                  {new Date(promptResult.created_at).toLocaleString("ko-KR")}
                </div>
              </div>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="text-sm mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>태그</div>
                <div className="flex flex-wrap gap-1">
                  {promptResult.prompt_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-on-surface)',
                        borderRadius: 'var(--border-radius-small)',
                        border: '1px solid var(--color-outline)'
                      }}
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
