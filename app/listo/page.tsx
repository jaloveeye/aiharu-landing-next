"use client";

import Link from "next/link";
import { Title } from "@/components/ui/Typography";

export default function ListoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">

        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Title className="text-4xl md:text-5xl" style={{ color: 'var(--color-on-background)' }}>Listo</Title>
          </div>
          <div className="p-8 md:p-10 max-w-3xl mx-auto border" style={{ 
            backgroundColor: 'var(--color-primary)', 
            color: '#000000',
            borderRadius: 'var(--border-radius-medium)',
            borderColor: 'var(--color-outline)'
          }}>
            <p className="text-3xl md:text-4xl font-bold mb-4">
              그래서, 몇 시에 나가야 돼?
            </p>
            <p className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              Listo가 계산해드립니다
            </p>
            <p className="text-lg leading-relaxed mb-6">
              도착 시간, 이동 시간, 준비 시간만 알려주세요.
              복잡한 계산은 Listo가 알아서 해드립니다.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://apps.apple.com/kr/app/listo/id6756487226"
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
                href="https://play.google.com/store/apps/details?id=net.aiharu.listo"
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

        {/* 문제 정의 섹션 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-on-background)' }}>
                매번 머릿속으로 계산하시나요?
              </h2>
              <div className="space-y-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                <p className="text-lg text-center">
                  "등교 시간은 8시, 이동 시간은 20분, 준비 시간은 10분...<br />
                  그럼 7시 30분에 나가야 하네?"
                </p>
                <p className="text-center">
                  이런 계산을 매일 반복하시나요?<br />
                  <strong style={{ color: 'var(--color-on-background)' }}>Listo는 이 모든 것을 자동으로 해드립니다.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 소개 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-on-background)' }}>
                Listo는 무엇인가요?
              </h2>
              <div className="space-y-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                <p className="text-lg">
                  <strong style={{ color: 'var(--color-on-background)' }}>Listo</strong>는 특정 목적지에 정해진 시간까지 도착해야 할 때, 
                  이동 시간, 준비 시간을 고려하여 최적의 출발 시간을 자동으로 계산하는 스마트 앱입니다.
                </p>
                <p>
                  매일 아침 등교 시간, 주말 학원 시간, 특정 날짜의 약속 시간 등 반복되는 스케줄을 
                  <strong style={{ color: 'var(--color-on-background)' }}> 준비 카드</strong>로 저장하고 관리할 수 있습니다. 
                  한 번 설정하면 계속 사용할 수 있어 매번 계산할 필요가 없습니다.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  준비 카드 관리
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  반복되는 스케줄을 준비 카드로 저장하고 관리할 수 있습니다. 매일 등교 시간, 주말 학원 시간 등을 미리 설정해두면 자동으로 알림을 받을 수 있습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  스마트 알림
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  도착 시간에 맞춰 자동으로 준비 시간과 출발 시간 알림을 받을 수 있습니다. 준비 시간과 이동 시간을 고려하여 정확한 시간에 알림이 울립니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  활성 요일 설정
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  매일, 매주말, 매평일 또는 개별 요일을 선택하여 알림을 받을 수 있습니다. 필요 없는 날에는 알림이 울리지 않습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  체크리스트
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  준비할 항목을 체크리스트로 관리할 수 있습니다. 가방 챙기기, 과제 확인 등 준비할 항목을 미리 정리해두면 놓치는 일이 없습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  학사일정 관리
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  캘린더 연동으로 방학/학기 일정을 자동 관리할 수 있습니다. 방학 중에는 다른 시간으로 자동 전환되도록 설정할 수 있습니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  조용히 모드
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  알림은 받되 소리만 끌 수 있습니다. 조용한 환경에서도 알림을 놓치지 않으면서 방해받지 않을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 사용 예시 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              사용 예시
            </h2>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
                  예시 1: 등교 준비
                </h3>
                <div className="space-y-2 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>도착 시간:</strong> 08:00</p>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>이동 시간:</strong> 20분</p>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>준비 시간:</strong> 10분</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                  <p className="font-bold text-lg">→ 출발 시간: 07:30</p>
                  <p className="text-sm mt-2">Listo가 자동으로 계산하여 알림을 보내드립니다.</p>
                </div>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
                  예시 2: 방과 후 준비
                </h3>
                <div className="space-y-2 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>도착 시간:</strong> 15:00</p>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>이동 시간:</strong> 20분</p>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>준비 시간:</strong> 5분</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                  <p className="font-bold text-lg">→ 출발 시간: 14:35</p>
                  <p className="text-sm mt-2">준비 카드로 저장하면 매일 자동으로 알림을 받을 수 있습니다.</p>
                </div>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
                  예시 3: 주말 학원 준비
                </h3>
                <div className="space-y-2 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>도착 시간:</strong> 11:30</p>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>이동 시간:</strong> 15분</p>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>준비 시간:</strong> 10분</p>
                  <p><strong style={{ color: 'var(--color-on-background)' }}>활성 요일:</strong> 매주 토요일, 일요일</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary)', color: '#000000' }}>
                  <p className="font-bold text-lg">→ 출발 시간: 11:05</p>
                  <p className="text-sm mt-2">주말에만 알림을 받도록 설정할 수 있습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 개인정보 보호 섹션 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
                완벽한 개인정보 보호
              </h2>
              <div className="space-y-4 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                <p className="text-lg">
                  <strong style={{ color: 'var(--color-on-background)' }}>Listo는 서버를 운영하지 않습니다.</strong>
                </p>
                <p>
                  모든 데이터는 사용자의 기기 내부에만 저장됩니다. 서버로 전송되거나 외부로 수집되는 데이터는 없어 
                  개인정보 보호가 완벽하게 보장됩니다.
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
              지금 바로 시작하세요
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--color-on-surface-variant)' }}>
              Listo와 함께 시간을 효율적으로 관리하고, 중요한 일정을 놓치지 마세요!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://apps.apple.com/kr/app/listo/id6756487226"
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
                href="https://play.google.com/store/apps/details?id=net.aiharu.listo"
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

