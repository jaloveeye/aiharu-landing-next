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

type NutritionDeficiencyBarChartProps = {
  deficiencyCounts: { [key: string]: number };
};

export default function NutritionDeficiencyBarChart({
  deficiencyCounts,
}: NutritionDeficiencyBarChartProps) {
  const labels = Object.keys(deficiencyCounts);
  const values = Object.values(deficiencyCounts);
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "부족 빈도",
            data: values,
            backgroundColor: "#f53794",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function (tickValue: string | number) {
                if (
                  typeof tickValue === "number" &&
                  Number.isInteger(tickValue)
                ) {
                  return tickValue.toString();
                }
                return "";
              },
              precision: 0,
            },
            suggestedMin: 0,
            suggestedMax: Math.max(...values, 1),
          },
        },
      }}
    />
  );
}
