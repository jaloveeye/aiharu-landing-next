// utils/nutritionParser.ts

type NutrientSum = { [key: string]: number };

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

export function parseNutrition(result: string): NutrientSum {
  const lines = result.split("\n").map((l) => l.trim());
  const headerIdx = lines.findIndex((l) => l.startsWith("|"));
  if (headerIdx >= 0 && lines.length > headerIdx + 2) {
    const headerLine = lines[headerIdx];
    const headers = headerLine
      .split("|")
      .map((h) =>
        h
          .replace(/\(.*?\)/g, "")
          .replace(/\*/g, "")
          .trim()
      )
      .filter((h) => h.length > 0);
    const dataLines = lines
      .slice(headerIdx + 2)
      .filter((l) => l.startsWith("|"));
    let sum: NutrientSum = Object.fromEntries(
      NUTRIENTS.map((n) => [n, 0])
    ) as NutrientSum;
    NUTRIENTS.forEach((nutrient) => {
      const idx = headers.findIndex((h) => h === nutrient);
      if (idx !== -1) {
        dataLines.forEach((row) => {
          const cells = row.split("|").map((cell) => cell.trim());
          sum[nutrient] += parseFloat(cells[idx]) || 0;
        });
      }
    });
    return sum;
  }
  return Object.fromEntries(NUTRIENTS.map((n) => [n, 0])) as NutrientSum;
}
