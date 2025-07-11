import React from "react";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import { useMealAnalysisForm } from "@/app/hooks/useMealAnalysisForm";
import { useRouter } from "next/navigation";
import NutritionChart from "@/components/ui/NutritionChart";

interface MealAnalysisFormProps {
  extractMealAndConclusion?: (
    result: string,
    mealText?: string
  ) => { meal: string; conclusion: string };
  withConclusion?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showSignupButton?: boolean;
  onResultClick?: (id: string) => void;
}

export default function MealAnalysisForm({
  extractMealAndConclusion,
  withConclusion = false,
  className = "",
  style,
  showSignupButton = true,
  onResultClick,
}: MealAnalysisFormProps) {
  const form = useMealAnalysisForm({
    extractMealAndConclusion,
    withConclusion,
  });
  const router = useRouter();

  function formatDateToLocal(dateStr?: string) {
    if (!dateStr) return "";
    // dateStr이 yyyy-mm-dd(UTC)라면, Date 객체로 변환 후 로컬 yyyy-mm-dd로 변환
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // 파싱 실패 시 원본 반환
    // 로컬 yyyy-mm-dd
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit}
      className={`flex flex-col gap-4 max-w-md mx-auto w-full ${className}`}
      style={style}
    >
      <textarea
        className={`border rounded p-2 text-gray-800 placeholder-gray-400 ${
          form.loading || form.alreadyAnalyzed
            ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
            : ""
        }`}
        rows={3}
        value={form.mealInput}
        onChange={(e) => form.setMealInput(e.target.value)}
        placeholder="예: 닭가슴살 50g, 바나나 1개, 우유 200ml"
        required={!form.imageBase64}
        disabled={
          form.loading || form.alreadyAnalyzed || form.userEmail === undefined
        }
        aria-label="아침 식단 입력"
      />
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-800">
          또는 사진으로 업로드
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          disabled={
            form.loading || form.alreadyAnalyzed || form.userEmail === undefined
          }
          className="file:bg-green-700 file:text-white file:font-bold file:rounded file:px-3 file:py-1 file:border-none file:mr-2 file:cursor-pointer text-gray-800"
          style={{ background: "#f9fafb" }}
          onChange={(e) => form.handleImageChange(e.target.files?.[0] || null)}
        />
        {form.imageError && <Alert variant="error">{form.imageError}</Alert>}
        {form.imagePreview && (
          <img
            src={form.imagePreview}
            alt="업로드된 식단 사진 미리보기"
            className="w-32 h-32 object-cover rounded border mt-2 mx-auto"
          />
        )}
        {form.imageFile && (
          <button
            type="button"
            className="text-xs font-bold text-red-600 underline mt-1"
            style={{
              background: "#fff8f8",
              borderRadius: "4px",
              padding: "2px 8px",
            }}
            onClick={() => form.handleImageChange(null)}
          >
            사진 삭제
          </button>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        className={`w-fit mx-auto text-white ${
          form.loading || form.alreadyAnalyzed
            ? "bg-gray-300 text-gray-400 cursor-not-allowed border-gray-300 hover:bg-gray-300 hover:text-gray-400"
            : ""
        }`}
        disabled={
          form.loading || form.alreadyAnalyzed || form.userEmail === undefined
        }
      >
        {form.loading ? <Spinner size={18} /> : "식단 분석하기"}
      </Button>
      {form.errorMsg && <Alert variant="error">{form.errorMsg}</Alert>}
      {form.alreadyAnalyzed && !form.userEmail && showSignupButton && (
        <>
          <div className="text-red-500 text-sm text-center mt-2 font-bold">
            무료 분석은 1회만 가능합니다. 다시 분석하려면 회원가입이 필요합니다.
          </div>
          <Button
            as="a"
            href="/signup"
            className="min-w-[140px] max-w-fit m-auto !bg-blue-500 !hover:bg-blue-600 !text-white font-bold py-2 px-3 text-xs rounded text-center whitespace-nowrap mt-2"
            style={{ display: "block" }}
          >
            회원가입 하러 가기
          </Button>
        </>
      )}
      {form.alreadyAnalyzed && form.userEmail && (
        <div className="text-blue-600 text-sm text-center mt-2 font-bold">
          오늘은 이미 분석을 완료했습니다. 내일 다시 시도해 주세요.
        </div>
      )}
      {/* 결과 표시 */}
      {withConclusion ? (
        form.loading ? (
          <div className="w-full mt-4 flex flex-col items-center justify-center text-gray-500 text-base font-bold gap-2">
            <Spinner size={20} />
            분석 중...
          </div>
        ) : (
          (form.meal || form.conclusion) && (
            <div
              className={`w-full mt-4 ${
                form.analysisId
                  ? "cursor-pointer hover:bg-yellow-50 transition"
                  : ""
              }`}
              onClick={() =>
                form.analysisId &&
                (onResultClick
                  ? onResultClick(form.analysisId)
                  : router.push(`/history/${form.analysisId}`))
              }
              title={form.analysisId ? "상세 분석 보기" : undefined}
            >
              {form.meal && (
                <div className="text-yellow-700 text-sm font-semibold whitespace-pre-line mb-2">
                  <span className="block mb-1 text-yellow-500 font-bold">
                    분석한 식단
                  </span>
                  {form.meal}
                </div>
              )}
              {/* NutritionChart: 분석한 식단 아래, 분석 결과 텍스트 위에 위치 */}
              {(() => {
                // form.conclusion에서 영양소 표 파싱 (정규식 기반)
                const lines =
                  form.conclusion?.split("\n").map((l) => l.trim()) || [];
                const headerIdx = lines.findIndex((l) => l.startsWith("|"));
                if (headerIdx >= 0 && lines.length > headerIdx + 2) {
                  const header = lines[headerIdx]
                    .split("|")
                    .map((cell) => cell.trim());
                  const dataLines = lines
                    .slice(headerIdx + 2)
                    .filter((l) => l.startsWith("|"));
                  const nutritionSum: { [key: string]: number } = {
                    탄수화물: 0,
                    단백질: 0,
                    지방: 0,
                    식이섬유: 0,
                    칼슘: 0,
                  };
                  dataLines.forEach((row) => {
                    const cells = row.split("|").map((cell) => cell.trim());
                    if (cells.length >= 7) {
                      nutritionSum["탄수화물"] += parseFloat(cells[2]) || 0;
                      nutritionSum["단백질"] += parseFloat(cells[3]) || 0;
                      nutritionSum["지방"] += parseFloat(cells[4]) || 0;
                      nutritionSum["식이섬유"] += parseFloat(cells[5]) || 0;
                      nutritionSum["칼슘"] += parseFloat(cells[6]) || 0;
                    }
                  });
                  const chartData = Object.fromEntries(
                    Object.entries(nutritionSum).filter(([, v]) => v > 0)
                  );
                  if (Object.keys(chartData).length > 0) {
                    return (
                      <div className="mb-2">
                        <NutritionChart data={chartData} />
                      </div>
                    );
                  }
                }
                return null;
              })()}
              {form.conclusion && (
                <>
                  <div className="text-gray-800 text-sm font-normal whitespace-pre-line mt-2">
                    <span className="block mb-1 text-green-700 font-bold">
                      분석 결과
                    </span>
                    {form.conclusion}
                  </div>
                </>
              )}
            </div>
          )
        )
      ) : (
        form.result && (
          <div
            className="bg-white border border-green-300 rounded p-4 whitespace-pre-line mt-2 text-base leading-relaxed max-h-80 overflow-y-auto shadow text-gray-800"
            style={{ wordBreak: "break-word" }}
          >
            {/* 영양소 표 파싱 및 NutritionChart 표시 (영양소별 총합) */}
            {(() => {
              const lines = form.result.split("\n").map((l) => l.trim());
              const headerIdx = lines.findIndex((l) => l.startsWith("|"));
              if (headerIdx >= 0 && lines.length > headerIdx + 2) {
                const header = lines[headerIdx]
                  .split("|")
                  .map((cell) => cell.trim());
                const dataLines = lines
                  .slice(headerIdx + 2)
                  .filter((l) => l.startsWith("|"));
                const nutritionSum: { [key: string]: number } = {
                  탄수화물: 0,
                  단백질: 0,
                  지방: 0,
                  식이섬유: 0,
                  칼슘: 0,
                };
                dataLines.forEach((row) => {
                  const cells = row.split("|").map((cell) => cell.trim());
                  if (cells.length >= 7) {
                    nutritionSum["탄수화물"] += parseFloat(cells[2]) || 0;
                    nutritionSum["단백질"] += parseFloat(cells[3]) || 0;
                    nutritionSum["지방"] += parseFloat(cells[4]) || 0;
                    nutritionSum["식이섬유"] += parseFloat(cells[5]) || 0;
                    nutritionSum["칼슘"] += parseFloat(cells[6]) || 0;
                  }
                });
                const chartData = Object.fromEntries(
                  Object.entries(nutritionSum).filter(([, v]) => v > 0)
                );
                if (Object.keys(chartData).length > 0) {
                  return (
                    <div className="mb-2">
                      <NutritionChart data={chartData} />
                    </div>
                  );
                }
              }
              return null;
            })()}
            {form.analyzedAt &&
              formatDateToLocal(form.analyzedAt) !==
                new Date().toISOString().slice(0, 10) && (
                <div className="text-base font-bold text-red-600 text-center mb-2 border border-red-200 bg-red-50 rounded p-2">
                  ※ 이 결과는 {formatDateToLocal(form.analyzedAt)}에 분석된
                  내용입니다
                </div>
              )}
            {form.result}
            {form.analyzedAt &&
              formatDateToLocal(form.analyzedAt) ===
                new Date().toISOString().slice(0, 10) && (
                <div className="text-xs text-gray-500 text-right mt-1">
                  분석일: {formatDateToLocal(form.analyzedAt)}
                </div>
              )}
          </div>
        )
      )}
    </form>
  );
}
