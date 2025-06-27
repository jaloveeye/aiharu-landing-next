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
    const { meal, anon_id, email } = await req.json();
    const normalizedMeal = normalizeMeal(meal);
    const today = new Date().toISOString().slice(0, 10);
    const supabase = createClient(cookies());

    if (email) {
      // 회원: 매일 1회 분석 가능
      // 오늘 분석한 적이 있으면 차단
      const { data: todayData, error: todayError } = await supabase
        .from("meal_analysis")
        .select("result, analyzed_at")
        .eq("email", email)
        .eq("analyzed_at", today)
        .limit(1);
      if (todayError) {
        return NextResponse.json(
          { error: todayError.message },
          { status: 500 }
        );
      }
      if (todayData && todayData.length > 0) {
        return NextResponse.json(
          {
            result: todayData[0].result,
            lastAnalyzedAt: todayData[0].analyzed_at,
            limitReached: true,
            error: "오늘은 이미 분석을 완료했습니다. 내일 다시 시도해 주세요.",
          },
          { status: 403 }
        );
      }
    } else {
      // 비회원: 전체 1회만 분석 가능
      const { data: prevData, error: prevError } = await supabase
        .from("meal_analysis")
        .select("result, analyzed_at")
        .eq("anon_id", anon_id)
        .order("analyzed_at", { ascending: false })
        .limit(1);
      if (prevError) {
        return NextResponse.json({ error: prevError.message }, { status: 500 });
      }
      if (prevData && prevData.length > 0) {
        // 이미 분석 이력이 있으면 마지막 분석 결과를 반환하고, 회원가입 유도 메시지 포함
        return NextResponse.json(
          {
            result: prevData[0].result,
            lastAnalyzedAt: prevData[0].analyzed_at,
            limitReached: true,
            error:
              "무료 분석 1회를 모두 사용하셨습니다. 회원가입 후 계속 이용하세요.",
          },
          { status: 403 }
        );
      }
    }

    // 1. DB에서 기존 결과 조회 (이제 meal_text 없이 anon_id+analyzed_at 또는 email+analyzed_at 체크)
    let existing;
    if (email) {
      const { data } = await supabase
        .from("meal_analysis")
        .select("result")
        .eq("email", email)
        .eq("analyzed_at", today)
        .limit(1);
      existing = data;
    } else {
      const { data } = await supabase
        .from("meal_analysis")
        .select("result")
        .eq("anon_id", anon_id)
        .eq("analyzed_at", today)
        .limit(1);
      existing = data;
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ result: existing[0].result, cached: true });
    }

    // 2. OpenAI로 분석 (실제 분석 함수로 교체 필요)
    const result = await analyzeWithOpenAI(meal);

    // 3. 결과 저장
    const insertObj: any = {
      meal_text: normalizedMeal,
      result: typeof result === "string" ? result : JSON.stringify(result),
      analyzed_at: today,
    };
    if (email) insertObj.email = email;
    if (anon_id) insertObj.anon_id = anon_id;
    const { data, error, status } = await supabase
      .from("meal_analysis")
      .insert([insertObj]);

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
  const id = searchParams.get("id");
  const anon_id = searchParams.get("anon_id");
  const email = searchParams.get("email");
  const meal = searchParams.get("meal");
  const latest = searchParams.get("latest");
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createClient(cookies());

  // 분석 상세(id) 조회: 가장 먼저 처리
  if (id) {
    const { data, error } = await supabase
      .from("meal_analysis")
      .select("meal_text, result, analyzed_at, email")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  // 로그인된 사용자(email) 기준 최신 분석 결과 조회
  if (email && latest === "1") {
    const { data, error } = await supabase
      .from("meal_analysis")
      .select("result, analyzed_at")
      .eq("email", email)
      .order("analyzed_at", { ascending: false })
      .limit(1);
    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 500 });
    }
    if (data && data.length > 0) {
      return NextResponse.json({
        result: data[0].result,
        lastAnalyzedAt: data[0].analyzed_at,
        analyzed: true,
      });
    } else {
      return NextResponse.json({ analyzed: false });
    }
  }

  // 로그인된 사용자(email) 분석 히스토리 조회 (최근 30개)
  if (email && !latest) {
    const { data, error } = await supabase
      .from("meal_analysis")
      .select("id, meal_text, result, analyzed_at")
      .eq("email", email)
      .order("analyzed_at", { ascending: false })
      .limit(30);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ history: data });
  }

  // 비회원(anon_id) 기준 최신 분석 결과 조회
  if (anon_id && latest === "1") {
    const { data, error } = await supabase
      .from("meal_analysis")
      .select("result, analyzed_at")
      .eq("anon_id", anon_id)
      .order("analyzed_at", { ascending: false })
      .limit(1);
    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 500 });
    }
    if (data && data.length > 0) {
      return NextResponse.json({
        result: data[0].result,
        lastAnalyzedAt: data[0].analyzed_at,
        analyzed: true,
      });
    } else {
      return NextResponse.json({ analyzed: false });
    }
  }

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
