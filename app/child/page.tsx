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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <main className="flex flex-col items-center gap-8 w-full">
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-600 text-center drop-shadow-md">
          아이와 부모가 함께 만드는 하루 습관
        </h1>
        <p className="text-lg sm:text-2xl text-yellow-800 text-center max-w-xl">
          칭찬과 피드백으로 자라는 성장 여정
        </p>
        <ul className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-lg w-full text-yellow-700 text-base sm:text-lg flex flex-col gap-2">
          <li>📅 오늘의 목표 체크 & 달성률 시각화</li>
          <li>💬 부모 피드백 & 감정 칭찬 시스템</li>
          <li>🏆 포인트 → 보상 연결 시스템</li>
          <li>📈 주간 리포트와 습관 인사이트 제공</li>
        </ul>
        <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-6 shadow max-w-lg w-full text-yellow-800 text-base flex flex-col gap-2">
          <div>
            <b>화면 구성</b>
          </div>
          <div>자녀용 대시보드 (목표 리스트, 달성률 애니메이션)</div>
          <div>부모용 피드백 관리 페이지</div>
          <div>보상 교환 상점</div>
        </div>
        <div className="flex gap-4 mt-2">
          <a
            href="/child/dashboard"
            className="px-6 py-3 rounded-full bg-yellow-500 hover:bg-yellow-400 text-white text-lg font-semibold shadow-sm transition-colors"
          >
            아이하루 대시보드 보기
          </a>
          <a
            href="#"
            className="px-6 py-3 rounded-full bg-white border border-yellow-400 text-yellow-700 text-lg font-semibold shadow-sm transition-colors hover:bg-yellow-50"
          >
            서비스 소개 영상 보기
          </a>
        </div>
      </main>
    </div>
  );
}
