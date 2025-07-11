import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type NutritionPieChartProps = {
  nutrition: { [key: string]: number };
};

export default function NutritionPieChart({
  nutrition,
}: NutritionPieChartProps) {
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
  // NaN 방지: 값이 숫자가 아니거나 NaN이면 0으로 대체
  const values = labels.map((k) =>
    RECOMMENDED[k] > 0 ? Math.round((nutrition[k] / RECOMMENDED[k]) * 100) : 0
  );
  const hasData = values.some((v) => v > 0);
  console.log("[PieChart DEBUG] nutrition:", nutrition, "values:", values);

  if (!hasData) {
    return (
      <div className="text-gray-500 text-center py-8">
        분석된 영양소 데이터가 없습니다.
      </div>
    );
  }
  return (
    <div
      style={{
        width: "50%",
        maxWidth: 400,
        aspectRatio: "1",
        margin: "0 auto",
      }}
    >
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#4dc9f6",
                "#f67019",
                "#f53794",
                "#537bc4",
                "#acc236",
                "#e4e932",
                "#a3e236",
              ],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (!data.labels || !data.datasets.length) return [];
                  const values = data.datasets[0].data;
                  const bgColors = data.datasets[0].backgroundColor as string[];
                  return data.labels.map((label, i: number) => ({
                    text: `${String(label)}: ${values[i]}`,
                    fillStyle: bgColors[i],
                    strokeStyle: bgColors[i],
                    index: i,
                  }));
                },
              },
            },
            datalabels: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
