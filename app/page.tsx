import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";

export const metadata: Metadata = {
  ...commonMetadata,
  title:
    "aiharu 아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
  description:
    "aiharu(아이하루)는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관 관리), AI하루(지식 학습) 등 다양한 서비스로 매일의 성장을 지원합니다.",
  keywords:
    "aiharu, 아이하루, AI하루, 하루, 습관, AI, 인공지능, 성장, 피드백, 프롬프트, GPT, LLM, 부모, 자녀, 대시보드, 서비스 소개, 식단 분석, 영양 관리",
  openGraph: {
    ...commonMetadata.openGraph,
    title:
      "aiharu 아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
    description:
      "aiharu(아이하루)는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관 관리), AI하루(지식 학습) 등 다양한 서비스로 매일의 성장을 지원합니다.",
    url: "https://aiharu.net/",
  },
  alternates: {
    canonical: "https://aiharu.net/",
  },
};

/**
 * 서비스 랜딩(홈) 페이지
 */
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "aiharu 아이하루",
    alternateName: "아이하루",
    url: "https://aiharu.net",
    description:
      "aiharu(아이하루)는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://aiharu.net/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: ["https://hanip.aiharu.net"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <main className="flex flex-col items-center gap-8 max-w-4xl">
          <Image
            src="/happy-family.png"
            alt="행복한 가족 일러스트"
            width={400}
            height={280}
            className="mb-4 rounded-xl shadow-lg"
            priority
            aria-label="행복한 가족 일러스트"
          />
          <Title className="text-center">
            오늘 하루를
            <br />
            <span className="text-green-500">더 똑똑하고</span>{" "}
            <span className="text-yellow-500">따뜻하게</span>
          </Title>
          <div className="flex flex-col gap-2 text-center max-w-2xl">
            <Body className="font-medium text-lg">
              AI하루는 매일 하나의{" "}
              <span className="text-green-500 font-semibold">AI</span>를
              배웁니다.
            </Body>
            <Body className="font-medium text-lg">
              아이하루는 매일 하나의{" "}
              <span className="text-yellow-500 font-semibold">습관</span>을
              만듭니다.
            </Body>
          </div>
          <Body className="text-center text-gray-700 max-w-2xl">
            <span className="font-semibold text-green-500">AI</span>와{" "}
            <span className="font-semibold text-yellow-500">아이</span>의 하루를
            모두 담아,
            <br />
            기술과 감성이 어우러진 특별한 일상을 선물합니다.
          </Body>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              as="a"
              href="https://hanip.aiharu.net"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              aria-label="아이하루 가기"
              className="text-lg px-8 py-4"
            >
              아이하루 가기
            </Button>
            <Button
              as="a"
              href="/ai"
              variant="primary"
              aria-label="AI하루 가기"
              className="text-lg px-8 py-4"
            >
              AI하루 가기
            </Button>
          </div>
        </main>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            aiharu의 특별한 기능들
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">AI하루</h3>
              <p className="text-green-600">
                매일 하나씩 AI 지식을 배우고, 프롬프트 활용법을 익혀봐요.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-yellow-700 mb-2">
                아이하루
              </h3>
              <p className="text-yellow-600">
                부모와 아이가 함께 목표를 세우고 습관을 만들어가요.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                식단 분석
              </h3>
              <p className="text-blue-600">
                AI가 분석하는 맞춤형 영양 정보와 건강한 식단 추천.
              </p>
            </div>
          </div>
        </div>
      </section>

                {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-yellow-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                지금 시작해보세요
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                aiharu와 함께 더 똑똑하고 따뜻한 하루를 만들어가요. 
                헤더에서 로그인하거나 회원가입하여 모든 기능을 체험해보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as="a"
                  href="/about"
                  variant="primary"
                  className="text-lg px-8 py-4"
                >
                  서비스 소개 보기
                </Button>
                <Button
                  as="a"
                  href="/creator"
                  variant="secondary"
                  className="text-lg px-8 py-4"
                >
                  제작자 소개
                </Button>
              </div>
            </div>
          </section>
      <div className="w-full max-w-xl mx-auto mt-16 mb-4">
        <hr className="border-t border-gray-200 mb-4" />
        <footer className="flex flex-col items-center gap-2 text-gray-700 text-sm">
          <span>
            Made with <span className="text-red-400">❤️</span> by aiharu
          </span>
          <div className="flex gap-3 mt-1">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-green-500 transition-colors"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm6.5 1a1 1 0 100 2 1 1 0 000-2z"
                />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-yellow-500 transition-colors"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.46 6c-.79.35-1.64.59-2.53.7a4.48 4.48 0 001.97-2.48 8.94 8.94 0 01-2.83 1.08A4.48 4.48 0 0016.11 4c-2.48 0-4.5 2.02-4.5 4.5 0 .35.04.7.11 1.03C7.69 9.4 4.07 7.67 1.64 5.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65-.72-.02-1.4-.22-1.99-.55v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.82-.08.55 1.72 2.16 2.97 4.07 3a9.02 9.02 0 01-5.59 1.93c-.36 0-.71-.02-1.06-.06A12.77 12.77 0 007.29 21c8.29 0 12.83-6.87 12.83-12.83 0-.2 0-.41-.01-.61A9.22 9.22 0 0024 4.59a8.93 8.93 0 01-2.54.7z"
                />
              </svg>
            </a>
          </div>
          <div className="mt-2">
            <a
              href="/privacy"
              className="text-gray-500 hover:text-gray-700 transition-colors text-xs"
            >
              개인정보 취급방침
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
