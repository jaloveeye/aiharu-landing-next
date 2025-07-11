"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 추천 식단 파싱 함수
function extractRecommendation(result: string): string {
  // dotAll(/s) 플래그 없이 여러 줄 매칭
  const match = result.match(
    /내일 아침 추천 식단[^\n]*\n- \*\*식단\*\*:([\s\S]*?)(?:\n\n|####|\n#|$)/
  );
  if (match) {
    return match[1]
      .split("\n")
      .map((line) =>
        line
          .replace(/[-•\*\s]+/, "")
          .replace(/\(.+\)/, "")
          .trim()
      )
      .filter(Boolean)
      .join("\n");
  }
  const alt = result.match(
    /- ([^\n]+시리얼[^\n]+|[^\n]+프라이[^\n]+|[^\n]+시금치[^\n]+|[^\n]+주스[^\n]+)/g
  );
  if (alt) return alt.map((line) => line.replace(/^- /, "").trim()).join("\n");
  return "";
}
function extractIngredients(content: string): string {
  return content
    .split("\n")
    .flatMap((dish) => dish.split("+"))
    .map((item) => item.replace(/\d.*$/, "").replace(/[()]/g, "").trim())
    .filter(Boolean)
    .join(",");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RecommendationTestPage() {
  // 테스트용 데이터
  const testData = [
    {
      id: "2bc0ff73-a38d-4fdb-abd0-bd3a555c57c0",
      anon_id: "bd63a080-e211-41c6-ba28-144ad8e194f8",
      meal_text: "달걀 스크램블,바나나 1개,방울 토마토 4개,우유 반잔",
      result: `### 결과 요약\n\n#### 1. 식재료 및 음식명 정리\n- 바나나\n- 방울 토마토\n- 우유\n- 달걀 스크램블\n\n#### 2. 각 식재료의 대략적인 섭취량\n- 바나나: 1개 (약 100g)\n- 방울 토마토: 4개 (약 60g)\n- 우유: 반 잔 (약 120ml)\n- 달걀 스크램블: 달걀 1개 사용\n\n#### 3. 전체 식사의 열량 및 주요 영양소 요약표\n\n| 영양소       | 함량   | 7세 여아 권장 섭취량 | %로 비교 |\n|--------------|--------|----------------------|----------|\n| 열량 (kcal)  | 약 232 | 1,400                | 16.6%    |\n| 탄수화물 (g) | 약 31  | 130                  | 23.8%    |\n| 단백질 (g)   | 약 10  | 19                   | 52.6%    |\n| 지방 (g)     | 약 8   | 38                   | 21.1%    |\n| 식이섬유 (g) | 약 3   | 15                   | 20%      |\n| 칼슘 (mg)    | 약 150 | 1,000                | 15%      |\n| 철분 (mg)    | 약 1.5 | 10                   | 15%      |\n| 비타민 A (µg)| 약 100 | 400                  | 25%      |\n| 비타민 C (mg)| 약 30  | 25                   | 120%     |\n| 비타민 D (µg)| 약 1.2 | 15                   | 8%       |\n| 나트륨 (mg)  | 약 100 | 1,200                | 8.3%     |\n\n#### 4. 부족한 영양소 및 과잉 항목\n- **부족한 영양소**: 칼슘, 철분, 비타민 D\n- **과잉된 항목**: 없음\n\n#### 5. 식단의 장점과 개선이 필요한 점\n- **장점**: 과일과 채소가 포함되어 있어 비타민 C가 풍부하며, 단백질 섭취가 적절합니다.\n- **개선이 필요한 점**: 칼슘, 철분, 비타민 D의 섭취가 부족하므로 이를 보완할 필요가 있습니다.\n\n#### 6. 내일 아침 추천 식단 제안\n- **식단**: \n  - 통곡물 시리얼 1/2컵 + 우유 1컵\n  - 삶은 시금치 (철분 보충)\n  - 오렌지 주스 1/2컵 (비타민 C 흡수율 증가)\n  - 계란 프라이 1개\n\n#### 7. JSON 형식 결과\n\n\`\`\`json\n{\n  "식사 구성": {\n    "바나나": "1개",\n    "방울 토마토": "4개",\n    "우유": "반 잔",\n    "달걀 스크램블": "달걀 1개"\n  },\n  "영양소 요약": {\n    "열량 (kcal)": 232,\n    "탄수화물 (g)": 31,\n    "단백질 (g)": 10,\n    "지방 (g)": 8,\n    "식이섬유 (g)": 3,\n    "칼슘 (mg)": 150,\n    "철분 (mg)": 1.5,\n    "비타민 A (µg)": 100,\n    "비타민 C (mg)": 30,\n    "비타민 D (µg)": 1.2,\n    "나트륨 (mg)": 100\n  },\n  "권장 섭취량 대비 백분율": {\n    "열량 (%)": 16.6,\n    "탄수화물 (%)": 23.8,\n    "단백질 (%)": 52.6,\n    "지방 (%)": 21.1,\n    "식이섬유 (%)": 20,\n    "칼슘 (%)": 15,\n    "철분 (%)": 15,\n    "비타민 A (%)": 25,\n    "비타민 C (%)": 120,\n    "비타민 D (%)": 8,\n    "나트륨 (%)": 8.3\n  },\n  "부족한 영양소": ["칼슘", "철분", "비타민 D"],\n  "과잉된 항목": [],\n  "식단의 장점": "과일과 채소가 포함되어 비타민 C가 풍부하며 단백질 섭취가 적절함",\n  "개선이 필요한 점": "칼슘, 철분, 비타민 D의 섭취가 부족함"\n}\n\`\`\`\n`,
      analyzed_at: "2025-07-11",
      email: "jaloveeye@gmail.com",
      source_type: "text",
    },
  ];

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInsert = async () => {
    setLoading(true);
    setMessage("");
    // 로그인 사용자 정보
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessage("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
    // 테스트 데이터 파싱 및 저장
    try {
      for (const item of testData) {
        const content = extractRecommendation(item.result);
        const ingredients = extractIngredients(content);
        await supabase.from("recommendations").insert([
          {
            user_id: user.id,
            date: item.analyzed_at,
            content,
            ingredients,
            status: "pending",
          },
        ]);
      }
      setMessage("저장 성공!");
    } catch (e: any) {
      setMessage("저장 실패: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h1 className="text-xl font-bold mb-4">추천 식단 테스트 데이터 저장</h1>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded font-bold disabled:opacity-50"
        onClick={handleInsert}
        disabled={loading}
      >
        {loading ? "저장 중..." : "테스트 데이터 저장"}
      </button>
      {message && <div className="mt-4 text-center font-medium">{message}</div>}
      <div className="mt-8 text-xs text-gray-500">
        로그인 후 버튼을 누르면, 예시 분석 결과가 내 user_id로 recommendations
        테이블에 저장됩니다.
      </div>
    </div>
  );
}
