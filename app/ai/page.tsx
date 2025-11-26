import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { commonMetadata } from "@/app/metadata/common";

export const metadata = {
  ...commonMetadata,
  title: "AI하루 - 최신 AI 뉴스와 지식 | aiharu.net",
  description:
    "AI하루는 최신 AI 뉴스, 프롬프트 예제, AI 도구 추천, 일상 활용 팁 등 AI 관련 모든 정보를 한곳에서 제공합니다.",
  keywords:
    "AI, 인공지능, AI뉴스, 프롬프트, 도구 추천, GPT, LLM, ai하루, 아이하루, 머신러닝",
  openGraph: {
    ...commonMetadata.openGraph,
    title: "AI하루 - 최신 AI 뉴스와 지식 | aiharu.net",
    description:
      "AI하루는 최신 AI 뉴스, 프롬프트 예제, AI 도구 추천, 일상 활용 팁 등 AI 관련 모든 정보를 한곳에서 제공합니다.",
    url: "https://aiharu.net/ai",
    images: [
      {
        url: "/og-aiharu.png",
        width: 1200,
        height: 630,
        alt: "AI하루 - aiharu.net",
      },
    ],
  },
};

/**
 * AI하루 메인 페이지
 */
export default function AiPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <main className="flex flex-col items-center gap-16">
          {/* Hero Section */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-8 mx-auto" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <Title className="mb-8 text-5xl md:text-6xl" style={{ color: 'var(--color-on-background)' }}>
              AI하루
            </Title>
            <Body className="text-xl max-w-3xl leading-relaxed" style={{ color: 'var(--color-on-background)' }}>
              최신 AI 뉴스와 지식을 한곳에서,
              <br />
              <span className="font-semibold">AI와 함께하는 똑똑한 하루</span>를 만들어가요.
            </Body>
          </div>

          {/* Features Grid */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI 뉴스 */}
              <Link 
                href="/ai/daily"
                className="group p-8 border transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: 'var(--color-background)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--color-on-background)' }}>AI 뉴스</h3>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
                  최신 AI 관련 뉴스를 자동으로 수집하고
                  <br />
                  <span className="font-medium">AI가 요약해드립니다</span>
                </p>
                <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                  클릭하여 보기
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* 프롬프트 */}
              <Link 
                href="/ai/prompts"
                className="group p-8 border transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: 'var(--color-background)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--color-on-background)' }}>프롬프트</h3>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
                  실용적인 AI 프롬프트 예제와
                  <br />
                  <span className="font-medium">활용 팁을 제공합니다</span>
                </p>
                <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                  클릭하여 보기
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* 프롬프트 품질 측정 방식 */}
              <Link 
                href="/ai/prompt-quality/about"
                className="group p-8 border transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: 'var(--color-background)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--color-on-background)' }}>품질 측정 방식</h3>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
                  AI 프롬프트의 품질을 측정하는
                  <br />
                  <span className="font-medium">과학적 방법론을 설명합니다</span>
                </p>
                <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                  자세히 알아보기
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center w-full">
            <div className="p-6 border" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-outline)',
              borderRadius: 'var(--border-radius-medium)'
            }}>
              <p className="text-sm max-w-2xl leading-relaxed mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
                위의 카드를 클릭하여 각 기능을 탐색해보세요. 
                <br />
                <span className="font-medium">AI 뉴스와 프롬프트는 실시간으로 업데이트</span>되며, 
                <br />
                <span className="font-medium">품질 측정 방식</span>으로 더 나은 프롬프트를 작성할 수 있습니다.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
