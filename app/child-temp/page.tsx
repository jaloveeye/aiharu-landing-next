import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { commonMetadata } from "@/app/metadata/common";

export const metadata = {
  ...commonMetadata,
  title: "아이하루 - 준비 중 | aiharu.net",
  description: "아이하루 서비스가 준비 중입니다. 곧 만나보실 수 있습니다.",
  keywords: "아이하루, 아이, 습관, 가족, 준비중, aiharu",
  openGraph: {
    ...commonMetadata.openGraph,
    title: "아이하루 - 준비 중 | aiharu.net",
    description: "아이하루 서비스가 준비 중입니다. 곧 만나보실 수 있습니다.",
    url: "https://aiharu.net/child-temp",
  },
};

export default function ChildTempPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <Link
          href="/"
          className="self-start mb-8 text-neutral-600 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium animate-fade-in-up"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          홈으로 돌아가기
        </Link>

        <main className="flex flex-col items-center gap-12 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center animate-fade-in-scale">
            <div className="text-8xl mb-6 animate-float">
              👨‍👩‍👧‍👦
            </div>
            <Title className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-6">
              아이하루
            </Title>
            <Body className="text-xl text-neutral-700 max-w-2xl leading-relaxed">
              부모와 아이가 함께 만드는 습관,
              <br />
              곧 만나보실 수 있습니다.
            </Body>
          </div>

          {/* Info Card */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white/80 backdrop-blur-lg border border-neutral-200/50 rounded-3xl p-8 shadow-soft max-w-2xl text-center">
              <div className="text-4xl mb-4">🚧</div>
              <Body className="text-neutral-700 leading-relaxed">
                아이하루는 현재 개발 중입니다.
                <br />
                부모와 아이가 함께 목표를 세우고, 매일의 습관을 체크하며
                <br />
                성장하는 과정을 지원하는 서비스를 준비하고 있습니다.
                <br />
                <span className="font-semibold text-secondary mt-2 block">
                  조금만 기다려 주세요!
                </span>
              </Body>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button 
              as="a" 
              href="/" 
              variant="primary" 
              size="lg"
              className="bg-secondary-gradient shadow-strong hover-lift flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              홈으로 돌아가기
            </Button>
          </div>

          {/* Coming Soon Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 w-full animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover-lift border border-neutral-200/30">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-neutral-800 mb-2">
                목표 설정
              </h3>
              <p className="text-sm text-neutral-600">부모와 아이가 함께 목표를 세워요</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover-lift border border-neutral-200/30">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-neutral-800 mb-2">
                습관 체크
              </h3>
              <p className="text-sm text-neutral-600">매일 습관을 체크하고 달성률 확인</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover-lift border border-neutral-200/30">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-neutral-800 mb-2">
                보상 시스템
              </h3>
              <p className="text-sm text-neutral-600">포인트 기반 보상으로 동기부여</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
