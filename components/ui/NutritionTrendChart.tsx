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
import { Chart as ChartJS } from "chart.js";
import { parseNutritionPercent } from "@/utils/nutritionParser";
import { useRef } from "react";
import type { TooltipItem } from "chart.js";

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
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  // 날짜 오름차순(오래된→최신) 정렬 및 모든 값이 0인 날 제외
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
  // 오늘 기준 최근 30일(한 달)만 필터링
  const now = new Date();
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
  function isWithin30Days(dateStr: string) {
    const d = new Date(dateStr);
    return (
      now.getTime() - d.getTime() <= THIRTY_DAYS && d.getTime() <= now.getTime()
    );
  }
  const filtered = [...analyses]
    .filter((a) => isWithin30Days(a.analyzed_at))
    .map((a) => ({ ...a, percent: parseNutritionPercent(a.result) }))
    .filter((a) => NUTRIENTS.some((n) => a.percent[n] && a.percent[n] > 0))
    .sort(
      (a, b) =>
        new Date(a.analyzed_at).getTime() - new Date(b.analyzed_at).getTime()
    );
  const labels = filtered.map((a) => a.analyzed_at);
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
    filtered.map((a) => a.percent?.[nutrient] ?? 0)
  );
  // 각 영양소별 합계 계산(%)
  const sumByNutrient = NUTRIENTS.map((nutrient, i) =>
    dataByNutrient[i].reduce((acc, v) => acc + v, 0)
  );

  // onHover에서 interaction 모드 동적 변경
  const handleHover = (
    event: unknown,
    chartElement: Array<{ datasetIndex: number; index: number }>
  ) => {
    const chart = chartRef.current;
    if (!chart) return;
    // interaction 옵션이 없으면 생성
    let interaction = chart.options.interaction;
    if (!interaction) {
      interaction = { mode: "index", intersect: false };
      chart.options.interaction = interaction;
    }
    // 점 위에 있으면 해당 항목만
    if (chartElement && chartElement.length > 0) {
      interaction.mode = "nearest";
      interaction.intersect = true;
    } else {
      interaction.mode = "index";
      interaction.intersect = false;
    }
    chart.update("none");
  };

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
          </span>
        ))}
      </div>
      <Line
        ref={chartRef}
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
          plugins: {
            legend: { position: "top" },
            tooltip: {
              callbacks: {
                label: function (context: TooltipItem<"line">) {
                  // x축(모든 항목) 모드일 때만 내림차순 정렬
                  const chart = context.chart;
                  const interaction = chart.options.interaction;
                  if (
                    interaction &&
                    interaction.mode === "index" &&
                    !interaction.intersect
                  ) {
                    // 모든 항목을 내림차순 정렬
                    const all = context.chart.data.datasets.map((ds, i) => ({
                      label: ds.label,
                      value: ds.data[context.dataIndex],
                    }));
                    const sorted = all.sort(
                      (a, b) => Number(b.value) - Number(a.value)
                    );
                    // 현재 context가 첫번째 항목일 때만 전체를 반환(중복 방지)
                    if (context.datasetIndex === 0) {
                      return sorted.map(
                        ({ label, value }) => `${label}: ${value}%`
                      );
                    }
                    return null;
                  }
                  // 점 위에 올릴 때는 기존대로
                  return `${context.dataset.label}: ${context.formattedValue}%`;
                },
              },
            } as any,
          },
          interaction: { mode: "index", intersect: false },
          onHover: handleHover,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 200,
              title: { display: true, text: "% (권장량 대비)" },
              ticks: {
                stepSize: 20,
                color: "#888",
                font: { size: 13 },
                callback: (tickValue: any) => `${Number(tickValue)}%`,
              },
              grid: { color: "#eee" },
            },
          },
        }}
      />
    </div>
  );
}
