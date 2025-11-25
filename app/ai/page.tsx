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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/10 to-purple-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Link
          href="/"
          className="self-start mb-8 inline-flex items-center px-4 py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
        >
          홈으로 돌아가기
        </Link>

        <main className="flex flex-col items-center gap-16 max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center animate-fade-in-scale">
            <div className="text-8xl mb-8 animate-float">🤖</div>
            <Title className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 text-6xl md:text-7xl">
              AI하루
            </Title>
            <Body className="text-xl text-slate-700 max-w-3xl leading-relaxed">
              최신 AI 뉴스와 지식을 한곳에서,
              <br />
              <span className="font-semibold text-slate-800">AI와 함께하는 똑똑한 하루</span>를 만들어가요.
            </Body>
          </div>

          {/* Features Grid */}
          <div
            className="animate-fade-in-up w-full"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
              {/* AI 뉴스 */}
              <Link 
                href="/ai/daily"
                className="group relative bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📰</div>
                  <h3 className="font-bold text-xl text-slate-800 mb-4">AI 뉴스</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    최신 AI 관련 뉴스를 자동으로 수집하고
                    <br />
                    <span className="font-medium">AI가 요약해드립니다</span>
                  </p>
                  <div className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    클릭하여 보기
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* 프롬프트 */}
              <Link 
                href="/ai/prompts"
                className="group relative bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">💡</div>
                  <h3 className="font-bold text-xl text-slate-800 mb-4">프롬프트</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    실용적인 AI 프롬프트 예제와
                    <br />
                    <span className="font-medium">활용 팁을 제공합니다</span>
                  </p>
                  <div className="text-purple-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    클릭하여 보기
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* 프롬프트 품질 측정 방식 */}
              <Link 
                href="/ai/prompt-quality/about"
                className="group relative bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
                  <h3 className="font-bold text-xl text-slate-800 mb-4">품질 측정 방식</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    AI 프롬프트의 품질을 측정하는
                    <br />
                    <span className="font-medium">과학적 방법론을 설명합니다</span>
                  </p>
                  <div className="text-emerald-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    자세히 알아보기
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-white/60 backdrop-blur-lg border border-slate-200/40 rounded-2xl p-6 shadow-sm">
              <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                위의 카드를 클릭하여 각 기능을 탐색해보세요. 
                <br />
                <span className="font-medium text-slate-700">AI 뉴스와 프롬프트는 실시간으로 업데이트</span>되며, 
                <br />
                <span className="font-medium text-slate-700">품질 측정 방식</span>으로 더 나은 프롬프트를 작성할 수 있습니다.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
