"use client";

import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function HomeContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
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
          <Title className="text-center">{t("hero.subtitle")}</Title>
          <div className="flex flex-col gap-2 text-center max-w-2xl">
            <Body className="font-medium text-lg">
              {t("features.ai.title")}는 매일 하나의{" "}
              <span className="text-green-500 font-semibold">AI</span>를
              배웁니다.
            </Body>
            <Body className="font-medium text-lg">
              {t("features.child.title")}는 매일 하나의{" "}
              <span className="text-yellow-500 font-semibold">습관</span>을
              만듭니다.
            </Body>
          </div>
          <Body className="text-center text-gray-700 max-w-2xl">
            {t("hero.description")}
          </Body>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              as="a"
              href="https://hanip.aiharu.net"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-lg font-bold bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              {t("hero.cta")}
            </Button>
          </div>
        </main>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t("features.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI하루 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                {t("features.ai.title")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("features.ai.description")}
              </p>
              <Link
                href="/ai"
                className="inline-block px-6 py-3 bg-green-600 text-white !text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                {t("features.ai.title")} 시작하기
              </Link>
            </div>

            {/* 아이하루 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-yellow-700 mb-2">
                {t("features.child.title")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("features.child.description")}
              </p>
              <a
                href="https://hanip.aiharu.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-yellow-600 text-white !text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {t("features.child.title")} 시작하기
              </a>
            </div>

            {/* AI 식단 분석 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {t("features.meal.title")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("features.meal.description")}
              </p>
              <Link
                href="/breakfast"
                className="inline-block px-6 py-3 bg-blue-600 text-white !text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("features.meal.title")} 시작하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {t("cta.title")}
          </h2>
          <p className="text-xl mb-8 text-gray-600">{t("hero.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="px-8 py-4 bg-green-600 text-white !text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              {t("nav.services")}
            </Link>
            <Link
              href="/creator"
              className="px-8 py-4 border-2 border-green-600 text-white font-bold rounded-lg hover:bg-green-600 hover:text-white transition-colors"
            >
              {t("nav.creator")}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2 text-gray-700 text-sm">
            <span>{t("footer.made")}</span>
            <div className="flex gap-3 mt-1">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                개인정보 취급방침
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/withdraw"
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
