"use client";

import { useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type NutritionRadarChartProps = {
  nutrition: { [key: string]: number };
  isPercent?: boolean;
};

export default function NutritionRadarChart({
  nutrition,
  isPercent = false,
}: NutritionRadarChartProps) {
  const [open, setOpen] = useState(false);
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
  const labels = NUTRIENTS;
  let values: number[];
  if (isPercent) {
    values = labels.map((k) => nutrition[k] ?? 0);
  } else {
    values = labels.map((k) =>
      RECOMMENDED[k] > 0 ? Math.round((nutrition[k] / RECOMMENDED[k]) * 100) : 0
    );
  }
  // 평균값 계산
  const avg =
    values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const legendLabel = isPercent
    ? `권장량 대비 섭취율(평균 ${avg.toFixed(1)}%)`
    : "영양소 균형";

  // 내림차순 정렬된 [영양소, 값] 쌍 생성
  const sortedLegend = labels
    .map((k, i) => ({ label: k, value: values[i] }))
    .sort((a, b) => b.value - a.value);

  return (
    <div>
      <Radar
        data={{
          labels,
          datasets: [
            {
              label: legendLabel,
              data: values,
              backgroundColor: "rgba(77,201,246,0.2)",
              borderColor: "#4dc9f6",
              pointBackgroundColor: "#4dc9f6",
              pointRadius: 0,
              pointHoverRadius: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  return `${context.label}: ${context.formattedValue}%`;
                },
              },
            },
          },
          scales: { r: { beginAtZero: true, max: 150 } },
        }}
      />
      {/* Collapsible custom legend below chart */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition mb-2"
          aria-expanded={open}
        >
          {open ? (
            <>
              영양소별 섭취율 접기 <span aria-hidden>▲</span>
            </>
          ) : (
            <>
              영양소별 섭취율 자세히 보기 <span aria-hidden>▼</span>
            </>
          )}
        </button>
        {open && (
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.8,
              color: "#222",
              fontWeight: 500,
            }}
          >
            {sortedLegend.map(({ label, value }) => (
              <span
                key={label}
                style={{
                  marginRight: 14,
                  display: "inline-block",
                  minWidth: 70,
                }}
              >
                <b>{label}</b>: {value}%
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
