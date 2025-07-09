// TODO: 식단 분석 프롬프트에서 11대 영양소(열량, 탄수화물, 단백질, 지방, 식이섬유, 칼슘, 철분, 비타민 C, 비타민 D, 당류(당분), 나트륨)가 반드시 포함되도록 수정 필요
export default function AiPromptsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 py-20">
      <main className="flex flex-col items-center gap-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 text-center drop-shadow-md">
          프롬프트 모음 (Mock)
        </h1>
        <div className="bg-white border border-green-200 rounded-xl p-6 shadow max-w-lg w-full text-green-700 text-center">
          <div className="mb-2 font-semibold">샘플 프롬프트</div>
          <ul className="flex flex-col gap-2">
            <li>"초등학생도 이해할 수 있게 LLM을 설명해줘."</li>
            <li>"오늘의 아침 식단을 분석해줘."</li>
            <li>"아이의 습관 형성에 도움이 되는 AI 활용법 알려줘."</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
