import { Title, Body } from "@/components/ui/Typography";
import CarouselSection from "./CarouselSection";

export const metadata = {
  title: "아이하루 - 아이와 부모가 함께 만드는 하루 습관 | aiharu.net",
  description:
    "아이하루는 아이와 부모가 함께 목표를 세우고, 피드백과 칭찬으로 성장하는 습관 여정을 지원합니다. 목표 체크, 피드백, 보상 시스템, 주간 리포트 등 다양한 기능 제공.",
  keywords: "아이하루, 습관, 성장, 피드백, 보상, 부모, 자녀, 대시보드, aiharu",
  openGraph: {
    title: "아이하루 - 아이와 부모가 함께 만드는 하루 습관 | aiharu.net",
    description:
      "아이하루는 아이와 부모가 함께 목표를 세우고, 피드백과 칭찬으로 성장하는 습관 여정을 지원합니다. 목표 체크, 피드백, 보상 시스템, 주간 리포트 등 다양한 기능 제공.",
    type: "website",
    url: "https://aiharu.net/child",
    images: [
      {
        url: "/og-childharu.png",
        width: 1200,
        height: 630,
        alt: "아이하루 - aiharu.net",
      },
    ],
  },
};

export default function ChildPage() {
  const cards = [
    {
      icon: "📅",
      title: "오늘의 목표 체크",
      desc: "매일 목표를 체크하고, 달성률을 한눈에 확인해요.",
    },
    {
      icon: "💬",
      title: "부모 피드백 & 감정 칭찬",
      desc: "부모님이 직접 남기는 칭찬과 피드백으로 동기부여!",
    },
    {
      icon: "🏆",
      title: "포인트 → 보상 시스템",
      desc: "목표 달성 시 포인트를 받고, 원하는 보상으로 교환해요.",
    },
    {
      icon: "📈",
      title: "주간 리포트 & 습관 인사이트",
      desc: "한 주의 성장과 습관 변화를 리포트로 확인!",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <main className="flex flex-col items-center gap-8 w-full">
        <Title>아이와 부모가 함께 만드는 하루 습관</Title>
        <Body>칭찬과 피드백으로 자라는 성장 여정</Body>
        {/* 대시보드 예시 화면 */}
        <div className="w-full max-w-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-2xl shadow-xl p-8 flex flex-col items-center mb-8">
          <div className="text-xl font-extrabold text-yellow-800 mb-6">
            아이하루 대시보드 예시
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center border border-yellow-100">
              <div className="text-lg font-bold text-yellow-700 mb-2">
                오늘의 목표
              </div>
              <ul className="text-yellow-800 text-base list-disc list-inside">
                <li>책 20쪽 읽기</li>
                <li>양치질 2회</li>
                <li>정리정돈</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center border border-yellow-100">
              <div className="text-lg font-bold text-yellow-700 mb-2">
                달성률
              </div>
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-2xl font-bold text-yellow-600 border-4 border-yellow-300 mb-2">
                80%
              </div>
              <div className="text-yellow-800">오늘 목표 4개 중 3개 완료!</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center border border-yellow-100">
              <div className="text-lg font-bold text-yellow-700 mb-2">
                칭찬 & 피드백
              </div>
              <div className="text-yellow-800">
                엄마: "정리정돈 잘했어요!"
                <br />
                아빠: "책 읽기 꾸준해서 멋져요!"
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center border border-yellow-100">
              <div className="text-lg font-bold text-yellow-700 mb-2">
                포인트 & 보상
              </div>
              <div className="text-yellow-800 mb-1">
                누적 포인트: <b>120</b>
              </div>
              <div className="text-yellow-600">🎁 100P: 아이스크림 교환</div>
            </div>
          </div>
        </div>
        {/* 상세설명 캐러셀 */}
        <CarouselSection cards={cards} />
      </main>
    </div>
  );
}
