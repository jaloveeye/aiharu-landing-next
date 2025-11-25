"use client";

import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";

export default function KimappaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors mb-8"
        >
          홈으로 돌아가기
        </Link>

        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🕵️</div>
          <Title className="mb-6 text-green-800">김아빠</Title>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
            <p className="text-2xl font-bold mb-4">
              가족과 함께하는 특별한 모험을 시작하세요!
            </p>
            <p className="text-lg opacity-90 leading-relaxed">
              부모와 자녀가 협력하며 모험을 완료하고, 매일 새로운 놀이로
              소통하세요. AI가 만들어주는 맞춤형 모험과 함께 특별한 추억을
              만들어보세요.
            </p>
          </div>
        </div>

        {/* 서비스 소개 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
                김아빠는 무엇인가요?
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-green-800">김아빠</strong>는 아빠와
                  아이의 <strong className="text-gray-600">'어색한 5분'</strong>
                  을
                  <strong className="text-green-600"> '기다려지는 5분'</strong>
                  으로 바꾸는 관계 개선 플랫폼입니다.
                </p>
                <p>
                  김아빠는 아빠를 <strong>'비밀 요원'</strong>으로 만들어 아이와
                  함께 세상을 구하는 모험을 떠나게 합니다. 우리는 과제를 주는
                  서비스가 아닙니다. <strong>'함께한 시간'</strong>이라는 추억을
                  만들어주는 서비스입니다.
                </p>
                <p>
                  <strong className="text-green-800">김아빠도</strong> 매일 새로운 놀이를 만들기 힘든 부모님들을 위해, 
                  AI가 자동으로 맞춤형 모험을 생성해드립니다. 테마만 선택하면 아이의 나이와 관심사에 맞는 
                  스토리, 수수께끼, 힌트가 한 번에 만들어집니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 가치 - 비밀 요원 역할 놀이 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
              🎭 비밀 요원 역할 놀이
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300">
                <div className="text-4xl mb-4 text-center">🎯</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                  비밀 미션 부여
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-center">
                  아빠에게 '육아'라는 짐 대신 '비밀 미션'을 부여합니다. 역할
                  놀이를 통해 어색함을 자연스럽게 해소합니다.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
                <div className="text-4xl mb-4 text-center">🌅</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                  하루 시작 습관
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-center">
                  매일 아침 작고 사소한 미션으로 하루를 시작하는 습관을
                  형성합니다. 작은 성공이 모여 큰 변화를 만듭니다.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-300">
                <div className="text-4xl mb-4 text-center">🤝</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                  자연스러운 소통
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed text-center">
                  역할 놀이를 통해 어색함 없이 자연스럽게 대화하고 웃을 수
                  있습니다. 미션을 통해 함께하는 시간을 만듭니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 추억 중심 설계 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
              💝 추억 중심 설계
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span> 과정이 더 중요합니다
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  미션의 성공 여부보다, 그 과정에서 나눈 대화와 웃음이 더
                  중요합니다. 함께한 시간 자체가 가장 소중한 추억이 됩니다.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>😊</span> 긍정적 경험
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  실패를 유머로 승화시키고, 시도 자체를 칭찬하는 긍정적 경험을
                  제공합니다. 완벽함보다는 함께한 노력이 인정받습니다.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📸</span> 추억 저장
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  함께한 시간과 대화를 추억으로 저장합니다. 나중에 돌아보며 다시
                  웃을 수 있는 소중한 기록을 남깁니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
              ✨ 주요 기능
            </h2>

            {/* 가족과 함께하는 모험 */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span>🎮</span> 가족과 함께하는 모험
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      협력형 모험 게임
                    </p>
                    <p className="text-sm text-gray-600">
                      부모와 자녀가 함께 즐기는 협력형 모험 게임
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      5가지 사전 제작 템플릿
                    </p>
                    <p className="text-sm text-gray-600">
                      즉시 시작할 수 있는 5가지 모험 템플릿 제공
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      AI 맞춤형 생성
                    </p>
                    <p className="text-sm text-gray-600">
                      AI가 자동으로 맞춤형 모험 생성
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      직접 제작 가능
                    </p>
                    <p className="text-sm text-gray-600">
                      사용자가 직접 모험을 제작할 수 있습니다
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 일일 놀이 시스템 */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span>🎲</span> 일일 놀이 시스템
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      매일 새로운 수수께끼
                    </p>
                    <p className="text-sm text-gray-600">
                      매일 새로운 수수께끼 놀이 생성
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      교육적 콘텐츠
                    </p>
                    <p className="text-sm text-gray-600">
                      자녀의 성장을 돕는 교육적 콘텐츠
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      마법사탕과 배지
                    </p>
                    <p className="text-sm text-gray-600">
                      마법사탕과 배지로 동기부여
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      가족 간 송수신
                    </p>
                    <p className="text-sm text-gray-600">
                      가족 구성원 간 놀이 송수신
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 실시간 소통 및 보상 시스템 섹션은 현재 숨김 */}

            {/* 안전한 환경 */}
            <div>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span>🔒</span> 안전한 환경
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      개인정보 보호
                    </p>
                    <p className="text-sm text-gray-600">
                      개인정보 보호 및 암호화
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      가족 전용 공간
                    </p>
                    <p className="text-sm text-gray-600">
                      가족 구성원만 접근 가능한 안전한 공간
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      안전한 소통
                    </p>
                    <p className="text-sm text-gray-600">
                      안전한 가족 커뮤니케이션
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 메시지 강조 */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                어색한 5분을 기다려지는 5분으로
              </h2>
              <p className="text-xl mb-4 opacity-90">
                김아빠는 과제를 주는 서비스가 아닙니다
              </p>
              <p className="text-lg opacity-80">
                <strong>'함께한 시간'</strong>이라는 추억을 만들어주는
                서비스입니다
              </p>
            </div>
          </div>
        </section>

        {/* 사용 가이드 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
              📖 사용 가이드
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  1. 계정 생성 및 가족 초대
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  앱을 처음 실행하면 계정을 생성할 수 있습니다. 가족 구성원을 초대하려면 
                  '가족 관리' 메뉴에서 QR 코드나 초대 코드를 생성하여 공유하세요.
                </p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  2. 모험 만들기
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  '탐험대' 메뉴에서 AI로 모험을 만들거나 사전 제작된 템플릿을 선택할 수 있습니다. 
                  테마, 아이 나이, 기간을 선택하면 AI가 맞춤형 모험을 생성합니다.
                </p>
              </div>
              <div className="p-6 bg-teal-50 rounded-xl border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  3. 일일 놀이 시작
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  '놀이' 메뉴에서 매일 새로운 수수께끼 놀이를 확인할 수 있습니다. 
                  아이가 수수께끼를 풀고 아빠에게 보여주면 함께 대화하며 모험을 이어갈 수 있습니다.
                </p>
              </div>
              <div className="p-6 bg-cyan-50 rounded-xl border-l-4 border-cyan-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  4. 보상 및 성취
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  놀이를 완료하면 마법사탕을 획득하고, 연속 달성 시 보너스를 받을 수 있습니다. 
                  다양한 성취 배지를 수집하여 동기부여를 유지하세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 앱 스크린샷 섹션 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
              📱 앱 미리보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {/* 온보딩 화면 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg mb-4">
                  <Image
                    src="/kimappa/screenshot-onboarding.png"
                    alt="온보딩 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">온보딩</h3>
                <p className="text-sm text-gray-600 text-center">
                  앱 사용법을 안내하는 환영 화면
                </p>
              </div>

              {/* 대시보드 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg mb-4">
                  <Image
                    src="/kimappa/screenshot-dashboard.png"
                    alt="대시보드 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">대시보드</h3>
                <p className="text-sm text-gray-600 text-center">
                  빠른 시작과 최근 활동을 한눈에
                </p>
              </div>

              {/* 모험 만들기 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg mb-4">
                  <Image
                    src="/kimappa/screenshot-adventure.png"
                    alt="모험 만들기 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">모험 만들기</h3>
                <p className="text-sm text-gray-600 text-center">
                  AI로 맞춤형 모험을 생성하거나 템플릿 선택
                </p>
              </div>

              {/* 가족 관리 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg mb-4">
                  <Image
                    src="/kimappa/screenshot-family.png"
                    alt="가족 관리 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">가족 관리</h3>
                <p className="text-sm text-gray-600 text-center">
                  QR 코드나 초대 코드로 가족 초대
                </p>
              </div>

              {/* 프로필 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg mb-4">
                  <Image
                    src="/kimappa/screenshot-profile.png"
                    alt="프로필 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">프로필</h3>
                <p className="text-sm text-gray-600 text-center">
                  개인정보 및 가족 관리 설정
                </p>
              </div>

              {/* AI 모험 생성 */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg mb-4">
                  <Image
                    src="/kimappa/screenshot-ai-create.png"
                    alt="AI 모험 생성 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">AI 모험 생성</h3>
                <p className="text-sm text-gray-600 text-center">
                  테마와 아이 나이에 맞는 모험 자동 생성
                </p>
              </div>

              {/* 로그인 */}
              <div className="flex flex-col items-center sm:col-span-2 lg:col-span-1">
                <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg mb-4">
                  <Image
                    src="/kimappa/screenshot-login.png"
                    alt="로그인 화면"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">로그인</h3>
                <p className="text-sm text-gray-600 text-center">
                  간편한 로그인 및 게스트 체험
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 지원 및 문의 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
              💬 지원 및 문의
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    문의하기
                  </h3>
                  <p className="text-gray-700 mb-4">
                    앱 사용 중 문제가 발생하거나 문의사항이 있으시면 언제든지 연락해주세요.
                  </p>
                  <p className="text-sm text-gray-600">
                    이메일:{" "}
                    <a
                      href="mailto:jaloveeye@gmail.com"
                      className="text-green-600 hover:text-green-700 underline"
                    >
                      jaloveeye@gmail.com
                    </a>
                  </p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    피드백
                  </h3>
                  <p className="text-gray-700 mb-4">
                    김아빠를 더 나은 서비스로 만들기 위한 여러분의 소중한 의견을 기다립니다.
                  </p>
                  <p className="text-sm text-gray-600">
                    피드백을 보내주시면 검토 후 반영하겠습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 법적 정보 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
              📋 법적 정보
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    개인정보 보호 정책
                  </h3>
                  <p className="text-gray-700 mb-4">
                    김아빠는 사용자의 개인정보를 보호하기 위해 최선을 다합니다. 
                    수집된 정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
                  </p>
                  <a
                    href="https://connect-policy.aiharu.net/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1"
                  >
                    전체 개인정보 보호 정책 보기 →
                  </a>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    서비스 이용 약관
                  </h3>
                  <p className="text-gray-700 mb-4">
                    김아빠 서비스를 이용하기 전에 서비스 이용 약관을 확인해주세요.
                  </p>
                  <a
                    href="https://connect-policy.aiharu.net/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1"
                  >
                    전체 서비스 이용 약관 보기 →
                  </a>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    데이터 삭제 요청
                  </h3>
                  <p className="text-gray-700 mb-4">
                    계정 및 개인정보 삭제를 원하시면 언제든지 요청하실 수 있습니다.
                  </p>
                  <Link
                    href="/kimappa/data-deletion"
                    className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1"
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
