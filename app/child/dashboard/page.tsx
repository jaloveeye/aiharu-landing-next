export default function ChildDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <main className="flex flex-col items-center gap-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-600 text-center drop-shadow-md">
          아이하루 대시보드 (Mock)
        </h1>
        <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-lg w-full text-yellow-700 text-center">
          <div className="mb-2 font-semibold">오늘의 목표</div>
          <ul className="flex flex-col gap-2 mb-4">
            <li>🦷 양치하기</li>
            <li>📚 책 10분 읽기</li>
            <li>🥛 우유 마시기</li>
          </ul>
          <div className="mb-2 font-semibold">달성률</div>
          <div className="w-full h-4 bg-yellow-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-yellow-400"
              style={{ width: "67%" }}
            ></div>
          </div>
          <div className="text-sm text-yellow-600">67% 달성!</div>
        </div>
      </main>
    </div>
  );
}
