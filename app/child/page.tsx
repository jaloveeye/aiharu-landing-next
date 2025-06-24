import { Title, Body } from "@/components/ui/Typography";
import CarouselSection from "./CarouselSection";
import BreakfastPreview from "./BreakfastPreview";

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
            {/* 오늘의 목표 - 체크리스트 스타일 */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-start border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📅</span>
                <div className="text-lg font-bold text-yellow-700">
                  오늘의 목표
                </div>
              </div>
              <ul className="flex flex-col gap-2 w-full mt-2">
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="accent-yellow-400 w-5 h-5 rounded"
                  />
                  <span className="text-yellow-800">책 20쪽 읽기</span>
                </li>
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="accent-yellow-400 w-5 h-5 rounded"
                  />
                  <span className="text-yellow-800">양치질 2회</span>
                </li>
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    readOnly
                    className="accent-yellow-400 w-5 h-5 rounded"
                  />
                  <span className="text-yellow-800">정리정돈</span>
                </li>
              </ul>
            </div>
            {/* 달성률 - 원형 그래프 스타일 */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📈</span>
                <div className="text-lg font-bold text-yellow-700">달성률</div>
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                <svg
                  className="w-full h-full rotate-[-90deg]"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="50.24"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-yellow-600">
                  80%
                </div>
              </div>
              <div className="text-yellow-800">오늘 목표 4개 중 3개 완료!</div>
            </div>
            {/* 칭찬 & 피드백 - 말풍선/따뜻한 카드 */}
            <div className="bg-yellow-50 rounded-xl shadow-sm p-4 flex flex-col items-start border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💬</span>
                <div className="text-lg font-bold text-yellow-700">
                  칭찬 & 피드백
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="bg-white rounded-lg px-4 py-2 shadow border border-yellow-100 text-yellow-800 relative before:content-[''] before:absolute before:-left-2 before:top-3 before:w-3 before:h-3 before:bg-white before:rounded-tl-lg before:shadow before:border-l before:border-t before:border-yellow-100">
                  엄마:{" "}
                  <span className="font-semibold">정리정돈 잘했어요!</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2 shadow border border-yellow-100 text-yellow-800 relative before:content-[''] before:absolute before:-left-2 before:top-3 before:w-3 before:h-3 before:bg-white before:rounded-tl-lg before:shadow before:border-l before:border-t before:border-yellow-100">
                  아빠:{" "}
                  <span className="font-semibold">
                    책 읽기 꾸준해서 멋져요!
                  </span>
                </div>
              </div>
            </div>
            {/* 포인트 & 보상 - 숫자 강조, 배경색 */}
            <div className="bg-yellow-100 rounded-xl shadow-sm p-4 flex flex-col items-center border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏆</span>
                <div className="text-lg font-bold text-yellow-700">
                  포인트 & 보상
                </div>
              </div>
              <div className="text-yellow-800 mb-1 text-3xl font-extrabold tracking-wide">
                120P
              </div>
              <div className="text-yellow-600 font-semibold">
                🎁 100P: 아이스크림 교환
              </div>
            </div>
          </div>
        </div>
        {/* 상세설명 캐러셀 */}
        <CarouselSection cards={cards} />
        {/* 아침 식단 미리보기 */}
        <BreakfastPreview />
      </main>
    </div>
  );
}
