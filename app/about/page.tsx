"use client";

import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: "var(--color-on-surface)" }}
          >
            {t("about.title")}
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto whitespace-pre-line leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {t("about.description")}
          </p>
        </div>

        {/* AI하루 */}
        <section className="mb-16">
          <div
            className="rounded-medium border p-8 md:p-12"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-outline)",
            }}
          >
            <div className="flex flex-col lg:flex-row items-start gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--color-outline)",
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: "#000000" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    {t("about.ai.title")}
                  </h2>
                </div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {t("about.ai.subtitle")}
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  <p className="leading-relaxed">{t("about.ai.description")}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className="p-5 rounded-medium border"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-outline)",
                      }}
                    >
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {t("about.ai.features")}
                      </h4>
                      <ul
                        className="space-y-2 text-sm"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>{t("about.ai.feature1")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>{t("about.ai.feature2")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>{t("about.ai.feature3")}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>{t("about.ai.feature4")}</span>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="p-5 rounded-medium border"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-outline)",
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
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
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "#000000",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    AI하루 살펴보기
                  </Link>
                  <Link
                    href="/ai/daily"
                    className="inline-flex items-center px-6 py-3 border-2 font-semibold transition-colors"
                    style={{
                      borderColor: "var(--color-outline)",
                      color: "var(--color-on-surface)",
                      backgroundColor: "transparent",
                      borderRadius: "var(--border-radius-medium)",
                    }}
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
          <div
            className="rounded-medium border p-8 md:p-12"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-outline)",
            }}
          >
            <div className="flex flex-col lg:flex-row-reverse items-start gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--color-outline)",
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: "#000000" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    김아빠
                  </h2>
                </div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  아빠와 아이의 어색한 5분을 기다려지는 5분으로
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  <p className="leading-relaxed">
                    <strong style={{ color: "var(--color-on-surface)" }}>
                      김아빠
                    </strong>
                    는 아빠와 아이가 비밀 미션을 수행하며 자연스럽게 소통하고
                    추억을 쌓을 수 있도록 돕는 AI 모험 서비스입니다.
                  </p>
                  <div
                    className="p-5 rounded-medium border"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-outline)",
                    }}
                  >
                    <h4
                      className="font-semibold mb-3"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      핵심 경험
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: "#000000" }}>
                          •
                        </span>
                        <span>비밀 요원 역할놀이로 어색함 없이 대화</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: "#000000" }}>
                          •
                        </span>
                        <span>AI가 생성하는 맞춤형 스토리와 힌트</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: "#000000" }}>
                          •
                        </span>
                        <span>5분 만에 완료 가능한 데일리 미션</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: "#000000" }}>
                          •
                        </span>
                        <span>가족만의 추억을 만드는 작은 이벤트</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/kimappa"
                    className="inline-flex items-center px-6 py-3 font-semibold transition-colors"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "#000000",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    김아빠 서비스 둘러보기
                  </Link>
                  <a
                    href="https://apps.apple.com/kr/app/%EA%B9%80%EC%95%84%EB%B9%A0/id6755213272"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-colors"
                    style={{
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-.96-1.15 0-1.93.46-2.93.96-1.01.5-2.12.95-3.65.4-1.53-.55-2.64-2.26-3.64-3.26C.93 15.84 0 13.75 0 11.24c0-2.24.89-4.27 2.45-5.77C4 4 5.95 3.11 7.78 3.11c1.15 0 1.93.46 2.93.96 1.01.5 1.01.67 1.53.67.52 0 .89-.17 1.77-.67 1.32-.65 2.79-.96 4.26-.96 2.05 0 3.93.89 5.28 2.45-4.76 2.78-4.08 8.97.77 11.52zm.23-14.04c-1.15-1.4-2.78-2.23-4.45-2.23-1.5 0-2.9.57-3.94 1.45-1.71 1.15-2.78 3.11-2.78 5.23 0 .89.17 1.77.46 2.64 1.15-3.26 3.64-5.23 6.26-6.26 1.09-.42 2.12-.67 3.15-.67.52 0 1.04.08 1.56.25-.42-1.4-1.15-2.64-2.06-3.64z"/>
                    </svg>
                    App Store에서 다운로드
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Listo */}
        <section className="mb-16">
          <div
            className="rounded-medium border p-8 md:p-12"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-outline)",
            }}
          >
            <div className="flex flex-col lg:flex-row items-start gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--color-outline)",
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: "#000000" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    Listo
                  </h2>
                </div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  세상에서 가장 똑똑한 출발 시간 계산기
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  <p className="leading-relaxed">
                    <strong style={{ color: "var(--color-on-surface)" }}>
                      Listo
                    </strong>
                    는 특정 목적지에 정해진 시간까지 도착해야 할 때, 현재 위치,
                    이동 시간, 준비 시간 등 다양한 변수를 고려하여 최적의 출발
                    시간을 계산하는 스마트 앱입니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className="p-5 rounded-medium border"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-outline)",
                      }}
                    >
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        주요 기능
                      </h4>
                      <ul
                        className="space-y-2 text-sm"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>준비 카드 관리로 반복 스케줄 자동 알림</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>스마트 알림으로 정확한 출발 시간 안내</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>활성 요일 및 날짜 범위 설정</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>체크리스트로 준비 항목 관리</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>학사일정 관리 및 캘린더 연동</span>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="p-5 rounded-medium border"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-outline)",
                      }}
                    >
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        개인정보 보호
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        Listo는 서버를 운영하지 않으며, 모든 데이터는 사용자의
                        기기 내부에만 저장됩니다. 서버로 전송되거나 외부로
                        수집되는 데이터는 없습니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/listo"
                    className="inline-flex items-center px-6 py-3 font-semibold transition-colors"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "#000000",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    Listo 서비스 둘러보기
                  </Link>
                  <a
                    href="https://apps.apple.com/kr/app/listo/id6756487226"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-colors"
                    style={{
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-.96-1.15 0-1.93.46-2.93.96-1.01.5-2.12.95-3.65.4-1.53-.55-2.64-2.26-3.64-3.26C.93 15.84 0 13.75 0 11.24c0-2.24.89-4.27 2.45-5.77C4 4 5.95 3.11 7.78 3.11c1.15 0 1.93.46 2.93.96 1.01.5 1.01.67 1.53.67.52 0 .89-.17 1.77-.67 1.32-.65 2.79-.96 4.26-.96 2.05 0 3.93.89 5.28 2.45-4.76 2.78-4.08 8.97.77 11.52zm.23-14.04c-1.15-1.4-2.78-2.23-4.45-2.23-1.5 0-2.9.57-3.94 1.45-1.71 1.15-2.78 3.11-2.78 5.23 0 .89.17 1.77.46 2.64 1.15-3.26 3.64-5.23 6.26-6.26 1.09-.42 2.12-.67 3.15-.67.52 0 1.04.08 1.56.25-.42-1.4-1.15-2.64-2.06-3.64z"/>
                    </svg>
                    App Store에서 다운로드
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=net.aiharu.listo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 font-semibold transition-colors"
                    style={{
                      borderColor: "var(--color-outline)",
                      color: "var(--color-on-surface)",
                      backgroundColor: "transparent",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    Google Play에서 다운로드
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cap Finder */}
        <section className="mb-16">
          <div
            className="rounded-medium border p-8 md:p-12"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-outline)",
            }}
          >
            <div className="flex flex-col lg:flex-row-reverse items-start gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--color-outline)",
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: "#000000" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    Cap Finder
                  </h2>
                </div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  커스텀 키보드 키캡 검색 앱
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  <p className="leading-relaxed">
                    <strong style={{ color: "var(--color-on-surface)" }}>
                      Cap Finder
                    </strong>
                    는 커스텀 키보드 키캡을 쉽게 찾을 수 있는 앱입니다. 색상
                    코드, 키캡 이름, 디자이너 이름으로 검색하고, 555개 이상의
                    키캡 정보를 제공합니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className="p-5 rounded-medium border"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-outline)",
                      }}
                    >
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        주요 기능
                      </h4>
                      <ul
                        className="space-y-2 text-sm"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>색상 코드로 키캡 검색</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>키캡 이름 및 디자이너 이름 검색</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>출시일 및 이름순 정렬</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>555개 이상의 키캡 정보 제공</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>한글/영문 지원</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>상세한 키캡 정보 및 레이아웃 이미지</span>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="p-5 rounded-medium border"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: "var(--color-outline)",
                      }}
                    >
                      <h4
                        className="font-semibold mb-3"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        검색 방법
                      </h4>
                      <ul
                        className="space-y-2 text-sm"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>
                            색상 피커로 원하는 색상을 선택하면 가장 유사한 GMK
                            색상 코드로 자동 필터링
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>키캡 이름이나 디자이너 이름으로 검색</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: "#000000" }}>
                            •
                          </span>
                          <span>출시일 또는 이름순으로 정렬</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/cap-finder"
                    className="inline-flex items-center px-6 py-3 font-semibold transition-colors"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "#000000",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    Cap Finder 서비스 둘러보기
                  </Link>
                  <a
                    href="https://apps.apple.com/kr/app/cap-finder/id6755984152"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-colors"
                    style={{
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-.96-1.15 0-1.93.46-2.93.96-1.01.5-2.12.95-3.65.4-1.53-.55-2.64-2.26-3.64-3.26C.93 15.84 0 13.75 0 11.24c0-2.24.89-4.27 2.45-5.77C4 4 5.95 3.11 7.78 3.11c1.15 0 1.93.46 2.93.96 1.01.5 1.01.67 1.53.67.52 0 .89-.17 1.77-.67 1.32-.65 2.79-.96 4.26-.96 2.05 0 3.93.89 5.28 2.45-4.76 2.78-4.08 8.97.77 11.52zm.23-14.04c-1.15-1.4-2.78-2.23-4.45-2.23-1.5 0-2.9.57-3.94 1.45-1.71 1.15-2.78 3.11-2.78 5.23 0 .89.17 1.77.46 2.64 1.15-3.26 3.64-5.23 6.26-6.26 1.09-.42 2.12-.67 3.15-.67.52 0 1.04.08 1.56.25-.42-1.4-1.15-2.64-2.06-3.64z"/>
                    </svg>
                    App Store에서 다운로드
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.gmk.gmk_keycap_finder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 font-semibold transition-colors"
                    style={{
                      borderColor: "var(--color-outline)",
                      color: "var(--color-on-surface)",
                      backgroundColor: "transparent",
                      borderRadius: "var(--border-radius-medium)",
                    }}
                  >
                    Google Play에서 다운로드
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 기타 서비스 요약 */}
        <section className="mb-16">
          <div
            className="rounded-medium border p-8 md:p-12"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-outline)",
            }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-10"
              style={{ color: "var(--color-on-surface)" }}
            >
              곧 만나볼 다른 서비스
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="border rounded-medium p-6"
                style={{ borderColor: "var(--color-outline)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--color-outline)",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#000000" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  아이하루
                </h3>
                <p
                  className="mb-4 leading-relaxed"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  부모와 아이가 함께 습관을 만들고 성장 기록을 남길 수 있는 가족
                  성장 플랫폼입니다. 목표 설정과 체크리스트, 칭찬 피드백을 통해
                  매일의 루틴을 지원합니다.
                </p>
                <span
                  className="inline-flex items-center font-semibold text-sm"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  곧 공개 예정
                </span>
              </div>
              <div
                className="border rounded-medium p-6 flex flex-col"
                style={{ borderColor: "var(--color-outline)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--color-outline)",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#000000" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  AI 식단 분석
                </h3>
                <p
                  className="mb-6 leading-relaxed"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  식사 사진을 업로드하면 AI가 영양 성분을 분석해 주고 부족한
                  영양소를 추천해 주는 서비스입니다. 균형 잡힌 식습관을 만들고
                  싶은 가족을 위한 기능입니다.
                </p>
                <a
                  href="https://hanip.aiharu.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 mt-auto border-2 font-semibold transition-colors"
                  style={{
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-surface)",
                    backgroundColor: "transparent",
                    borderRadius: "var(--border-radius-medium)",
                  }}
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
