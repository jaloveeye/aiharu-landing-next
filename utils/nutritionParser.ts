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

export function parseNutritionPercent(result: string): NutrientSum {
  // 1. JSON 블록 추출
  const jsonMatch = result.match(/```json([\s\S]+?)```/);
  if (jsonMatch) {
    try {
      const json = JSON.parse(jsonMatch[1]);
      const percents = json["권장 섭취량 대비 백분율"];
      if (percents) {
        const data: NutrientSum = {};
        NUTRIENTS.forEach((nutrient) => {
          // "열량 (%)" → "열량" 등으로 키 변환
          const key = Object.keys(percents).find(
            (k) => k.replace(/\s*\(%\)/, "") === nutrient
          );
          data[nutrient] = key ? Number(percents[key]) : 0;
        });
        return data;
      }
    } catch (e) {}
  }
  // 2. 마크다운 표에서 "%로 비교" 열 추출
  const tableMatch = result.match(/\|[^\n]*%로 비교[^\n]*\|([\s\S]+?)\n\n/);
  if (tableMatch) {
    const lines = tableMatch[1]
      .trim()
      .split("\n")
      .filter((l) => l.startsWith("|"));
    const data: NutrientSum = {};
    lines.forEach((line) => {
      const cells = line.split("|").map((c) => c.trim());
      // | 영양소 | 함량 | 권장 섭취량 | %로 비교 |
      if (cells.length >= 5) {
        const nutrient = cells[1].replace(/\s*\([^)]+\)/, ""); // "열량 (kcal)" → "열량"
        const percent = parseFloat(cells[4].replace("%", ""));
        if (NUTRIENTS.includes(nutrient)) data[nutrient] = percent;
      }
    });
    NUTRIENTS.forEach((nutrient) => {
      if (!data[nutrient]) data[nutrient] = 0;
    });
    return data;
  }
  // 3. 추출 불가
  return Object.fromEntries(NUTRIENTS.map((n) => [n, 0])) as NutrientSum;
}
