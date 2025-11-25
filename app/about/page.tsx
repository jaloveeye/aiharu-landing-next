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
          className="inline-flex items-center px-4 py-2 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors mb-8"
        >
          홈으로 돌아가기
        </Link>

        <div className="text-center mb-16">
          <Title className="mb-6">{t("about.title")}</Title>
          <Body className="text-lg text-gray-700 max-w-3xl mx-auto whitespace-pre-line">
            {t("about.description")}
          </Body>
        </div>

        {/* AI하루 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-green-700 mb-4">
                  🤖 {t("about.ai.title")}
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t("about.ai.subtitle")}
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>{t("about.ai.description")}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <h4 className="font-semibold text-green-800 mb-2">
                        {t("about.ai.features")}
                      </h4>
                      <ul className="space-y-1 text-green-700 text-sm">
                        <li>• {t("about.ai.feature1")}</li>
                        <li>• {t("about.ai.feature2")}</li>
                        <li>• {t("about.ai.feature3")}</li>
                        <li>• {t("about.ai.feature4")}</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        AI 전문 뉴스, 프롬프트, 도구 활용법을 매일 큐레이션하여
                        누구나 쉽게 따라할 수 있는 실천 가이드를 제공합니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/ai"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    style={{ color: "#fff" }}
                  >
                    AI하루 살펴보기
                  </Link>
                  <Link
                    href="/ai/daily"
                    className="inline-flex items-center px-6 py-3 border border-green-200 text-green-700 font-semibold rounded-lg hover:border-green-300 transition-colors"
                  >
                    최신 AI 뉴스 보기
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">🗞️</div>
                <p className="text-gray-600">
                  AI와 함께하는 똑똑한 하루를 만나보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 김아빠 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-green-700 mb-4">
                  🕵️ 김아빠
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  아빠와 아이의 어색한 5분을 기다려지는 5분으로
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong className="text-green-800">김아빠</strong>는 아빠와
                    아이가 비밀 미션을 수행하며 자연스럽게 소통하고 추억을
                    쌓을 수 있도록 돕는 AI 모험 서비스입니다.
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="font-semibold text-emerald-800 mb-3">
                      핵심 경험
                    </h4>
                    <ul className="space-y-2 text-emerald-700 text-sm">
                      <li>• 비밀 요원 역할놀이로 어색함 없이 대화</li>
                      <li>• AI가 생성하는 맞춤형 스토리와 힌트</li>
                      <li>• 5분 만에 완료 가능한 데일리 미션</li>
                      <li>• 가족만의 추억을 만드는 작은 이벤트</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/kimappa"
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    style={{ color: "#fff" }}
                  >
                    김아빠 서비스 둘러보기
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">🌟</div>
                <p className="text-gray-600">
                  AI가 설계한 가족 맞춤형 모험을 만나보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 기타 서비스 요약 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              곧 만나볼 다른 서비스
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="text-4xl mb-4">👶</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  아이하루
                </h3>
                <p className="text-gray-600 mb-4">
                  부모와 아이가 함께 습관을 만들고 성장 기록을 남길 수 있는
                  가족 성장 플랫폼입니다. 목표 설정과 체크리스트, 칭찬 피드백을
                  통해 매일의 루틴을 지원합니다.
                </p>
                <span className="inline-flex items-center text-green-600 font-semibold">
                  곧 공개 예정
                </span>
              </div>
              <div className="border border-gray-200 rounded-2xl p-6 flex flex-col">
                <div className="text-4xl mb-4">🥗</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  AI 식단 분석
                </h3>
                <p className="text-gray-600 mb-6">
                  식사 사진을 업로드하면 AI가 영양 성분을 분석해 주고 부족한
                  영양소를 추천해 주는 서비스입니다. 균형 잡힌 식습관을 만들고
                  싶은 가족을 위한 기능입니다.
                </p>
                <a
                  href="https://hanip.aiharu.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 mt-auto border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                >
                  AI 식단 분석 바로가기
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

