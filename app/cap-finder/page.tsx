"use client";

import Link from "next/link";
import { Title } from "@/components/ui/Typography";

export default function CapFinderPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">

        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Title className="text-4xl md:text-5xl" style={{ color: 'var(--color-on-background)' }}>Cap Finder</Title>
          </div>
          <div className="p-8 md:p-10 max-w-3xl mx-auto border" style={{ 
            backgroundColor: 'var(--color-primary)', 
            color: '#000000',
            borderRadius: 'var(--border-radius-medium)',
            borderColor: 'var(--color-outline)'
          }}>
            <p className="text-2xl md:text-3xl font-bold mb-4">
              커스텀 키보드 키캡 검색 앱
            </p>
            <p className="text-lg leading-relaxed mb-6">
              CapFinder는 커스텀 키보드 키캡을 쉽게 찾을 수 있는 앱입니다. 
              색상 코드, 키캡 이름, 디자이너 이름으로 검색하고, 555개 이상의 키캡 정보를 제공합니다.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://apps.apple.com/kr/app/cap-finder/id6755984152"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
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
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L6.05,21.34L14.54,12.85L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play에서 다운로드
              </a>
            </div>
          </div>
        </div>

        {/* 서비스 소개 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-on-background)' }}>
                Cap Finder는 무엇인가요?
              </h2>
              <div className="space-y-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                <p className="text-lg">
                  <strong style={{ color: 'var(--color-on-background)' }}>Cap Finder</strong>는 커스텀 키보드 키캡을 쉽게 찾을 수 있는 앱입니다. 
                  키보드 커뮤니티를 위한 필수 앱으로, 555개 이상의 키캡 정보를 제공합니다.
                </p>
                <p>
                  색상 피커로 원하는 색상을 선택하면 가장 유사한 <strong style={{ color: 'var(--color-on-background)' }}>GMK 색상 코드</strong>로 자동 필터링됩니다. 
                  키캡 이름이나 디자이너 이름으로도 검색할 수 있으며, 출시일 또는 이름순으로 정렬할 수 있습니다.
                </p>
                <p>
                  <strong style={{ color: 'var(--color-on-background)' }}>한글/영문을 지원</strong>하며, 상세한 키캡 정보와 레이아웃 이미지를 제공합니다. 
                  직관적인 UI/UX로 빠른 검색 및 필터링이 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              주요 기능
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  색상 코드로 검색
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  색상 피커로 원하는 색상을 선택하면 가장 유사한 GMK 색상 코드로 자동 필터링됩니다. 이미지에서 추출한 색상을 선택하면 즉시 검색 결과에 반영됩니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  이름으로 검색
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  키캡 이름이나 디자이너 이름으로 검색할 수 있습니다. 한글/영문 모두 지원하여 원하는 키캡을 빠르게 찾을 수 있습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  정렬 기능
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  출시일 또는 이름순으로 정렬할 수 있습니다. 최신순, 이름순, 도착 시간순, 생성일순으로 정렬하여 원하는 방식으로 키캡을 관리할 수 있습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  상세 정보 제공
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  555개 이상의 키캡 정보를 제공합니다. 각 키캡의 상세 정보와 레이아웃 이미지를 확인할 수 있습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  다국어 지원
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  한글/영문을 지원합니다. 한국어와 영어 모두에서 키캡을 검색하고 정보를 확인할 수 있습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  레이아웃 이미지
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  각 키캡의 레이아웃 이미지를 제공합니다. 키캡이 키보드에 어떻게 배치되는지 시각적으로 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 검색 방법 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              검색 방법
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  색상 피커로 검색
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  색상 피커로 원하는 색상을 선택하면 가장 유사한 GMK 색상 코드로 자동 필터링됩니다. 
                  이미지에서 추출한 색상을 선택하면 즉시 검색 결과에 반영됩니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  이름으로 검색
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  키캡 이름이나 디자이너 이름으로 검색할 수 있습니다. 한글/영문 모두 지원하여 원하는 키캡을 빠르게 찾을 수 있습니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  정렬 기능
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  출시일 또는 이름순으로 정렬할 수 있습니다. 최신순, 이름순, 도착 시간순, 생성일순으로 정렬하여 원하는 방식으로 키캡을 관리할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Store 다운로드 버튼 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12 text-center" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
              키보드 커뮤니티를 위한 필수 앱
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--color-on-surface-variant)' }}>
              Cap Finder와 함께 원하는 키캡을 쉽게 찾아보세요!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://apps.apple.com/kr/app/cap-finder/id6755984152"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-.96-1.15 0-1.93.46-2.93.96-1.01.5-2.12.95-3.65.4-1.53-.55-2.64-2.26-3.64-3.26C.93 15.84 0 13.75 0 11.24c0-2.24.89-4.27 2.45-5.77C4 4 5.95 3.11 7.78 3.11c1.15 0 1.93.46 2.93.96 1.01.5 1.01.67 1.53.67.52 0 .89-.17 1.77-.67 1.32-.65 2.79-.96 4.26-.96 2.05 0 3.93.89 5.28 2.45-4.76 2.78-4.08 8.97.77 11.52zm.23-14.04c-1.15-1.4-2.78-2.23-4.45-2.23-1.5 0-2.9.57-3.94 1.45-1.71 1.15-2.78 3.11-2.78 5.23 0 .89.17 1.77.46 2.64 1.15-3.26 3.64-5.23 6.26-6.26 1.09-.42 2.12-.67 3.15-.67.52 0 1.04.08 1.56.25-.42-1.4-1.15-2.64-2.06-3.64z"/>
                </svg>
                App Store에서 다운로드
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.gmk.gmk_keycap_finder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L6.05,21.34L14.54,12.85L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play에서 다운로드
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

