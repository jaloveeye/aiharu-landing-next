import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Link
          href="/"
          className="self-start mb-8 text-neutral-600 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium animate-fade-in-up"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          홈으로 돌아가기
        </Link>

        <main className="flex flex-col items-center gap-12 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center animate-fade-in-scale">
            <div className="text-8xl mb-6 animate-float">🤖</div>
            <Title className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              AI하루
            </Title>
            <Body className="text-xl text-neutral-700 max-w-2xl leading-relaxed">
              최신 AI 뉴스와 지식을 한곳에서,
              <br />
              AI와 함께하는 똑똑한 하루를 만들어가요.
            </Body>
          </div>

          {/* Features Grid */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              {/* AI 뉴스 */}
              <div className="bg-white/80 backdrop-blur-lg border border-neutral-200/50 rounded-2xl p-6 shadow-soft text-center hover:shadow-strong transition-all">
                <div className="text-3xl mb-4">📰</div>
                <h3 className="font-bold text-lg text-neutral-800 mb-2">AI 뉴스</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  최신 AI 관련 뉴스를 자동으로 수집하고
                  <br />
                  AI가 요약해드립니다
                </p>
              </div>

              {/* 프롬프트 */}
              <div className="bg-white/80 backdrop-blur-lg border border-neutral-200/50 rounded-2xl p-6 shadow-soft text-center hover:shadow-strong transition-all">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="font-bold text-lg text-neutral-800 mb-2">프롬프트</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  실용적인 AI 프롬프트 예제와
                  <br />
                  활용 팁을 제공합니다
                </p>
              </div>

              {/* AI 도구 */}
              <div className="bg-white/80 backdrop-blur-lg border border-neutral-200/50 rounded-2xl p-6 shadow-soft text-center hover:shadow-strong transition-all">
                <div className="text-3xl mb-4">🛠️</div>
                <h3 className="font-bold text-lg text-neutral-800 mb-2">AI 도구</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  유용한 AI 도구와 서비스를
                  <br />
                  추천해드립니다
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              as="a"
              href="/ai/daily"
              variant="primary"
              size="lg"
              className="bg-primary-gradient shadow-strong hover-lift flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              AI 뉴스 보기
            </Button>
            <Button
              as="a"
              href="/ai/prompts"
              variant="outline"
              size="lg"
              className="border-2 border-neutral-300 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              프롬프트 모음
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
