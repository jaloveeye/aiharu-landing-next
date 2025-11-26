"use client";

import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { Metadata } from "next";
import { commonMetadata } from "@/app/metadata/common";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function CreatorPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>
            {t("creator.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t("creator.description")}
          </p>
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://jaloveeye.aiharu.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-primary)', color: '#000000', borderRadius: 'var(--border-radius-medium)' }}
              title="포트폴리오 웹사이트"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span className="text-sm font-semibold">포트폴리오</span>
            </a>
          </div>
        </div>

        {/* 제작자 프로필 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                  김형진 (Kim Hyung Jin)
                </h2>
                <p className="text-xl mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
                  개발을 좋아하는 컴퓨터 과학자
                </p>

                <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
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
                  <p className="text-lg font-medium mt-6 p-4 rounded-medium border-l-4" style={{ backgroundColor: 'var(--color-surface)', borderLeftColor: 'var(--color-primary)', color: 'var(--color-on-surface)' }}>
                    코드와 사용자 경험을 잇는 개발자이자, 지금은 육아휴직으로
                    아이와 함께 성장 중인 아빠입니다.
                    <br />
                    육아를 통해 배우며, 더 단단해진 시선으로 기술과 삶의 균형을
                    탐구하며 다음 여정을 준비하고 있습니다.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
                    Frontend Engineering
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
                    Computer Vision
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
                    Mobile Development
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center">
                <div className="w-48 h-48 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <span className="text-6xl">👨‍💻</span>
                </div>
                <p style={{ color: 'var(--color-on-surface-variant)' }}>"기술로 가족을 더 행복하게"</p>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 경력 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-on-surface)' }}>
              주요 경력
            </h2>
            <div className="space-y-8">
              <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--color-primary)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>infobank</h3>
                  <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    2008 - 현재 (17년)
                  </span>
                </div>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                  Frontend Engineer / Software Developer
                </p>
                <p className="text-sm mb-3 font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                  🍼 현재 육아휴직 중 - 소프트웨어 엔지니어링 경력의 새로운 장을
                  준비하며 새로운 통찰과 관점을 얻고 있습니다
                </p>
                <div className="space-y-3" style={{ color: 'var(--color-on-surface-variant)' }}>
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
                    broadcasting-related information, 자율주행 레미콘 차량의
                    운행 관제 방법 및 그를 수행하는 서버
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

              <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--color-secondary)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
                    한양대학교
                  </h3>
                  <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    2006 - 2008 (2년)
                  </span>
                </div>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                  Computer Vision and Pattern Recognition
                </p>
                <div className="space-y-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p>
                    <strong>Bridge Inspection Robot Development:</strong> 다리
                    균열 검출 알고리즘 제안 및 소프트웨어 개발
                  </p>
                  <p>
                    <strong>특허:</strong> METHOD AND APPARATUS FOR COMPLETING
                    IMAGE WITH STRUCTURE ESTIMATION, SYSTEM AND METHOD FOR
                    SYNTHESIS OF FACE EXPRESSION USING NONLINEAR REGRESSION
                    ANALYSIS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 제작 동기 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-on-surface)' }}>
              아이하루를 만든 이유
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                      AI 학습의 접근성
                    </h3>
                    <p style={{ color: 'var(--color-on-surface-variant)' }}>
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
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
                      가족과의 소중한 시간
                    </h3>
                    <p style={{ color: 'var(--color-on-surface-variant)' }}>
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
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-on-surface)' }}>
              기술 스택
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-medium" style={{ backgroundColor: 'var(--color-surface)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                  Frontend
                </h3>
                <div className="space-y-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p>• React / Next.js</p>
                  <p>• TypeScript</p>
                  <p>• Redux / React Query</p>
                  <p>• Stomp (WebSocket)</p>
                  <p>• Tailwind CSS</p>
                </div>
              </div>

              <div className="text-center p-6 rounded-medium" style={{ backgroundColor: 'var(--color-surface)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                  Mobile & Backend
                </h3>
                <div className="space-y-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p>• Android (Kotlin)</p>
                  <p>• MVVM / RxJava</p>
                  <p>• Apache Spark</p>
                  <p>• Scala / Airflow</p>
                  <p>• WebRTC</p>
                </div>
              </div>

              <div className="text-center p-6 rounded-medium" style={{ backgroundColor: 'var(--color-surface)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                  AI & Computer Vision
                </h3>
                <div className="space-y-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <p>• Computer Vision</p>
                  <p>• Pattern Recognition</p>
                  <p>• Bridge Crack Detection</p>
                  <p>• Face Expression Synthesis</p>
                  <p>• Iris Recognition</p>
                </div>
              </div>

              <div className="text-center p-6 rounded-medium" style={{ backgroundColor: 'var(--color-surface)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                  Domain Expertise
                </h3>
                <div className="space-y-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
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

        {/* 포트폴리오 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-outline)' }}>
            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
              🎨 포트폴리오
            </h2>
            <p className="text-center mb-8" style={{ color: 'var(--color-on-surface-variant)' }}>
              더 많은 프로젝트와 작업물을 확인해보세요
            </p>
            <div className="flex justify-center mb-8">
              <a
                href="https://jaloveeye.aiharu.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold transition-all duration-300"
                style={{ backgroundColor: 'var(--color-primary)', color: '#000000', borderRadius: 'var(--border-radius-medium)' }}
              >
                <svg
                  className="mr-3 w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span>포트폴리오 웹사이트</span>
              </a>
            </div>
          </div>
        </section>

        {/* 연락처 및 링크 */}
        <section className="mb-16">
          <div className="rounded-medium border p-8 md:p-12" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-outline)' }}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-on-surface)' }}>
              연락처 및 링크
            </h2>
            <div className="flex justify-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <a
                    href="mailto:jaloveeye@gmail.com"
                    className="transition-colors text-lg"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    jaloveeye@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <a
                    href="https://github.com/jaloveeye/aiharu-landing-next"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors text-lg"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    GitHub Repository
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <a
                    href="https://www.linkedin.com/in/hyungjin-kim-6a1a2011a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors text-lg"
                    style={{ color: 'var(--color-on-surface)' }}
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
          <div className="rounded-medium p-8 md:p-12" style={{ backgroundColor: 'var(--color-primary)' }}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#000000' }}>함께 성장해요!</h2>
            <p className="text-xl mb-8" style={{ color: '#000000', opacity: 0.8 }}>
              여러분의 피드백과 제안은 아이하루를 더 나은 서비스로 만들어갑니다.
              <br />
              언제든지 연락주세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:jaloveeye@gmail.com"
                className="px-8 py-4 font-bold transition-colors"
                style={{ backgroundColor: '#FFFFFF', color: '#000000', borderRadius: 'var(--border-radius-medium)' }}
              >
                이메일 보내기
              </a>
              <Link
                href="/about"
                className="px-8 py-4 border-2 font-bold transition-colors"
                style={{ borderColor: '#000000', color: '#000000', backgroundColor: 'transparent', borderRadius: 'var(--border-radius-medium)' }}
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
