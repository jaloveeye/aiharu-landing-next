export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import Link from "next/link";
import NutritionRadarChart from "@/components/ui/NutritionRadarChart";

export default async function AiDailyDetailPage({ params }: { params: any }) {
  const filePath = path.join(
    process.cwd(),
    "content/ai-daily",
    `${params.date}.mdx`
  );
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  const file = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(file);

  // 7. JSON 형식 결과에서 권장량 대비 섭취율(%) 추출 함수 (개선 및 디버깅)
  function extractNutritionPercentFromMarkdown(
    md: string
  ): { [key: string]: number } | null {
    // 7. JSON 형식 결과 섹션 추출 (더 유연하게)
    const match = md.match(
      /####?\s*7[\.|\)]?\s*JSON[^\n]*?\n+```json([\s\S]*?)```/i
    );
    console.log("JSON section match:", match ? match[1] : "NO MATCH");
    if (!match) {
      return null;
    }
    try {
      const json = JSON.parse(match[1]);
      if (json["권장 섭취량 대비 백분율"]) {
        const percentObj: { [key: string]: number } = {};
        const NUTRIENTS = [
          "열량",
          "탄수화물",
          "단백질",
          "지방",
          "식이섬유",
          "칼슘",
          "철분",
          "비타민 C",
          "비타민 D",
          "당류 (당분)",
          "나트륨",
        ];
        Object.entries(json["권장 섭취량 대비 백분율"]).forEach(([k, v]) => {
          const cleanKey = k
            .replace(/\s*\(.*?\)\s*/g, "")
            .replace(/\s*%\s*/g, "")
            .trim();
          if (NUTRIENTS.includes(cleanKey)) {
            percentObj[cleanKey] =
              typeof v === "number" ? v : parseFloat(String(v));
          }
        });
        console.log("nutritionPercent:", percentObj);
        return percentObj;
      }
    } catch (e) {
      console.log("JSON parse error", e);
      return null;
    }
    return null;
  }

  const nutritionPercent = extractNutritionPercentFromMarkdown(content);

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 px-4 py-20">
      <Link
        href="/ai/daily"
        className="self-start mb-4 text-green-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 오늘의 ai하루로 돌아가기
      </Link>
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 text-center drop-shadow-md mb-4">
          {data.title}
        </h1>
        <div className="text-xs text-gray-400 mb-2">{data.date}</div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {data.tags?.map((tag: string) => (
            <span
              key={tag}
              className="bg-green-100 text-green-600 rounded px-2 py-0.5 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        {/* 상단에 레이더 차트 표시 */}
        {nutritionPercent && (
          <div className="w-full max-w-md mb-4">
            <NutritionRadarChart nutrition={nutritionPercent} />
          </div>
        )}
        <div className="bg-white border border-green-200 rounded-xl p-6 shadow w-full text-green-800 prose prose-green">
          <MDXRemote source={content} />
        </div>
      </main>
    </div>
  );
}
