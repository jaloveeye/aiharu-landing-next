"use client";
import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";

export default function PromptQualityAboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/ai"
            className="text-blue-700 hover:underline flex items-center gap-1 text-sm mb-4"
          >
            ← AI하루로 돌아가기
          </Link>
          <Title className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4">
            프롬프트 품질 측정 방식
          </Title>
          <p className="text-gray-600 text-lg text-center max-w-4xl">
            AI 프롬프트의 품질을 어떻게 측정하고 평가하는지 자세히 알아보세요
          </p>
        </div>

        {/* 개요 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 품질 측정 개요
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              프롬프트 품질 분석 시스템은 <strong>4가지 핵심 차원</strong>에서
              프롬프트의 품질을 종합적으로 평가합니다. 각 차원은 0-100점으로
              측정되며, 최종적으로 종합 점수와 등급을 제공합니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  답변 품질 (60%)
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• 구조화 점수 (20%)</li>
                  <li>• 전문성 점수 (20%)</li>
                  <li>• 맥락 연관성 점수 (15%)</li>
                  <li>• 실용성 점수 (15%)</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  질문 품질 (40%)
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• 질문 명확성 점수 (15%)</li>
                  <li>• 질문 전문성 점수 (15%)</li>
                  <li>• 질문 복잡성 점수 (10%)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 메트릭 설명 */}
        <div className="space-y-8">
          {/* 구조화 점수 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🏗️</span>
              구조화 점수 (Structure Score)
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                답변이 얼마나 체계적이고 이해하기 쉽게 구성되었는지를
                평가합니다.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">35점</span>
                    <span>
                      단계별 가이드 감지 (1단계, 2단계, 첫째, 둘째 등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">25점</span>
                    <span>
                      번호 매기기 또는 글머리 기호 (•, -, *, ▶, →, ✓ 등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">20점</span>
                    <span>구체적 방법 제시 ("~하는 방법", "~의 과정" 등)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">10점</span>
                    <span>주의사항 포함 ("주의할 점", "주의해야 할" 등)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">10점</span>
                    <span>
                      대안/추가 고려사항 ("또는", "대신에", "추가로" 등)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 전문성 점수 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              전문성 점수 (Expertise Score)
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                답변이 해당 분야의 전문 지식과 용어를 얼마나 잘 활용했는지를
                평가합니다.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">최대 50점</span>
                    <span>카테고리별 전문 키워드 매칭 (키워드 수에 비례)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">20점</span>
                    <span>
                      전문적 표현 ("전략", "방법론", "프로세스", "프레임워크"
                      등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">20점</span>
                    <span>
                      구체적 수치나 단위 ("80%", "3단계", "2시간", "5가지" 등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">20점</span>
                    <span>
                      연구/트렌드 언급 ("연구", "트렌드", "최신", "동향", "사례"
                      등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">25점</span>
                    <span>육아 카테고리 전문 표현 보너스</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 맥락 연관성 점수 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🔗</span>
              맥락 연관성 점수 (Context Score)
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                질문과 답변이 얼마나 잘 연결되고 관련성이 높은지를 평가합니다.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">최대 60점</span>
                    <span>질문-답변 키워드 매칭 (공통 키워드 수에 비례)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">25점</span>
                    <span>
                      구체적 요구사항 대응 ("어떻게" → "단계", "방법", "가이드"
                      등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">15점</span>
                    <span>주제 일치성 ("감정", "통제", "화", "짜증" 등)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 실용성 점수 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              실용성 점수 (Practicality Score)
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>답변이 얼마나 실제로 실행 가능하고 실용적인지를 평가합니다.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">45점</span>
                    <span>
                      구체적 실행 방법 제시 ("~하는 방법", "~의 과정" 등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">40점</span>
                    <span>
                      단계별 가이드 제공 (1단계, 2단계, 첫째, 둘째 등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">15점</span>
                    <span>주의사항 및 대안 제시</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 종합 점수 계산 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🧮</span>
              종합 점수 계산 방식
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>모든 개별 점수를 가중 평균하여 최종 종합 점수를 계산합니다.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">
                  가중 평균 공식
                </h4>
                <div className="font-mono text-sm bg-white p-4 rounded border">
                  종합 점수 = (구조화 × 0.20) + (전문성 × 0.20) + (맥락연관성 ×
                  0.15) + (실용성 × 0.15) + (질문명확성 × 0.15) + (질문전문성 ×
                  0.15) + (질문복잡성 × 0.10)
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  각 점수는 0-100 범위이며, 가중치의 합은 1.0입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 등급 시스템 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              등급 시스템
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-green-800">A+ (90-100점)</h4>
                  <p className="text-sm text-green-700">최고 품질의 프롬프트</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-green-800">A (80-89점)</h4>
                  <p className="text-sm text-green-700">높은 품질의 프롬프트</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-bold text-yellow-800">B+ (70-79점)</h4>
                  <p className="text-sm text-yellow-700">
                    양호한 품질의 프롬프트
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-bold text-yellow-800">B (60-69점)</h4>
                  <p className="text-sm text-yellow-700">
                    보통 품질의 프롬프트
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-bold text-orange-800">C+ (50-59점)</h4>
                  <p className="text-sm text-orange-700">
                    개선이 필요한 프롬프트
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-bold text-red-800">
                    C (40-49점) / D (0-39점)
                  </h4>
                  <p className="text-sm text-red-700">
                    대폭 개선이 필요한 프롬프트
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              지금 프롬프트 품질을 분석해보세요!
            </h3>
            <p className="text-blue-100 mb-6">
              이제 프롬프트 품질 측정 방식에 대해 이해했으니, 실제로
              분석해보세요.
            </p>
            <Link
              href="/ai/prompt-quality"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              품질 분석 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
