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
};

export default function NutritionRadarChart({
  nutrition,
}: NutritionRadarChartProps) {
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
  const values = labels.map((k) =>
    RECOMMENDED[k] > 0 ? Math.round((nutrition[k] / RECOMMENDED[k]) * 100) : 0
  );
  return (
    <Radar
      data={{
        labels,
        datasets: [
          {
            label: "영양소 균형",
            data: values,
            backgroundColor: "rgba(77,201,246,0.2)",
            borderColor: "#4dc9f6",
            pointBackgroundColor: "#4dc9f6",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { r: { beginAtZero: true } },
      }}
    />
  );
}
