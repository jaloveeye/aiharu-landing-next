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
  const prompt = `아래는 초등학교 1학년 아동의 아침 식단입니다. 각 식단 항목별로 예상 영양소(탄수화물, 단백질, 지방, 식이섬유, 칼슘 등)를 추정해 표로 정리하고, 전체 식단의 영양 균형을 평가한 뒤, 내일 아침에 보완할 점이나 추천 식단을 2~3줄로 제안해 주세요.\n\n식단: ${meal}`;
  const chat = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return chat.choices[0].message.content || "";
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
