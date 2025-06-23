export default function AiDailyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 py-20">
      <main className="flex flex-col items-center gap-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 text-center drop-shadow-md">
          오늘의 ai하루 (Mock)
        </h1>
        <div className="bg-white border border-green-200 rounded-xl p-6 shadow max-w-lg w-full text-green-700 text-center">
          <div className="mb-2 font-semibold">오늘의 한 문장 AI 개념</div>
          <div className="mb-4">
            "LLM은 대규모 데이터를 학습해 다양한 언어 작업을 수행하는 인공지능
            모델입니다."
          </div>
          <div className="mb-2 font-semibold">프롬프트 예제</div>
          <div className="mb-4">
            "우리 아이 숙제 도와줄 수 있나요?" → GPT 활용 팁
          </div>
        </div>
      </main>
    </div>
  );
}
