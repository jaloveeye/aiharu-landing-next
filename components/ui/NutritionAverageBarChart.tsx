import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type NutritionAverageBarChartProps = {
  nutrition: { [key: string]: number };
  target?: { [key: string]: number };
};

export default function NutritionAverageBarChart({
  nutrition,
  target,
}: NutritionAverageBarChartProps) {
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
  const labels = NUTRIENTS;
  const values = labels.map((k) => nutrition[k] ?? 0);
  const targetValues = target ? labels.map((l) => target[l] ?? 0) : undefined;
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "평균 섭취량",
            data: values,
            backgroundColor: "#4dc9f6",
          },
          targetValues && {
            label: "권장량",
            data: targetValues,
            backgroundColor: "#f67019",
          },
        ].filter(Boolean) as any,
      }}
      options={{
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}
