import dynamic from "next/dynamic";
import { CSSProperties, Suspense } from "react";

const ReactWordcloud = dynamic(() => import("react-wordcloud"), {
  ssr: false,
  loading: () => <div>워드클라우드 로딩 중...</div>,
});

interface NutritionDeficiencyWordCloudProps {
  deficiencyCounts: { [key: string]: number } | undefined | null;
}

const options = {
  rotations: 2,
  rotationAngles: [0, 0] as [number, number], // 한글은 회전 없이
  fontSizes: [24, 64] as [number, number],
  fontFamily:
    "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  colors: [
    "#4dc9f6",
    "#f67019",
    "#f53794",
    "#537bc4",
    "#acc236",
    "#e4e932",
    "#a3e236",
    "#ffb347",
    "#b19cd9",
    "#ff6961",
    "#779ecb",
  ],
};

export default function NutritionDeficiencyWordCloud({
  deficiencyCounts,
}: NutritionDeficiencyWordCloudProps) {
  if (!deficiencyCounts || typeof deficiencyCounts !== "object") {
    return (
      <div className="text-gray-500 text-center py-8">
        부족한 영양소 데이터가 없습니다.
      </div>
    );
  }

  const words = Object.entries(deficiencyCounts)
    .filter(([, value]) => typeof value === "number" && value > 0)
    .map(([text, value]) => ({ text, value }));

  console.log("[WordCloud DEBUG] words:", words, deficiencyCounts, options);

  if (!Array.isArray(words) || words.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        부족한 영양소가 없습니다.
      </div>
    );
  }

  try {
    return (
      <div
        style={{ width: "100%", height: 320, minHeight: 200 } as CSSProperties}
      >
        <Suspense fallback={<div>워드클라우드 로딩 중...</div>}>
          <ReactWordcloud words={words} options={options} />
        </Suspense>
      </div>
    );
  } catch (e) {
    console.error("[WordCloud ERROR]", e, words, deficiencyCounts, options);
    return (
      <div className="text-red-500 text-center py-8">
        워드클라우드 렌더링 중 오류가 발생했습니다.
      </div>
    );
  }
}
