import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { commonMetadata } from "@/app/metadata/common";

export const metadata = {
  ...commonMetadata,
  title: "AI하루 - 매일 하나, 쉽게 배우는 AI | aiharu.net",
  description:
    "AI하루는 매일 한 문장으로 배우는 AI 개념, 프롬프트 예제, 도구 추천, 일상 활용 팁 등 똑똑한 지식을 쉽게 제공합니다.",
  keywords: "AI, 인공지능, 하루, 프롬프트, 도구 추천, GPT, LLM, ai하루, aiharu",
  openGraph: {
    ...commonMetadata.openGraph,
    title: "AI하루 - 매일 하나, 쉽게 배우는 AI | aiharu.net",
    description:
      "AI하루는 매일 한 문장으로 배우는 AI 개념, 프롬프트 예제, 도구 추천, 일상 활용 팁 등 똑똑한 지식을 쉽게 제공합니다.",
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 py-20">
      <Link
        href="/"
        className="self-start mb-4 text-green-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 홈으로 돌아가기
      </Link>
      <main className="flex flex-col items-center gap-8">
        <Title>
          AI하루
          <br />
          <span className="text-lg font-normal text-green-800 block mt-2">
            AI와 함께하는 똑똑한 하루,
            <br />
            매일 새로운 지식과 습관을 만들어가요.
          </span>
        </Title>
        <Body className="bg-white border border-green-200 rounded-xl p-6 shadow max-w-lg text-center text-green-700">
          곧 AI 기반 식단 분석, 맞춤형 추천, 학습 리포트 등 다양한 기능이 제공될
          예정입니다.
          <br />
          <span className="font-semibold">조금만 기다려 주세요!</span>
        </Body>
        <div className="flex gap-4 mt-2">
          <Button as="a" href="/ai/daily" variant="primary">
            오늘의 ai하루 보기
          </Button>
          <Button
            as="a"
            href="/ai/prompts"
            variant="secondary"
            className="text-green-700 bg-white border border-green-400 hover:bg-green-50"
          >
            프롬프트 모음
          </Button>
        </div>
      </main>
    </div>
  );
}
