import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  ...commonMetadata,
  title: "아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
  description:
    "AI하루는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관 관리), AI하루(지식 학습) 등 다양한 서비스로 매일의 성장을 지원합니다.",
  keywords:
    "아이하루, AI하루, 하루, 습관, AI, 인공지능, 성장, 피드백, 프롬프트, GPT, LLM, 부모, 자녀, 대시보드, 서비스 소개, 식단 분석, 영양 관리",
  openGraph: {
    ...commonMetadata.openGraph,
    title: "아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
    description:
      "AI하루는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관 관리), AI하루(지식 학습) 등 다양한 서비스로 매일의 성장을 지원합니다.",
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
    name: "아이하루",
    alternateName: "아이하루",
    url: "https://aiharu.net",
    description:
      "AI하루는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://aiharu.net/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: ["https://hanip.aiharu.net"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeContent />
    </>
  );
}
