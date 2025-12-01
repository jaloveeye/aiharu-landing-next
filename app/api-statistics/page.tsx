"use client";

import ApiStatistics from "@/components/ApiStatistics";

export default function ApiStatisticsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-on-background)' }}>
              API 사용 통계
            </h1>
          </div>
          <p className="text-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
            API 키 발급 및 사용 통계를 확인하세요
          </p>
        </div>

        {/* 통계 컴포넌트 */}
        <ApiStatistics />
      </div>
    </div>
  );
}

