import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { parseNutrition } from "@/utils/nutritionParser";

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type NutritionTrendChartProps = {
  analyses: Array<{ analyzed_at: string; result: string }>;
};

export default function NutritionTrendChart({
  analyses,
}: NutritionTrendChartProps) {
  const labels = analyses.map((a) => a.analyzed_at);
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
  const COLOR_PALETTE = [
    "#4dc9f6", // 열량
    "#f67019", // 탄수화물
    "#f53794", // 단백질
    "#537bc4", // 지방
    "#acc236", // 식이섬유
    "#e4e932", // 칼슘
    "#a3e236", // 철분
    "#ffb347", // 비타민 C
    "#b19cd9", // 비타민 D
    "#ff6961", // 당류 (당분)
    "#779ecb", // 나트륨
  ];
  const dataByNutrient = NUTRIENTS.map((nutrient) =>
    analyses.map((a) => parseNutrition(a.result)?.[nutrient] ?? 0)
  );
  // 권장량(6~8세 1회 기준)
  const RECOMMENDED: Record<string, number> = {
    열량: 530,
    탄수화물: 82.5,
    단백질: 10,
    지방: 15,
    식이섬유: 5.5,
    칼슘: 250,
    철분: 3,
    "비타민 C": 16.5,
    "비타민 D": 3.3,
    "당류 (당분)": 8,
    나트륨: 400,
  };
  // 각 영양소별 합계 계산
  const sumByNutrient = NUTRIENTS.map((nutrient, i) =>
    dataByNutrient[i].reduce((acc, v) => acc + v, 0)
  );
  // 권장량 대비 섭취 비율(%)
  const percentByNutrient = NUTRIENTS.map((nutrient, i) =>
    RECOMMENDED[nutrient] > 0
      ? Math.round((sumByNutrient[i] / RECOMMENDED[nutrient]) * 100)
      : 0
  );

  return (
    <div>
      {/* 합계 박스: 차트 위에 표시 */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
          fontWeight: 500,
          background: "#fffef7",
          borderRadius: 8,
          padding: "8px 0",
        }}
      >
        {NUTRIENTS.map((nutrient, i) => (
          <span
            key={nutrient}
            style={{ minWidth: 120, marginBottom: 4, display: "inline-block" }}
          >
            <span style={{ color: "#222" }}>{nutrient}</span>:{" "}
            <span
              style={{
                color: COLOR_PALETTE[i],
                fontWeight: 700,
                textShadow: "0 1px 0 #fff",
              }}
            >
              {sumByNutrient[i]}
            </span>
            <span style={{ color: "#888", fontSize: 13, marginLeft: 4 }}>
              ({percentByNutrient[i]}%)
            </span>
          </span>
        ))}
      </div>
      <Line
        data={{
          labels,
          datasets: NUTRIENTS.map((nutrient, i) => ({
            label: nutrient,
            data: dataByNutrient[i],
            borderColor: COLOR_PALETTE[i],
            backgroundColor: "rgba(0,0,0,0)",
            fill: false,
          })),
        }}
        options={{
          responsive: true,
          plugins: { legend: { position: "top" } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  );
}
