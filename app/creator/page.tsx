"use client";

import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function CreatorPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Link
          href="/"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 transition-colors"
        >
          ← 홈으로 돌아가기
        </Link>

        <div className="text-center mb-16">
          <Title className="mb-6">{t("creator.title")}</Title>
          <Body className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t("creator.description")}
          </Body>
        </div>

        {/* 제작자 프로필 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  김형진 (Kim Hyung Jin)
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  개발을 좋아하는 컴퓨터 과학자
                </p>

                <div className="space-y-4 text-gray-700">
                  <p>{t("creator.intro")}</p>
                  <p>
                    한양대학교에서 Computer Vision and Pattern Recognition을
                    전공했으며, 현재는 infobank에서 Frontend Engineer로 17년간
                    근무하고 있습니다. 자율주행차 제어 서비스, 모바일 앱 개발,
                    방송 미디어 R&D 등 다양한 분야에서 개발 경험을 쌓아왔습니다.
                  </p>
                  <p>
                    최근에는 육아휴직 중이지만, 이 시간을 활용해 가족과 함께
                    성장할 수 있는 의미 있는 서비스를 개발하고 있습니다. 기술의
                    발전과 가족의 소중한 시간을 조화롭게 결합하여 더 나은 세상을
                    만들어가고 싶습니다.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Frontend Engineering
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Computer Vision
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Mobile Development
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center">
                <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-6xl">👨‍💻</span>
                </div>
                <p className="text-gray-600">"기술로 가족을 더 행복하게"</p>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 경력 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              주요 경력
            </h2>
            <div className="space-y-8">
              <div className="border-l-4 border-green-500 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">infobank</h3>
                  <span className="text-sm text-gray-500">
                    2008 - 현재 (17년)
                  </span>
                </div>
                <p className="text-lg font-semibold text-green-700 mb-2">
                  Frontend Engineer / Software Developer
                </p>
                <p className="text-sm text-yellow-600 mb-3 font-medium">
                  🍼 현재 육아휴직 중 - 소프트웨어 엔지니어링 경력의 새로운 장을
                  준비하며 새로운 통찰과 관점을 얻고 있습니다
                </p>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>자율주행차 제어 서비스 (2022-2025):</strong> React,
                    Redux, React Query, Next.js, TypeScript, Stomp를 활용한
                    실시간 차량 모니터링 및 제어 시스템 개발
                  </p>
                  <p>
                    <strong>모바일 앱 개발:</strong> Majung(자율주행 택시),
                    Duckzil, Moyamo, Blink 등 Kotlin, MVVM, RxJava 기반 앱 개발
                  </p>
                  <p>
                    <strong>방송 미디어 R&D:</strong> TV/라디오 참여형
                    인터랙티브 소프트웨어 개발 (KBS, MBC, SBS, EBS, TvN, Mnet 등
                    TV 방송국 및 라디오 방송)
                  </p>
                  <p>
                    <strong>데이터 엔지니어링:</strong> Apache Spark, Airflow,
                    Scala, Zeppelin, KNIME을 활용한 분산 처리 시스템 설계
                  </p>
                  <p>
                    <strong>특허:</strong> Service system for
                    broadcasting-related information, 자율주행 레미콘 차량의 운행 관제 방법 및 그를 수행하는 서버
                  </p>
                  <p>
                    <strong>Good Software 인증 (TTA):</strong> "ViewCube"
                    (2024), "M& STUDIO" (2009)
                  </p>
                  <p>
                    <strong>오픈소스 기여:</strong> react-grid-layout,
                    airbnb/showkase
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    한양대학교
                  </h3>
                  <span className="text-sm text-gray-500">
                    2006 - 2008 (2년)
                  </span>
                </div>
                <p className="text-lg font-semibold text-blue-700 mb-2">
                  Computer Vision and Pattern Recognition
                </p>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Bridge Inspection Robot Development:</strong> 다리
                    균열 검출 알고리즘 제안 및 소프트웨어 개발
                  </p>
                  <p>
                    <strong>특허:</strong> METHOD AND APPARATUS FOR COMPLETING
                    IMAGE WITH STRUCTURE ESTIMATION, SYSTEM AND METHOD FOR SYNTHESIS OF
                    FACE EXPRESSION USING NONLINEAR REGRESSION ANALYSIS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 제작 동기 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              아이하루를 만든 이유
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                      AI 학습의 접근성
                    </h3>
                    <p className="text-gray-700">
                      Computer Vision과 Pattern Recognition을 전공했지만, AI
                      기술이 빠르게 발전하면서 일반인들이 쉽게 접근하기 어려운
                      현실을 보았습니다. 매일 조금씩, 쉽게 배울 수 있는 방법을
                      만들고 싶었습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">👨‍👩‍👧‍👦</div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-700 mb-2">
                      가족과의 소중한 시간
                    </h3>
                    <p className="text-gray-700">
                      17년간의 개발 경험을 바탕으로, 현재 육아휴직 중인 이
                      시간을 활용해 부모와 아이가 함께 성장할 수 있는 의미 있는
                      서비스를 만들고 싶었습니다. 기술과 가족의 가치를 조화롭게
                      결합하고 싶습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 기술 스택 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              기술 스택
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Frontend
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• React / Next.js</p>
                  <p>• TypeScript</p>
                  <p>• Redux / React Query</p>
                  <p>• Stomp (WebSocket)</p>
                  <p>• Tailwind CSS</p>
                </div>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Mobile & Backend
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Android (Kotlin)</p>
                  <p>• MVVM / RxJava</p>
                  <p>• Apache Spark</p>
                  <p>• Scala / Airflow</p>
                  <p>• WebRTC</p>
                </div>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  AI & Computer Vision
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Computer Vision</p>
                  <p>• Pattern Recognition</p>
                  <p>• Bridge Crack Detection</p>
                  <p>• Face Expression Synthesis</p>
                  <p>• Iris Recognition</p>
                </div>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Domain Expertise
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Autonomous Vehicles</p>
                  <p>• Broadcasting & Media</p>
                  <p>• Mobility Services</p>
                  <p>• Real-time Systems</p>
                  <p>• Patent Holder</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 연락처 및 링크 */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              연락처 및 링크
            </h2>
            <div className="flex justify-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <a
                    href="mailto:jaloveeye@gmail.com"
                    className="text-green-600 hover:text-green-800 transition-colors text-lg"
                  >
                    jaloveeye@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <a
                    href="https://github.com/jaloveeye/aiharu-landing-next"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 transition-colors text-lg"
                  >
                    GitHub Repository
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <a
                    href="https://www.linkedin.com/in/hyungjin-kim-6a1a2011a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 transition-colors text-lg"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 메시지 */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">함께 성장해요!</h2>
            <p className="text-xl mb-8 opacity-90">
              여러분의 피드백과 제안은 아이하루를 더 나은 서비스로 만들어갑니다.
              <br />
              언제든지 연락주세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:jaloveeye@gmail.com"
                className="px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                이메일 보내기
              </a>
              <Link
                href="/about"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                서비스 소개 보기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
