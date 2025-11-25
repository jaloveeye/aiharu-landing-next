"use client";

import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function HomeContent() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <main className="flex flex-col items-center gap-8 max-w-4xl">
          <Image
            src="/happy-family.png"
            alt="행복한 가족 일러스트"
            width={400}
            height={280}
            className="mb-4 rounded-2xl border border-gray-200 dark:border-gray-800"
            priority
            aria-label="행복한 가족 일러스트"
          />

          <Title className="text-center whitespace-pre-line text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            {t("hero.subtitle")}
          </Title>

          <Body className="font-medium text-lg text-center text-gray-800 dark:text-gray-200 max-w-2xl">
            AI와 가족의 하루를 설계하는{" "}
            <span className="text-green-700 dark:text-green-400 font-semibold">
              AI하루
            </span>
            와
            <span className="text-green-600 dark:text-green-300 font-semibold">
              {" "}
              김아빠
            </span>
            를 만나보세요.
          </Body>

          <Body className="text-center text-gray-600 dark:text-gray-400 max-w-2xl whitespace-pre-line">
            {t("hero.description")}
          </Body>
        </main>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-16">
            지금 만나볼 수 있는 서비스
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* AI하루 */}
            <Link
              href="/ai"
              className="group bg-white dark:bg-gray-950 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-200"
            >
              <div className="text-6xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                AI하루
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                최신 AI 뉴스, 프롬프트, 도구 활용법을 하루 한 번에 정리해 드리는
                지식 큐레이션 서비스입니다.
              </p>
              <span className="text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-2 mt-auto">
                자세히 보기 →
              </span>
            </Link>

            {/* 김아빠 */}
            <Link
              href="/kimappa"
              className="group bg-white dark:bg-gray-950 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-200"
            >
              <div className="text-6xl mb-6">🕵️</div>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                김아빠
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                아빠와 아이가 비밀 미션을 통해 자연스럽게 대화하고 추억을 쌓도록
                돕는 5분 놀이 모험 서비스입니다.
              </p>
              <span className="text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-2 mt-auto">
                서비스 살펴보기 →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl p-12 border border-green-200 dark:border-green-800 bg-white dark:bg-gray-950">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              {t("cta.title")}
            </h2>
            <p className="text-xl mb-10 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              AI와 가족의 하루를 새롭게 설계하고 싶다면
              {"\n"}서비스 소개 페이지에서 더 많은 내용을 확인해 보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as="a"
                href="/about"
                variant="primary"
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {t("nav.services")}
              </Button>
              <Button
                as="a"
                href="/creator"
                variant="outline"
                size="lg"
                className="border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
              >
                {t("nav.creator")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-4 text-gray-600 dark:text-gray-400">
            <span className="text-lg">{t("footer.made")}</span>
            <div className="flex gap-6 mt-2">
              <Link
                href="/privacy"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                개인정보 취급방침
              </Link>
              <span className="text-gray-400 dark:text-gray-600">|</span>
              <Link
                href="/withdraw"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                회원 탈퇴
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
