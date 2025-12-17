"use client";

import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function HomeContent() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen text-gray-900 dark:bg-gray-950 dark:text-gray-100" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] px-6 py-16 md:py-24" style={{ backgroundColor: 'var(--hero-background)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>
            {t("hero.subtitle")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
            AI와 가족의 하루를 설계하는{" "}
            <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
              아이하루
            </span>
            와{" "}
            <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
              김아빠
            </span>
            를 만나보세요.
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as="a"
              href="/about"
              variant="primary"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-small"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: '#000000',
                minHeight: '56px'
              }}
            >
              서비스 소개
            </Button>
            <Button
              as="a"
              href="/creator"
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-small border-2"
              style={{ 
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'transparent',
                minHeight: '56px'
              }}
            >
              제작자 소개
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
              지금 만나볼 수 있는 서비스
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
              AI와 가족의 하루를 더 똑똑하고 따뜻하게 만들어주는 서비스들을 만나보세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI하루 */}
            <Link
              href="/ai"
              className="group p-8 rounded-medium border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-outline)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-outline)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-7 h-7" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                AI하루
              </h3>
              <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                최신 AI 뉴스, 프롬프트, 도구 활용법을 하루 한 번에 정리해 드리는 지식 큐레이션 서비스입니다.
              </p>
              <div className="flex items-center font-medium text-sm group-hover:gap-2 gap-1 transition-all" style={{ color: 'var(--color-primary)' }}>
                자세히 보기
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* 김아빠 */}
            <Link
              href="/kimappa"
              className="group p-8 rounded-medium border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-outline)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-outline)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-7 h-7" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                김아빠
              </h3>
              <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                아빠와 아이가 비밀 미션을 통해 자연스럽게 대화하고 추억을 쌓도록 돕는 5분 놀이 모험 서비스입니다.
              </p>
              <div className="flex items-center font-medium text-sm group-hover:gap-2 gap-1 transition-all" style={{ color: 'var(--color-primary)' }}>
                자세히 보기
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Listo */}
            <Link
              href="/listo"
              className="group p-8 rounded-medium border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-outline)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-outline)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-7 h-7" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                Listo
              </h3>
              <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                도착 시간, 이동 시간, 준비 시간을 고려하여 최적의 출발 시간을 계산해주는 스마트 앱입니다.
              </p>
              <div className="flex items-center font-medium text-sm group-hover:gap-2 gap-1 transition-all" style={{ color: 'var(--color-primary)' }}>
                자세히 보기
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Cap Finder */}
            <Link
              href="/cap-finder"
              className="group p-8 rounded-medium border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-outline)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-outline)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                <svg className="w-7 h-7" style={{ color: '#000000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                Cap Finder
              </h3>
              <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                커스텀 키보드 키캡을 색상 코드, 이름, 디자이너로 검색할 수 있는 앱입니다. 555개 이상의 키캡 정보를 제공합니다.
              </p>
              <div className="flex items-center font-medium text-sm group-hover:gap-2 gap-1 transition-all" style={{ color: 'var(--color-primary)' }}>
                자세히 보기
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>
            함께 성장하는 가족의 이야기
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-on-surface-variant)' }}>
            매일의 작은 변화가 모여 특별한 추억이 됩니다.{"\n"}아이하루와 함께 시작해보세요.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t" style={{ borderColor: 'var(--color-outline)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                {t("hero.title")}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물하는 서비스입니다.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                    서비스 소개
                  </Link>
                </li>
                <li>
                  <Link href="/creator" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                    제작자 소개
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                    개인정보 취급방침
                  </Link>
                </li>
                <li>
                  <Link href="/withdraw" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                    회원 탈퇴
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                Contact
              </h4>
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                jaloveeye@gmail.com
              </p>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm" style={{ borderColor: 'var(--color-outline)', color: 'var(--color-on-surface-variant)' }}>
            <p>{t("footer.made")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
