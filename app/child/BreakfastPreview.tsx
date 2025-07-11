"use client";
import MealAnalysisForm from "@/components/MealAnalysisForm";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

function extractMealAndConclusion(
  result: string,
  mealText?: string
): { meal: string; conclusion: string } {
  let meal = mealText || "";
  // 5, 6번 항목만 추출 (마크다운 헤딩 ####, ### 등도 허용)
  let conclusion = "";
  const lines = result.split(/\r?\n/);
  let found5 = false,
    found6 = false;
  let part5 = "",
    part6 = "";
  for (let i = 0; i < lines.length; i++) {
    if (/^#{0,4}\s*5\.?\s*식단의 장점/.test(lines[i])) {
      found5 = true;
      let j = i + 1;
      while (
        j < lines.length &&
        !/^#{0,4}\s*6\.?\s*내일 아침 추천 식단/.test(lines[j])
      ) {
        part5 += lines[j] + "\n";
        j++;
      }
    }
    if (/^#{0,4}\s*6\.?\s*내일 아침 추천 식단/.test(lines[i])) {
      found6 = true;
      let j = i + 1;
      while (j < lines.length && !/^#{0,4}\s*\d+\./.test(lines[j])) {
        part6 += lines[j] + "\n";
        j++;
      }
    }
  }
  part5 = part5.trim();
  part6 = part6.trim();
  if (found5 || found6) {
    conclusion =
      (found5 ? `5. 식단의 장점과 개선이 필요한 점\n${part5}\n` : "") +
      (found6 ? `6. 내일 아침 추천 식단 제안\n${part6}` : "");
    conclusion = conclusion.trim();
  } else {
    conclusion = result;
  }
  return { meal, conclusion };
}

export default function BreakfastPreview() {
  const router = useRouter();
  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
      <MealAnalysisForm
        extractMealAndConclusion={(result, mealText) => {
          let meal = mealText || "";
          // 5, 6번 항목만 추출 (마크다운 헤딩 ####, ### 등도 허용)
          let part5 = "",
            part6 = "";
          const lines = result.split(/\r?\n/);
          for (let i = 0; i < lines.length; i++) {
            if (/^#{0,4}\s*5\.?\s*식단의 장점/.test(lines[i])) {
              let j = i + 1;
              while (
                j < lines.length &&
                !/^#{0,4}\s*6\.?\s*내일 아침 추천 식단/.test(lines[j])
              ) {
                part5 += lines[j] + "\n";
                j++;
              }
            }
            if (/^#{0,4}\s*6\.?\s*내일 아침 추천 식단/.test(lines[i])) {
              let j = i + 1;
              while (j < lines.length && !/^#{0,4}\s*\d+\./.test(lines[j])) {
                part6 += lines[j] + "\n";
                j++;
              }
            }
          }
          part5 = part5.trim();
          part6 = part6.trim();
          return {
            meal,
            conclusion: JSON.stringify({ part5, part6, fallback: result }),
          };
        }}
        withConclusion={true}
        onResultClick={(id) => router.push(`/history/${id}`)}
        renderConclusion={({ conclusion }) => {
          // conclusion은 JSON.stringify({ part5, part6, fallback }) 형태
          let part5 = "",
            part6 = "",
            fallback = "";
          try {
            const parsed = JSON.parse(conclusion);
            part5 = parsed.part5;
            part6 = parsed.part6;
            fallback = parsed.fallback;
          } catch {
            fallback = conclusion;
          }
          return (
            <div className="flex flex-col gap-4 text-left w-full">
              {part5 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <div className="font-bold text-yellow-800 mb-1">
                    식단의 장점과 개선이 필요한 점
                  </div>
                  <div className="text-black">
                    <ReactMarkdown>{part5}</ReactMarkdown>
                  </div>
                </div>
              )}
              {part6 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <div className="font-bold text-blue-800 mb-1">
                    내일 아침 추천 식단 제안
                  </div>
                  <div className="text-black">
                    <ReactMarkdown>{part6}</ReactMarkdown>
                  </div>
                </div>
              )}
              {!part5 && !part6 && (
                <div className="bg-gray-50 border-l-4 border-gray-300 p-3 rounded">
                  <div className="text-black">
                    <ReactMarkdown>{fallback}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
