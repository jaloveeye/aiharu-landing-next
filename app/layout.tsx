import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "aiharu - 오늘의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
  description:
    "aiharu는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관), AI하루(지식) 등 다양한 서비스 제공.",
  keywords:
    "aiharu, 아이하루, AI하루, 하루, 습관, AI, 인공지능, 성장, 피드백, 프롬프트, GPT, LLM, 부모, 자녀, 대시보드, 서비스 소개",
  openGraph: {
    title: "aiharu - 오늘의 하루를 더 똑똑하고 따뜻하게 | aiharu.net",
    description:
      "aiharu는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다. 아이하루(습관), AI하루(지식) 등 다양한 서비스 제공.",
    type: "website",
    url: "https://aiharu.net/",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "aiharu - 오늘의 하루를 더 똑똑하고 따뜻하게",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
