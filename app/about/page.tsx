"use client";

import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link
          href="/"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 transition-colors"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="text-center mb-16">
          <Title className="mb-6">{t("about.title")}</Title>
          <Body className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t("about.description")}
          </Body>
        </div>

        {/* AI하루 섹션 - 주석처리됨 */}
        {/* <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-green-700 mb-4">
                  🤖 {t("about.ai.title")}
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("about.ai.subtitle")}
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>{t("about.ai.description")}</p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {t("about.ai.features")}
                    </h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• {t("about.ai.feature1")}</li>
                      <li>• {t("about.ai.feature2")}</li>
                      <li>• {t("about.ai.feature3")}</li>
                      <li>• {t("about.ai.feature4")}</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/ai"
                    className="inline-block px-6 py-3 bg-green-600 text-white !text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t("about.ai.cta")}
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">🤖</div>
                <p className="text-gray-600">{t("about.ai.emoji")}</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* 아이하루 섹션 - 주석처리됨 */}
        {/* <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-yellow-700 mb-4">
                  👨‍👩‍👧‍👦 {t("about.child.title")}
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("about.child.subtitle")}
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>{t("about.child.description")}</p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {t("about.child.features")}
                    </h4>
                    <ul className="space-y-1 text-yellow-700">
                      <li>• {t("about.child.feature1")}</li>
                      <li>• {t("about.child.feature2")}</li>
                      <li>• {t("about.child.feature3")}</li>
                      <li>• {t("about.child.feature4")}</li>
                      <li>• {t("about.child.feature5")}</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="https://hanip.aiharu.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-yellow-600 text-white !text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    {t("about.child.cta")}
                  </a>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-gray-600">{t("about.child.emoji")}</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* 식단 분석 섹션 - 주석처리됨 */}
        {/* <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-blue-700 mb-4">
                  🍽️ {t("about.meal.title")}
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("about.meal.subtitle")}
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>{t("about.meal.description")}</p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {t("about.meal.features")}
                    </h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>• {t("about.meal.feature1")}</li>
                      <li>• {t("about.meal.feature2")}</li>
                      <li>• {t("about.meal.feature3")}</li>
                      <li>• {t("about.meal.feature4")}</li>
                      <li>• {t("about.meal.feature5")}</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/breakfast"
                    className="inline-block px-6 py-3 bg-blue-600 text-white !text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t("about.meal.cta")}
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">🍽️</div>
                <p className="text-gray-600">{t("about.meal.emoji")}</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* 서비스 특징 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              {t("about.characteristics.title")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("about.characteristic1.title")}
                </h3>
                <p className="text-gray-600">
                  {t("about.characteristic1.description")}
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("about.characteristic2.title")}
                </h3>
                <p className="text-gray-600">
                  {t("about.characteristic2.description")}
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("about.characteristic3.title")}
                </h3>
                <p className="text-gray-600">
                  {t("about.characteristic3.description")}
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("about.characteristic4.title")}
                </h3>
                <p className="text-gray-600">
                  {t("about.characteristic4.description")}
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("about.characteristic5.title")}
                </h3>
                <p className="text-gray-600">
                  {t("about.characteristic5.description")}
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("about.characteristic6.title")}
                </h3>
                <p className="text-gray-600">
                  {t("about.characteristic6.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">{t("about.cta.title")}</h2>
            <p className="text-xl mb-8 opacity-90">
              {t("about.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-white font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t("about.cta.signup")}
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                {t("about.cta.login")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
