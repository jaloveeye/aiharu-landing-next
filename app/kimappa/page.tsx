"use client";

import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";
import ApiKeyIssuance from "@/components/ApiKeyIssuance";
import ApiTest from "@/components/ApiTest";
import ApiManual from "@/components/ApiManual";

export default function KimappaPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">

        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <Title className="text-4xl md:text-5xl" style={{ color: 'var(--color-on-background)' }}>김아빠</Title>
          </div>
          <div className="p-8 md:p-10 max-w-3xl mx-auto border" style={{ 
            backgroundColor: 'var(--color-primary)', 
            color: '#000000',
            borderRadius: 'var(--border-radius-medium)',
            borderColor: 'var(--color-outline)'
          }}>
            <p className="text-2xl md:text-3xl font-bold mb-4">
              가족과 함께하는 특별한 모험을 시작하세요!
            </p>
            <p className="text-lg leading-relaxed mb-6">
              부모와 자녀가 협력하며 모험을 완료하고, 매일 새로운 놀이로
              소통하세요. AI가 만들어주는 맞춤형 모험과 함께 특별한 추억을
              만들어보세요.
            </p>
            <a
              href="https://apps.apple.com/kr/app/%EA%B9%80%EC%95%84%EB%B9%A0/id6755213272"
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
                김아빠는 무엇인가요?
              </h2>
              <div className="space-y-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                <p className="text-lg">
                  <strong style={{ color: 'var(--color-on-background)' }}>김아빠</strong>는 아빠와
                  아이의 <strong style={{ color: 'var(--color-on-background)' }}>'어색한 5분'</strong>
                  을{" "}
                  <strong style={{ color: 'var(--color-primary)' }}>'기다려지는 5분'</strong>
                  으로 바꾸는 관계 개선 플랫폼입니다.
                </p>
                <p>
                  김아빠는 아빠를 <strong style={{ color: 'var(--color-on-background)' }}>'비밀 요원'</strong>으로 만들어 아이와
                  함께 세상을 구하는 모험을 떠나게 합니다. 우리는 과제를 주는
                  서비스가 아닙니다. <strong style={{ color: 'var(--color-on-background)' }}>'함께한 시간'</strong>이라는 추억을
                  만들어주는 서비스입니다.
                </p>
                <p>
                  <strong style={{ color: 'var(--color-on-background)' }}>김아빠도</strong> 매일 새로운 놀이를 만들기 힘든 부모님들을 위해, 
                  AI가 자동으로 맞춤형 모험을 생성해드립니다. 테마만 선택하면 아이의 나이와 관심사에 맞는 
                  스토리, 수수께끼, 힌트가 한 번에 만들어집니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 가치 - 비밀 요원 역할 놀이 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              비밀 요원 역할 놀이
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  비밀 미션 부여
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  아빠에게 '육아'라는 짐 대신 '비밀 미션'을 부여합니다. 역할
                  놀이를 통해 어색함을 자연스럽게 해소합니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  하루 시작 습관
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  매일 아침 작고 사소한 미션으로 하루를 시작하는 습관을
                  형성합니다. 작은 성공이 모여 큰 변화를 만듭니다.
                </p>
              </div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  자연스러운 소통
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  역할 놀이를 통해 어색함 없이 자연스럽게 대화하고 웃을 수
                  있습니다. 미션을 통해 함께하는 시간을 만듭니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 추억 중심 설계 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              추억 중심 설계
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  과정이 더 중요합니다
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  미션의 성공 여부보다, 그 과정에서 나눈 대화와 웃음이 더
                  중요합니다. 함께한 시간 자체가 가장 소중한 추억이 됩니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  긍정적 경험
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  실패를 유머로 승화시키고, 시도 자체를 칭찬하는 긍정적 경험을
                  제공합니다. 완벽함보다는 함께한 노력이 인정받습니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  추억 저장
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  함께한 시간과 대화를 추억으로 저장합니다. 나중에 돌아보며 다시
                  웃을 수 있는 소중한 기록을 남깁니다.
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

            {/* 가족과 함께하는 모험 */}
            <div className="mb-10">
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
                  가족과 함께하는 모험
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      협력형 모험 게임
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      부모와 자녀가 함께 즐기는 협력형 모험 게임
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      5가지 사전 제작 템플릿
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      즉시 시작할 수 있는 5가지 모험 템플릿 제공
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      AI 맞춤형 생성
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      AI가 자동으로 맞춤형 모험 생성
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      직접 제작 가능
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      사용자가 직접 모험을 제작할 수 있습니다
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 일일 놀이 시스템 */}
            <div className="mb-10">
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
                  일일 놀이 시스템
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      매일 새로운 수수께끼
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      매일 새로운 수수께끼 놀이 생성
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      교육적 콘텐츠
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      자녀의 성장을 돕는 교육적 콘텐츠
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      마법사탕과 배지
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      마법사탕과 배지로 동기부여
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      가족 간 송수신
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      가족 구성원 간 놀이 송수신
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 안전한 환경 */}
            <div>
              <div className="p-6 border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
                  안전한 환경
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      개인정보 보호
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      개인정보 보호 및 암호화
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      가족 전용 공간
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      가족 구성원만 접근 가능한 안전한 공간
                    </p>
                  </div>
                  <div className="p-4 border" style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                      안전한 소통
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      안전한 가족 커뮤니케이션
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 메시지 강조 */}
        <section className="mb-16">
          <div className="p-8 md:p-12 border" style={{ 
            backgroundColor: 'var(--color-primary)', 
            color: '#000000',
            borderRadius: 'var(--border-radius-medium)',
            borderColor: 'var(--color-outline)'
          }}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                어색한 5분을 기다려지는 5분으로
              </h2>
              <p className="text-xl mb-4">
                김아빠는 과제를 주는 서비스가 아닙니다
              </p>
              <p className="text-lg">
                <strong>'함께한 시간'</strong>이라는 추억을 만들어주는
                서비스입니다
              </p>
            </div>
          </div>
        </section>

        {/* 사용 가이드 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              사용 가이드
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  1. 계정 생성 및 가족 초대
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  앱을 처음 실행하면 계정을 생성할 수 있습니다. 가족 구성원을 초대하려면 
                  '가족 관리' 메뉴에서 QR 코드나 초대 코드를 생성하여 공유하세요.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  2. 모험 만들기
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  '탐험대' 메뉴에서 AI로 모험을 만들거나 사전 제작된 템플릿을 선택할 수 있습니다. 
                  테마, 아이 나이, 기간을 선택하면 AI가 맞춤형 모험을 생성합니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  3. 일일 놀이 시작
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  '놀이' 메뉴에서 매일 새로운 수수께끼 놀이를 확인할 수 있습니다. 
                  아이가 수수께끼를 풀고 아빠에게 보여주면 함께 대화하며 모험을 이어갈 수 있습니다.
                </p>
              </div>
              <div className="p-6 border-l-4" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderLeftColor: 'var(--color-primary)',
                borderRadius: 'var(--border-radius-medium)',
                borderColor: 'var(--color-outline)'
              }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                  4. 보상 및 성취
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  놀이를 완료하면 마법사탕을 획득하고, 연속 달성 시 보너스를 받을 수 있습니다. 
                  다양한 성취 배지를 수집하여 동기부여를 유지하세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 앱 스크린샷 섹션 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              앱 미리보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 온보딩 화면 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--color-outline)' }}>
                  <Image
                    src="/kimappa/screenshot-onboarding.png"
                    alt="온보딩 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>온보딩</h3>
                <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                  앱 사용법을 안내하는 환영 화면
                </p>
              </div>

              {/* 대시보드 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--color-outline)' }}>
                  <Image
                    src="/kimappa/screenshot-dashboard.png"
                    alt="대시보드 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>대시보드</h3>
                <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                  빠른 시작과 최근 활동을 한눈에
                </p>
              </div>

              {/* 모험 만들기 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--color-outline)' }}>
                  <Image
                    src="/kimappa/screenshot-adventure.png"
                    alt="모험 만들기 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>모험 만들기</h3>
                <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                  AI로 맞춤형 모험을 생성하거나 템플릿 선택
                </p>
              </div>

              {/* 가족 관리 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--color-outline)' }}>
                  <Image
                    src="/kimappa/screenshot-family.png"
                    alt="가족 관리 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>가족 관리</h3>
                <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                  QR 코드나 초대 코드로 가족 초대
                </p>
              </div>

              {/* 프로필 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--color-outline)' }}>
                  <Image
                    src="/kimappa/screenshot-profile.png"
                    alt="프로필 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>프로필</h3>
                <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                  개인정보 및 가족 관리 설정
                </p>
              </div>

              {/* AI 모험 생성 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--color-outline)' }}>
                  <Image
                    src="/kimappa/screenshot-ai-create.png"
                    alt="AI 모험 생성 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>AI 모험 생성</h3>
                <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                  테마와 아이 나이에 맞는 모험 자동 생성
                </p>
              </div>

              {/* 로그인 */}
              <div className="flex flex-col items-center sm:col-span-2 lg:col-span-1">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--color-outline)' }}>
                  <Image
                    src="/kimappa/screenshot-login.png"
                    alt="로그인 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>로그인</h3>
                <p className="text-sm text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                  간편한 로그인 및 게스트 체험
                </p>
              </div>
            </div>
            
            {/* App Store 다운로드 버튼 */}
            <div className="mt-10 text-center">
              <a
                href="https://apps.apple.com/kr/app/%EA%B9%80%EC%95%84%EB%B9%A0/id6755213272"
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
            </div>
          </div>
        </section>

        {/* API 섹션 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-outline)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#000000' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-on-background)' }}>
                  김아빠 API
                </h2>
              </div>
              <p className="text-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
                AI 기반 모험 및 퀴즈 생성 API로 김아빠의 기능을 직접 활용해보세요
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
              {/* API 소개 */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
                  API 소개
                </h3>
                <div className="p-6 border" style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                    김아빠는 모험과 퀴즈 생성을 AI로 자동화합니다. API를 발급받으면 
                    애플리케이션에서 직접 모험 게임과 수수께끼를 생성할 수 있습니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border" style={{ 
                      backgroundColor: 'var(--color-background)', 
                      borderColor: 'var(--color-outline)',
                      borderRadius: 'var(--border-radius-medium)'
                    }}>
                      <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                        모험 생성
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        테마, 아이 나이, 기간에 맞춘 완전한 모험 게임을 자동으로 생성합니다.
                      </p>
                    </div>
                    <div className="p-4 border" style={{ 
                      backgroundColor: 'var(--color-background)', 
                      borderColor: 'var(--color-outline)',
                      borderRadius: 'var(--border-radius-medium)'
                    }}>
                      <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>
                        퀴즈 생성
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        수수께끼, 암호, 퍼즐, 수학 문제를 아이 나이에 맞게 생성합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* API 키 발급 */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
                  API 키 발급
                </h3>
                <ApiKeyIssuance />
              </div>

              {/* API 테스트 */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
                  API 테스트
                </h3>
                <ApiTest />
              </div>

              {/* API 매뉴얼 */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
                  API 매뉴얼
                </h3>
                <ApiManual />
              </div>

            </div>
          </div>
        </section>

        {/* 지원 및 문의 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              지원 및 문의
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border" style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                    문의하기
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    앱 사용 중 문제가 발생하거나 문의사항이 있으시면 언제든지 연락해주세요.
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    이메일:{" "}
                    <a
                      href="mailto:jaloveeye@gmail.com"
                      className="underline"
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      jaloveeye@gmail.com
                    </a>
                  </p>
                </div>
                <div className="p-6 border" style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                    피드백
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    김아빠를 더 나은 서비스로 만들기 위한 여러분의 소중한 의견을 기다립니다.
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    피드백을 보내주시면 검토 후 반영하겠습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 법적 정보 */}
        <section className="mb-16">
          <div className="border p-8 md:p-12" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'var(--color-outline)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-on-background)' }}>
              법적 정보
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="p-6 border" style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                    개인정보 보호 정책
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    김아빠는 사용자의 개인정보를 보호하기 위해 최선을 다합니다. 
                    수집된 정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
                  </p>
                  <a
                    href="https://connect-policy.aiharu.net/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold inline-flex items-center gap-1"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    전체 개인정보 보호 정책 보기 →
                  </a>
                </div>
                <div className="p-6 border" style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                    서비스 이용 약관
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    김아빠 서비스를 이용하기 전에 서비스 이용 약관을 확인해주세요.
                  </p>
                  <a
                    href="https://connect-policy.aiharu.net/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold inline-flex items-center gap-1"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    전체 서비스 이용 약관 보기 →
                  </a>
                </div>
                <div className="p-6 border" style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-on-background)' }}>
                    데이터 삭제 요청
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    계정 및 개인정보 삭제를 원하시면 언제든지 요청하실 수 있습니다.
                  </p>
                  <Link
                    href="/kimappa/data-deletion"
                    className="font-semibold inline-flex items-center gap-1"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    데이터 삭제 요청하기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
