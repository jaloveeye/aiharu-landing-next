"use client";

import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>
            {t("about.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto whitespace-pre-line leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t("about.description")}
          </p>
        </div>

        {/* AI하루 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <div className="flex flex-col lg:flex-row items-start gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                    <svg className="w-6 h-6" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
                    {t("about.ai.title")}
                  </h2>
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                  {t("about.ai.subtitle")}
                </h3>
                <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p className="leading-relaxed">{t("about.ai.description")}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-medium border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-outline)' }}>
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                        {t("about.ai.features")}
                      </h4>
                      <ul className="space-y-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: '#000000' }}>•</span>
                          <span>{t("about.ai.feature1")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: '#000000' }}>•</span>
                          <span>{t("about.ai.feature2")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: '#000000' }}>•</span>
                          <span>{t("about.ai.feature3")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: '#000000' }}>•</span>
                          <span>{t("about.ai.feature4")}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-medium border" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                        AI 전문 뉴스, 프롬프트, 도구 활용법을 매일 큐레이션하여
                        누구나 쉽게 따라할 수 있는 실천 가이드를 제공합니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/ai"
                    className="inline-flex items-center px-6 py-3 font-semibold transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#000000', borderRadius: 'var(--border-radius-medium)' }}
                  >
                    AI하루 살펴보기
                  </Link>
                  <Link
                    href="/ai/daily"
                    className="inline-flex items-center px-6 py-3 border-2 font-semibold transition-colors"
                    style={{ borderColor: 'var(--color-outline)', color: 'var(--color-on-surface)', backgroundColor: 'transparent', borderRadius: 'var(--border-radius-medium)' }}
                  >
                    최신 AI 뉴스 보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 김아빠 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <div className="flex flex-col lg:flex-row-reverse items-start gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                    <svg className="w-6 h-6" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
                    김아빠
                  </h2>
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                  아빠와 아이의 어색한 5분을 기다려지는 5분으로
                </h3>
                <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p className="leading-relaxed">
                    <strong style={{ color: 'var(--color-on-surface)' }}>김아빠</strong>는 아빠와
                    아이가 비밀 미션을 수행하며 자연스럽게 소통하고 추억을
                    쌓을 수 있도록 돕는 AI 모험 서비스입니다.
                  </p>
                  <div className="p-5 rounded-medium border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-outline)' }}>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                      핵심 경험
                    </h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: '#000000' }}>•</span>
                        <span>비밀 요원 역할놀이로 어색함 없이 대화</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: '#000000' }}>•</span>
                        <span>AI가 생성하는 맞춤형 스토리와 힌트</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: '#000000' }}>•</span>
                        <span>5분 만에 완료 가능한 데일리 미션</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: '#000000' }}>•</span>
                        <span>가족만의 추억을 만드는 작은 이벤트</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/kimappa"
                    className="inline-flex items-center px-6 py-3 font-semibold transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#000000', borderRadius: 'var(--border-radius-medium)' }}
                  >
                    김아빠 서비스 둘러보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 기타 서비스 요약 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-surface)' }}>
              곧 만나볼 다른 서비스
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-medium p-6" style={{ borderColor: 'var(--color-outline)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                  아이하루
                </h3>
                <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  부모와 아이가 함께 습관을 만들고 성장 기록을 남길 수 있는
                  가족 성장 플랫폼입니다. 목표 설정과 체크리스트, 칭찬 피드백을
                  통해 매일의 루틴을 지원합니다.
                </p>
                <span className="inline-flex items-center font-semibold text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  곧 공개 예정
                </span>
              </div>
              <div className="border rounded-medium p-6 flex flex-col" style={{ borderColor: 'var(--color-outline)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                  AI 식단 분석
                </h3>
                <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  식사 사진을 업로드하면 AI가 영양 성분을 분석해 주고 부족한
                  영양소를 추천해 주는 서비스입니다. 균형 잡힌 식습관을 만들고
                  싶은 가족을 위한 기능입니다.
                </p>
                <a
                  href="https://hanip.aiharu.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 mt-auto border-2 font-semibold transition-colors"
                  style={{ borderColor: 'var(--color-outline)', color: 'var(--color-on-surface)', backgroundColor: 'transparent', borderRadius: 'var(--border-radius-medium)' }}
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

