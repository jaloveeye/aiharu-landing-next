"use client";
import MealAnalysisForm from "@/components/MealAnalysisForm";

function extractMealAndConclusion(
  result: string,
  mealText?: string
): { meal: string; conclusion: string } {
  let meal = mealText || "";
  let conclusion = "";
  // 결론/추천 부분 추출
  if (result) {
    const conclusionMatch = result.match(
      /(추천 식단[:：]?|추천 식사[:：]?|내일 보완할 수 있는 추천 식사[:：]?|추천|결론|Summary|Conclusion)[^\n\r]*[\n\r]+([\s\S]*)/i
    );
    if (conclusionMatch && conclusionMatch[2]) {
      conclusion = conclusionMatch[2].trim();
    } else {
      const lines = result.split(/\r?\n/).filter(Boolean);
      const summaryLines = lines.filter((line) =>
        /추천|내일|결론|Summary|Conclusion/i.test(line)
      );
      if (summaryLines.length > 0) {
        conclusion = summaryLines.slice(-2).join("\n");
      } else {
        conclusion = lines.slice(-3).join("\n");
      }
    }
  }
  return { meal, conclusion };
}

export default function BreakfastPreview() {
  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
      <MealAnalysisForm
        extractMealAndConclusion={extractMealAndConclusion}
        withConclusion={true}
      />
    </div>
  );
}
