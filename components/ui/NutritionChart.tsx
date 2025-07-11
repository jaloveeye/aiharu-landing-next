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

type NutritionData = {
  [key: string]: number;
};

interface NutritionChartProps {
  data: NutritionData;
}

export default function NutritionChart({ data }: NutritionChartProps) {
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
  const values = labels.map((k) => data[k] ?? 0);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "영양소(g/mg)",
            data: values,
            backgroundColor: [
              "#4dc9f6",
              "#f67019",
              "#f53794",
              "#537bc4",
              "#acc236",
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      }}
    />
  );
}
