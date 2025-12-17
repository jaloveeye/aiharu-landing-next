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
            <p className="text-3xl md:text-4xl font-bold mb-4">
              원하는 색상의 GMK 키캡을 찾아보세요
            </p>
            <p className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              색상 코드, 이미지, 이름으로 쉽고 빠르게 검색
            </p>
            <p className="text-lg leading-relaxed mb-6">
              CapFinder는 커스텀 키보드 키캡을 쉽게 찾을 수 있는 앱입니다. 
              555개 이상의 키캡 정보를 제공하며, 다양한 방법으로 원하는 키캡을 찾을 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://apps.apple.com/kr/app/cap-finder/id6755984152"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                App Store에서 다운로드
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.gmk.gmk_keycap_finder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
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
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  GMK 색상 코드로 검색
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  35개의 GMK 표준 색상 코드를 지원합니다. 원하는 색상을 선택하면 해당 색상을 포함한 키캡만 표시됩니다. 
                  시각적 색상 피커로 직관적인 선택이 가능합니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  이미지에서 색상 추출
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  이미지를 업로드하면 자동으로 주요 색상을 추출하고, GMK 색상 코드로 자동 매칭합니다. 
                  매칭된 색상으로 키캡을 검색할 수 있어 원하는 색상의 키캡을 쉽게 찾을 수 있습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  이름으로 검색
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  키캡 이름이나 디자이너 이름으로 빠르게 검색할 수 있습니다. 
                  실시간으로 결과가 업데이트되며, 한글/영문 모두 지원합니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  정렬 및 필터링
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  출시일, 이름, 색상 유사도 등 다양한 기준으로 정렬할 수 있습니다. 
                  최신순, 과거순, 가나다순으로 정렬하여 원하는 키캡을 찾을 수 있습니다.
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
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                    1
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-background)' }}>
                    색상 선택 또는 이미지 업로드
                  </h3>
                </div>
                <p className="leading-relaxed ml-11" style={{ color: 'var(--color-on-surface-variant)' }}>
                  색상 피커로 원하는 색상을 선택하거나, 이미지를 업로드하여 색상을 추출합니다. 
                  GMK 표준 색상 코드 35개 중에서 가장 유사한 색상이 자동으로 매칭됩니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                    2
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-background)' }}>
                    자동 색상 매칭 및 검색
                  </h3>
                </div>
                <p className="leading-relaxed ml-11" style={{ color: 'var(--color-on-surface-variant)' }}>
                  선택한 색상이 포함된 키캡이 자동으로 필터링됩니다. 
                  이미지에서 추출한 색상의 경우, 색상 유사도 기준으로 정렬되어 가장 유사한 키캡부터 표시됩니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                    3
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-background)' }}>
                    결과 확인 및 상세 정보 보기
                  </h3>
                </div>
                <p className="leading-relaxed ml-11" style={{ color: 'var(--color-on-surface-variant)' }}>
                  검색 결과에서 원하는 키캡을 선택하면 상세 정보를 확인할 수 있습니다. 
                  키캡 이름, 디자이너, 출시일, 색상 코드, 레이아웃 이미지 등 모든 정보를 한눈에 볼 수 있습니다.
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
              원하는 색상의 GMK 키캡을 3초 안에 찾아보세요
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--color-on-surface-variant)' }}>
              Cap Finder와 함께 키보드 커뮤니티를 위한 필수 앱을 경험해보세요!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://apps.apple.com/kr/app/cap-finder/id6755984152"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                App Store에서 다운로드
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.gmk.gmk_keycap_finder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                Google Play에서 다운로드
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

