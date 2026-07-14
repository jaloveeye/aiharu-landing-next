import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Manrope } from "next/font/google";
import "./globals.css";
import HeaderAuth from "@/components/HeaderAuth";
import { LanguageProvider } from "@/app/contexts/LanguageContext";
import { commonMetadata } from "@/app/metadata/common";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...commonMetadata,
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${manrope.variable} ${sourceSans.variable} antialiased`}
        aria-label="아이하루 랜딩 페이지"
      >
        <LanguageProvider>
          <HeaderAuth />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
