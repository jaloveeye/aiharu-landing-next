import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { useEffect, useState } from "react";
// import { createClient } from "@/app/utils/supabase/client";
import HeaderAuth from "@/components/HeaderAuth";
import { commonMetadata } from "@/app/metadata/common";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  ...commonMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="aiharu - AI와 하루, 아이와 하루의 특별한 일상"
        />
        <meta property="og:title" content="aiharu - AI와 하루, 아이와 하루" />
        <meta
          property="og:description"
          content="기술과 감성이 어우러진 특별한 일상, aiharu"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/happy-family.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        aria-label="aiharu 랜딩 페이지"
      >
        <HeaderAuth />
        {children}
      </body>
    </html>
  );
}
