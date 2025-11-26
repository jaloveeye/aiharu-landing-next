"use client";
import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";

export default function PromptQualityAboutPage() {
  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Title className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
            프롬프트 품질 측정 방식
          </Title>
          <p className="text-lg text-center max-w-4xl" style={{ color: 'var(--color-on-surface-variant)' }}>
            AI 프롬프트의 품질을 어떻게 측정하고 평가하는지 자세히 알아보세요
          </p>
        </div>

        {/* 개요 */}
        <div className="border p-8 mb-8" style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-outline)',
          borderRadius: 'var(--border-radius-medium)'
        }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
            품질 측정 개요
          </h2>
          <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            <p>
              프롬프트 품질 분석 시스템은 <strong style={{ color: 'var(--color-on-background)' }}>4가지 핵심 차원</strong>에서
              프롬프트의 품질을 종합적으로 평가합니다. 각 차원은 0-100점으로
              측정되며, 최종적으로 종합 점수와 등급을 제공합니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                  답변 품질 (60%)
                </h3>
                <ul className="text-sm space-y-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <li>• 구조화 점수 (20%)</li>
                  <li>• 전문성 점수 (20%)</li>
                  <li>• 맥락 연관성 점수 (15%)</li>
                  <li>• 실용성 점수 (15%)</li>
                </ul>
              </div>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                  질문 품질 (40%)
                </h3>
                <ul className="text-sm space-y-1" style={{ color: 'var(--color-on-surface-variant)' }}>
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
          <div className="border p-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-on-background)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              구조화 점수 (Structure Score)
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              <p>
                답변이 얼마나 체계적이고 이해하기 쉽게 구성되었는지를
                평가합니다.
              </p>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: 'var(--color-primary)' }}>35점</span>
                    <span>
                      단계별 가이드 감지 (1단계, 2단계, 첫째, 둘째 등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: 'var(--color-primary)' }}>25점</span>
                    <span>
                      번호 매기기 또는 글머리 기호 (•, -, *, ▶, →, ✓ 등)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: 'var(--color-primary)' }}>20점</span>
                    <span>구체적 방법 제시 ("~하는 방법", "~의 과정" 등)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: 'var(--color-primary)' }}>10점</span>
                    <span>주의사항 포함 ("주의할 점", "주의해야 할" 등)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold" style={{ color: 'var(--color-primary)' }}>10점</span>
                    <span>
                      대안/추가 고려사항 ("또는", "대신에", "추가로" 등)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 전문성 점수 */}
          <div className="border p-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-on-background)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              전문성 점수 (Expertise Score)
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              <p>
                답변이 해당 분야의 전문 지식과 용어를 얼마나 잘 활용했는지를
                평가합니다.
              </p>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  {[
                    { score: '최대 50점', desc: '카테고리별 전문 키워드 매칭 (키워드 수에 비례)' },
                    { score: '20점', desc: '전문적 표현 ("전략", "방법론", "프로세스", "프레임워크" 등)' },
                    { score: '20점', desc: '구체적 수치나 단위 ("80%", "3단계", "2시간", "5가지" 등)' },
                    { score: '20점', desc: '연구/트렌드 언급 ("연구", "트렌드", "최신", "동향", "사례" 등)' },
                    { score: '25점', desc: '육아 카테고리 전문 표현 보너스' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{item.score}</span>
                      <span>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 맥락 연관성 점수 */}
          <div className="border p-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-on-background)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              맥락 연관성 점수 (Context Score)
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              <p>
                질문과 답변이 얼마나 잘 연결되고 관련성이 높은지를 평가합니다.
              </p>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  {[
                    { score: '최대 60점', desc: '질문-답변 키워드 매칭 (공통 키워드 수에 비례)' },
                    { score: '25점', desc: '구체적 요구사항 대응 ("어떻게" → "단계", "방법", "가이드" 등)' },
                    { score: '15점', desc: '주제 일치성 ("감정", "통제", "화", "짜증" 등)' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{item.score}</span>
                      <span>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 실용성 점수 */}
          <div className="border p-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-on-background)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              실용성 점수 (Practicality Score)
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              <p>답변이 얼마나 실제로 실행 가능하고 실용적인지를 평가합니다.</p>
              <div className="p-4 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>평가 기준</h4>
                <ul className="space-y-2 text-sm">
                  {[
                    { score: '45점', desc: '구체적 실행 방법 제시 ("~하는 방법", "~의 과정" 등)' },
                    { score: '40점', desc: '단계별 가이드 제공 (1단계, 2단계, 첫째, 둘째 등)' },
                    { score: '15점', desc: '주의사항 및 대안 제시' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{item.score}</span>
                      <span>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 종합 점수 계산 */}
          <div className="border p-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-on-background)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              종합 점수 계산 방식
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              <p>모든 개별 점수를 가중 평균하여 최종 종합 점수를 계산합니다.</p>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  가중 평균 공식
                </h4>
                <div className="font-mono text-sm p-4 border" style={{ 
                  backgroundColor: 'var(--color-background)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)',
                  color: 'var(--color-on-background)'
                }}>
                  종합 점수 = (구조화 × 0.20) + (전문성 × 0.20) + (맥락연관성 ×
                  0.15) + (실용성 × 0.15) + (질문명확성 × 0.15) + (질문전문성 ×
                  0.15) + (질문복잡성 × 0.10)
                </div>
                <p className="text-sm mt-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                  각 점수는 0-100 범위이며, 가중치의 합은 1.0입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 등급 시스템 */}
          <div className="border p-8" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-on-background)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              등급 시스템
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { grade: 'A+ (90-100점)', desc: '최고 품질의 프롬프트' },
                  { grade: 'A (80-89점)', desc: '높은 품질의 프롬프트' },
                  { grade: 'B+ (70-79점)', desc: '양호한 품질의 프롬프트' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 border-l-4" style={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderLeftColor: 'var(--color-primary)',
                    borderRadius: 'var(--border-radius-medium)',
                    borderColor: 'var(--color-outline)'
                  }}>
                    <h4 className="font-bold" style={{ color: 'var(--color-on-background)' }}>{item.grade}</h4>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { grade: 'B (60-69점)', desc: '보통 품질의 프롬프트' },
                  { grade: 'C+ (50-59점)', desc: '개선이 필요한 프롬프트' },
                  { grade: 'C (40-49점) / D (0-39점)', desc: '대폭 개선이 필요한 프롬프트' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 border-l-4" style={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderLeftColor: 'var(--color-primary)',
                    borderRadius: 'var(--border-radius-medium)',
                    borderColor: 'var(--color-outline)'
                  }}>
                    <h4 className="font-bold" style={{ color: 'var(--color-on-background)' }}>{item.grade}</h4>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="mt-12 text-center">
          <div className="border p-8" style={{ 
            backgroundColor: 'var(--color-primary)', 
            color: '#000000',
            borderRadius: 'var(--border-radius-medium)',
            borderColor: 'var(--color-outline)'
          }}>
            <h3 className="text-2xl font-bold mb-4">
              지금 프롬프트 품질을 분석해보세요!
            </h3>
            <p className="mb-6" style={{ opacity: 0.8 }}>
              이제 프롬프트 품질 측정 방식에 대해 이해했으니, 실제로
              분석해보세요.
            </p>
            <Link
              href="/ai/prompt-quality"
              className="inline-block px-6 py-3 font-semibold transition-colors"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderRadius: 'var(--border-radius-medium)'
              }}
            >
              품질 분석 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
