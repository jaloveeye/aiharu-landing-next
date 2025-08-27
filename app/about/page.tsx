import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";

export const metadata: Metadata = {
  ...commonMetadata,
  title: "서비스 소개 - aiharu 아이하루 | aiharu.net",
  description: "aiharu(아이하루)의 서비스 소개입니다. AI하루와 아이하루의 특징과 기능을 자세히 알아보세요.",
  openGraph: {
    ...commonMetadata.openGraph,
    title: "서비스 소개 - aiharu 아이하루 | aiharu.net",
    description: "aiharu(아이하루)의 서비스 소개입니다. AI하루와 아이하루의 특징과 기능을 자세히 알아보세요.",
    url: "https://aiharu.net/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link
          href="/"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 transition-colors"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="text-center mb-16">
          <Title className="mb-6">aiharu 서비스 소개</Title>
          <Body className="text-lg text-gray-700 max-w-3xl mx-auto">
            aiharu는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물하는 서비스입니다.
          </Body>
        </div>

        {/* AI하루 섹션 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-green-700 mb-4">🤖 AI하루</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  매일 하나씩, 쉽게 배우는 AI
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    AI하루는 복잡한 AI 기술을 매일 한 문장으로 쉽게 배울 수 있도록 도와줍니다.
                    프롬프트 작성법, AI 도구 활용법, 실생활 적용 팁까지!
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">주요 기능</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• 매일 업데이트되는 AI 지식 콘텐츠</li>
                      <li>• 실용적인 프롬프트 예제 모음</li>
                      <li>• AI 도구 추천 및 활용 가이드</li>
                      <li>• 일상생활에 적용할 수 있는 AI 팁</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/ai"
                    className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    AI하루 시작하기
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">🤖</div>
                <p className="text-gray-600">AI와 함께하는 똑똑한 하루</p>
              </div>
            </div>
          </div>
        </section>

        {/* 아이하루 섹션 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-yellow-700 mb-4">👨‍👩‍👧‍👦 아이하루</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  부모와 아이가 함께 만드는 습관
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    아이하루는 부모와 아이가 함께 목표를 세우고, 
                    매일의 습관을 체크하며 성장하는 과정을 지원합니다.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">주요 기능</h4>
                    <ul className="space-y-1 text-yellow-700">
                      <li>• 부모-아이 함께하는 목표 설정</li>
                      <li>• 매일 습관 체크 및 달성률 확인</li>
                      <li>• 부모의 피드백과 칭찬 시스템</li>
                      <li>• 포인트 기반 보상 시스템</li>
                      <li>• 주간/월간 성장 리포트</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="https://hanip.aiharu.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    아이하루 시작하기
                  </a>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-gray-600">가족과 함께하는 따뜻한 하루</p>
              </div>
            </div>
          </div>
        </section>

        {/* 식단 분석 섹션 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-blue-700 mb-4">🍽️ AI 식단 분석</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  AI가 분석하는 맞춤형 영양 정보
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    식단 사진을 업로드하면 AI가 자동으로 분석하여 
                    영양 정보와 건강한 식단을 추천해드립니다.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">주요 기능</h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>• 사진 기반 자동 식단 분석</li>
                      <li>• 11가지 영양소 상세 분석</li>
                      <li>• 개인 맞춤형 식단 추천</li>
                      <li>• 영양소 섭취 트렌드 분석</li>
                      <li>• 건강한 식습관 가이드</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/breakfast"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    식단 분석 시작하기
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-8xl mb-4">🍽️</div>
                <p className="text-gray-600">AI가 분석하는 건강한 식단</p>
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 특징 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              aiharu만의 특별한 특징
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">목적 지향적</h3>
                <p className="text-gray-600">
                  AI 학습과 습관 형성이라는 명확한 목표를 가지고 
                  체계적으로 설계된 서비스입니다.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">가족 중심</h3>
                <p className="text-gray-600">
                  부모와 아이가 함께 성장할 수 있도록 
                  가족 중심의 서비스로 설계되었습니다.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">AI 기반</h3>
                <p className="text-gray-600">
                  최신 AI 기술을 활용하여 
                  개인화된 경험을 제공합니다.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">데이터 기반</h3>
                <p className="text-gray-600">
                  사용자의 데이터를 분석하여 
                  더 나은 서비스를 제공합니다.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">안전한</h3>
                <p className="text-gray-600">
                  개인정보 보호를 최우선으로 하며 
                  안전한 서비스를 제공합니다.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">무료 서비스</h3>
                <p className="text-gray-600">
                  모든 기능을 무료로 제공하여 
                  누구나 쉽게 이용할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 시작해보세요!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              aiharu와 함께 더 똑똑하고 따뜻한 하루를 만들어가요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                무료 회원가입
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                로그인하기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
