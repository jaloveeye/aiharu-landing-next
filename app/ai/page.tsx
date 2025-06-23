export default function AiPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 py-20">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-600 text-center drop-shadow-md">
          AI하루
          <br />
          <span className="text-lg font-normal text-green-800 block mt-2">
            AI와 함께하는 똑똑한 하루,
            <br />
            매일 새로운 지식과 습관을 만들어가요.
          </span>
        </h1>
        <div className="bg-white border border-green-200 rounded-xl p-6 shadow max-w-lg text-center text-green-700">
          곧 AI 기반 식단 분석, 맞춤형 추천, 학습 리포트 등 다양한 기능이 제공될
          예정입니다.
          <br />
          <span className="font-semibold">조금만 기다려 주세요!</span>
        </div>
        <div className="flex gap-4 mt-2">
          <a
            href="/ai/daily"
            className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white text-lg font-semibold shadow-sm transition-colors"
          >
            오늘의 ai하루 보기
          </a>
          <a
            href="/ai/prompts"
            className="px-6 py-3 rounded-full bg-white border border-green-400 text-green-700 text-lg font-semibold shadow-sm transition-colors hover:bg-green-50"
          >
            프롬프트 모음
          </a>
        </div>
      </main>
    </div>
  );
}
