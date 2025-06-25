import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function standardizeUnit(text: string): string {
  return (
    text
      // '한 개', '한개', '1개' → 'ea'
      .replace(/\b한\s*개\b|\b1\s*개\b|\b1개\b|\b한개\b/gi, "ea")
      // '한 잔', '한잔', '1잔' → 'cup'
      .replace(/\b한\s*잔\b|\b1\s*잔\b|\b1잔\b|\b한잔\b/gi, "cup")
      // '그램', 'g' → 'g'
      .replace(/\b그램\b|\bg\b/gi, "g")
      // '밀리리터', 'ml' → 'ml'
      .replace(/\b밀리리터\b|\bml\b/gi, "ml")
      // '봉지' → 'pack'
      .replace(/\b봉지\b/gi, "pack")
  );
}

function normalizeMeal(meal: string): string {
  return meal
    .split(",")
    .map((item) => standardizeUnit(item.trim().replace(/\s+/g, " ")))
    .filter(Boolean)
    .sort()
    .join(",");
}

// 실제 OpenAI 분석 함수로 교체 필요
async function analyzeWithOpenAI(meal: string): Promise<string> {
  // 실제 OpenAI API 호출 로직을 주석 처리
  /*
  const prompt = `
  ...
  `;
  const chat = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });
  return chat.choices[0].message.content || "";
  */
  // 테스트용 더미 결과 반환
  return `입력된 아침 식단을 바탕으로 초등학교 1학년 기준으로 영양분석을 해보겠습니다.

### 1. 주요 영양소 추정:

- **시리얼 30그램:**
- 탄수화물: 약 20-25g
- 단백질: 약 2-3g
- 지방: 약 1-2g
- 식이섬유: 약 1-3g

- **우유 (약 200ml로 가정):**
- 탄수화물: 약 9g
- 단백질: 약 7g
- 지방: 약 7g
- 칼슘: 약 240mg
- 비타민 D: 우유에 따라 다름

- **견과류 한봉 (약 20g으로 가정):**
- 탄수화물: 약 6g
- 단백질: 약 5g
- 지방: 약 14g
- 식이섬유: 약 2g
- 다양한 비타민 및 미네랄

- **메추리알 2개:**
- 탄수화물: 거의 없음
- 단백질: 약 2.5g
- 지방: 약 2.5g
- 콜레스테롤: 높음
- 비타민 A, B12 및 셀레늄 포함

### 2. 아침 식사로서 충분한지 판단:

- **탄수화물:** 전반적으로 충분한 양입니다.
- **단백질:** 일일 권장량에는 다소 부족할 수 있습니다.
- **지방:** 어린이에게 적절한 양이지만, 견과류와 함께 섭취 시 충분합니다.
- **칼슘:** 우유 덕분에 어느 정도 충족됩니다.
- **비타민 및 미네랄:** 다양한 영양소가 포함되어 있지만, 신선한 과일이나 채소가 추가되면 더 좋습니다.

전반적으로 아침 식사로 괜찮지만, 신선한 과일이나 채소가 빠져 있어 비타민과 식이섬유가 조금 부족할 수 있습니다.

### 3. 내일 보완할 수 있는 추천 식사:

- **과일 추가:** 바나나, 사과, 베리 종류 등을 추가해 비타민과 식이섬유를 보충하세요.
- **단백질 보충:** 계란 한 개 더 추가하거나 요거트를 곁들여 단백질을 보충하세요.
- **채소 추가:** 식단에 신선한 야채를 곁들이는 것도 좋은 방법입니다.

이렇게 추가하면 더욱 균형 잡힌 아침 식사가 될 것입니다.`;
}

export async function POST(req: NextRequest) {
  try {
    const { meal, anon_id } = await req.json();
    const normalizedMeal = normalizeMeal(meal);
    const today = new Date().toISOString().slice(0, 10);
    const supabase = createClient(cookies());

    // 1. DB에서 기존 결과 조회 (이제 meal_text 없이 anon_id+analyzed_at만 체크)
    const { data: existing } = await supabase
      .from("meal_analysis")
      .select("result")
      .eq("anon_id", anon_id)
      .eq("analyzed_at", today)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ result: existing[0].result, cached: true });
    }

    // 2. OpenAI로 분석 (실제 분석 함수로 교체 필요)
    const result = await analyzeWithOpenAI(meal);

    // 3. 결과 저장
    console.log({
      anon_id,
      meal_text: normalizedMeal,
      result,
      resultType: typeof result,
      analyzed_at: today,
    });
    const { data, error, status } = await supabase
      .from("meal_analysis")
      .insert([
        {
          anon_id,
          meal_text: normalizedMeal,
          result: typeof result === "string" ? result : JSON.stringify(result),
          analyzed_at: today,
        },
      ]);

    if (error) {
      console.error(
        "Supabase insert error:",
        error,
        "status:",
        status,
        "data:",
        data
      );
      return NextResponse.json({ error, status, data }, { status: 500 });
    }

    return NextResponse.json({ result, cached: false });
  } catch (error: any) {
    console.error("POST /api/analyze-meal error:", error);
    return NextResponse.json(
      { error: error?.message || String(error), full: JSON.stringify(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anon_id = searchParams.get("anon_id");
  const meal = searchParams.get("meal");
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createClient(cookies());

  if (anon_id && !meal) {
    // 오늘 분석한 식단이 하나라도 있으면 true
    const { data } = await supabase
      .from("meal_analysis")
      .select("id")
      .eq("anon_id", anon_id)
      .eq("analyzed_at", today)
      .limit(1);
    return NextResponse.json({ analyzed: !!(data && data.length > 0) });
  }

  if (!anon_id || !meal) {
    return NextResponse.json(
      { analyzed: false, error: "Missing anon_id or meal" },
      { status: 400 }
    );
  }
  const normalizedMeal = normalizeMeal(meal);
  const { data: existing } = await supabase
    .from("meal_analysis")
    .select("id")
    .eq("anon_id", anon_id)
    .eq("meal_text", normalizedMeal)
    .eq("analyzed_at", today)
    .maybeSingle();
  return NextResponse.json({ analyzed: !!existing });
}
