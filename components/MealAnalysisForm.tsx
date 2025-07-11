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
  renderConclusion?: (props: { conclusion: string }) => React.ReactNode;
}

export default function MealAnalysisForm({
  extractMealAndConclusion,
  withConclusion = false,
  className = "",
  style,
  showSignupButton = true,
  onResultClick,
  renderConclusion,
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
      {/* 분석을 완료하지 않은 경우에만 입력/업로드/버튼 표시 */}
      {!form.alreadyAnalyzed && (
        <>
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
              form.loading ||
              form.alreadyAnalyzed ||
              form.userEmail === undefined
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
                form.loading ||
                form.alreadyAnalyzed ||
                form.userEmail === undefined
              }
              className="file:bg-green-700 file:text-white file:font-bold file:rounded file:px-3 file:py-1 file:border-none file:mr-2 file:cursor-pointer text-gray-800"
              style={{ background: "#f9fafb" }}
              onChange={(e) =>
                form.handleImageChange(e.target.files?.[0] || null)
              }
            />
            {form.imageError && (
              <Alert variant="error">{form.imageError}</Alert>
            )}
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
              form.loading ||
              form.alreadyAnalyzed ||
              form.userEmail === undefined
            }
          >
            {form.loading ? <Spinner size={18} /> : "식단 분석하기"}
          </Button>
        </>
      )}
      {form.errorMsg && <Alert variant="error">{form.errorMsg}</Alert>}
      {form.alreadyAnalyzed && form.userEmail && (
        <div className="text-blue-600 text-sm text-center mt-2 font-bold">
          오늘은 이미 분석을 완료했습니다. 내일 다시 시도해 주세요.
        </div>
      )}
      {/* 결과 표시 (항상 표시) */}
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
              {(() => {
                if (renderConclusion) {
                  return renderConclusion({ conclusion: form.conclusion });
                }
                // 기존 결론 표시 방식 (fallback)
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
                  return <NutritionChart data={nutritionSum} />;
                }
                return (
                  <div className="text-green-900 whitespace-pre-line break-words mt-2">
                    {form.conclusion}
                  </div>
                );
              })()}
              {/* 오늘 분석된 결과가 있으면 상세 보기 버튼 명시적으로 추가 */}
              {form.alreadyAnalyzed && form.analysisId && (
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onResultClick) {
                      onResultClick(form.analysisId!);
                    } else {
                      router.push(`/history/${form.analysisId}`);
                    }
                  }}
                >
                  분석 상세 보기
                </button>
              )}
            </div>
          )
        )
      ) : null}
    </form>
  );
}
