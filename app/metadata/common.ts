// 사이트 공통 메타데이터 (페이지별로 import해서 사용)
import type { Metadata } from "next";

export const commonMetadata: Metadata = {
  title: "aiharu 아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
  description:
    "aiharu(아이하루)는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관 관리), AI하루(지식 학습) 등 다양한 서비스로 매일의 성장을 지원합니다.",
  keywords:
    "aiharu, 아이하루, AI하루, 하루, 습관, AI, 인공지능, 성장, 피드백, 프롬프트, GPT, LLM, 부모, 자녀, 대시보드, 서비스 소개, 식단 분석, 영양 관리",
  authors: [{ name: "aiharu" }],
  creator: "aiharu",
  publisher: "aiharu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "aiharu 아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
    description:
      "aiharu(아이하루)는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관 관리), AI하루(지식 학습) 등 다양한 서비스로 매일의 성장을 지원합니다.",
    type: "website",
    url: "https://aiharu.net/",
    siteName: "aiharu 아이하루",
    locale: "ko_KR",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "aiharu 아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "aiharu 아이하루 - AI와 아이의 하루를 더 똑똑하고 따뜻하게",
    description: "aiharu(아이하루)는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다.",
    images: ["/og-main.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://aiharu.net"
  ),
  alternates: {
    canonical: "/",
  },
};
