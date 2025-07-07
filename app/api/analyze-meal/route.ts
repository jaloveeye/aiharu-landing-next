import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { requireEnv } from "@/app/utils/checkEnv";
import { apiError } from "@/app/utils/apiError";
import {
  saveRecommendationsFromAnalysis,
  generateFeedbacks,
} from "@/app/utils/recommendation";

const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });

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

// OpenAI Vision 결과에서 음식명/양을 추출해 meal_text로 변환
function extractMealTextFromResult(result: string): string {
  // 1. "이 음식은 ...로 구성되어 있습니다." 문장 추출
  const match = result.match(/이 음식은 ([^\n]+)로 구성되어 있습니다/);
  if (match && match[1]) {
    // 쉼표로 분리
    return match[1]
      .split(",")
      .map((s) => s.trim())
      .join(", ");
  }
  // 2. 번호 매긴 항목 추출 (예: 1. **우유 (약 200ml)**)
  const lines = result.split(/\n/);
  const items = lines
    .map((line) => {
      const m = line.match(/\*\*(.+?)\*\*\s*\((.+?)\)/);
      if (m) return `${m[1]} ${m[2]}`;
      return null;
    })
    .filter(Boolean);
  if (items.length > 0) return items.join(", ");
  // 3. 백업: 첫 2~3줄
  return lines.slice(0, 2).join(" ");
}

// 실제 OpenAI 분석 함수로 교체 필요
async function analyzeWithOpenAI(
  meal: string,
  imageBase64?: string
): Promise<{ result: string; sourceType: "image" | "text" }> {
  if (imageBase64) {
    // Step 1: 음식 구성 추출
    const systemPrompt = "당신은 식사 영양사입니다.";
    const userPrompt = `이미지 속 음식 구성을 간단히 분석해 주세요. 사람은 없거나 무시해주세요.`;
    let foodSummary = "";
    try {
      const chat = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        temperature: 0.7,
      });
      foodSummary = chat.choices[0].message.content?.trim() || "";
      if (
        !foodSummary ||
        foodSummary.includes("sorry") ||
        foodSummary.includes("can't")
      ) {
        return {
          result:
            "⚠️ 이미지 분석이 차단되었습니다. 사람 얼굴이 보이지 않도록 다시 촬영해 주세요.",
          sourceType: "image",
        };
      }
    } catch (error: any) {
      console.error(
        "OpenAI Vision API Error (Step 1):",
        error.response?.data || error.message
      );
      return {
        result:
          "⚠️ 이미지 처리 중 문제가 발생했습니다. 음식만 보이도록 다시 시도해 주세요.",
        sourceType: "image",
      };
    }
    // Step 2: 초등학교 1학년 식단 평가
    const systemPrompt2 =
      "당신은 아동 식사 영양사입니다. 아래 식단이 초등학교 1학년 아동의 아침 식사로 충분한지 평가하고, 부족하다면 보완할 점을 알려주세요.";
    const userPrompt2 = `식단: ${foodSummary}\n1. 각 항목별 예상 영양소(열량, 단백질, 탄수화물, 지방 등)를 표로 정리\n2. 전체 식단의 영양 균형 평가 및 2~3줄 보완/추천\n3. 부족한 영양소가 있다면 반드시 아래와 같이 한 줄로 명확하게 작성하세요.\n부족한 영양소: [영양소1, 영양소2, ...]`;
    try {
      const chat2 = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt2 },
          { role: "user", content: userPrompt2 },
        ],
        temperature: 0.7,
      });
      return {
        result: chat2.choices[0].message.content || "",
        sourceType: "image",
      };
    } catch (error: any) {
      console.error(
        "OpenAI Nutrition API Error (Step 2):",
        error.response?.data || error.message
      );
      return {
        result: `⚠️ 음식 인식은 성공했으나 영양 평가 중 문제가 발생했습니다.\n인식된 식단: ${foodSummary}`,
        sourceType: "image",
      };
    }
  } else {
    const systemPrompt =
      "당신은 아동 식사 영양사입니다. 초등학교 1학년 아동의 아침 식사로 적절한지 평가해주세요.";
    const userPrompt = `분석한 식단: (직접 입력한 결과입니다)\n1. 아래 식단을 \"분석한 식단: ...\" 형식으로 한 줄로 요약해 주세요.\n2. 각 항목별로 예상 영양소(열량, 단백질, 탄수화물, 지방 등)를 표로 정리해 주세요.\n3. 전체 식단의 영양 균형을 평가하고, 내일 아침에 보완할 점이나 추천 식단을 2~3줄로 제안해 주세요.\n4. 부족한 영양소가 있다면 반드시 아래와 같이 한 줄로 명확하게 작성하세요.\n부족한 영양소: [영양소1, 영양소2, ...]\n\n식단: ${meal}`;
    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });
    return {
      result: chat.choices[0].message.content || "",
      sourceType: "text",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { meal, anon_id, email, imageBase64 } = await req.json();
    const normalizedMeal = normalizeMeal(meal || "");
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

    // 2. OpenAI로 분석 (이미지/텍스트)
    const { result, sourceType } = await analyzeWithOpenAI(meal, imageBase64);

    // 3. 결과 저장
    const mealTextToSave =
      normalizedMeal || (imageBase64 ? extractMealTextFromResult(result) : "");
    const insertObj: any = {
      meal_text: mealTextToSave,
      result: typeof result === "string" ? result : JSON.stringify(result),
      analyzed_at: today,
      source_type: sourceType,
    };
    if (email) insertObj.email = email;
    if (anon_id) insertObj.anon_id = anon_id;
    const { data, error, status } = await supabase
      .from("meal_analysis")
      .insert([insertObj])
      .select();

    if (error || !data || !data[0]) {
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

    // 추천 자동 추출 및 저장
    await saveRecommendationsFromAnalysis({
      id: data[0].id,
      anon_id: insertObj.anon_id,
      result: insertObj.result,
      analyzed_at: insertObj.analyzed_at,
    });

    // 이전 추천 이력 조회 및 피드백 생성
    const { data: prevRecs } = await supabase
      .from("recommendation_history")
      .select("id, category, content, analysis_id")
      .eq("anon_id", insertObj.anon_id)
      .eq("status", "pending")
      .order("recommended_at", { ascending: true });

    const feedbacks = generateFeedbacks(
      prevRecs || [],
      mealTextToSave,
      typeof result === "string" ? result : JSON.stringify(result)
    );

    // 실천한 추천은 achieved로 업데이트
    for (const fb of feedbacks) {
      if (fb.achieved) {
        await supabase
          .from("recommendation_history")
          .update({ status: "achieved", achieved_at: today })
          .eq("id", fb.id);
      }
    }

    return NextResponse.json({ result, sourceType, cached: false, feedbacks });
  } catch (error: any) {
    return apiError({
      error,
      userMessage:
        "식단 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
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
      .select("meal_text, result, analyzed_at, email, source_type")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    // 해당 분석의 추천/보완사항도 함께 조회
    const { data: recommendations } = await supabase
      .from("recommendation_history")
      .select("id, category, content, status")
      .eq("analysis_id", id)
      .order("category", { ascending: true });
    return NextResponse.json({ ...data, recommendations });
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
      .select("id, meal_text, result, analyzed_at, source_type")
      .eq("email", email)
      .order("analyzed_at", { ascending: false })
      .limit(30);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // 각 분석별 추천/보완사항도 함께 조회
    const ids = (data || []).map((d: any) => d.id);
    let recsById: Record<string, any[]> = {};
    if (ids.length > 0) {
      const { data: recs } = await supabase
        .from("recommendation_history")
        .select("id, category, content, status, analysis_id")
        .in("analysis_id", ids);
      recsById = (recs || []).reduce((acc: any, rec: any) => {
        if (!acc[rec.analysis_id]) acc[rec.analysis_id] = [];
        acc[rec.analysis_id].push(rec);
        return acc;
      }, {});
    }
    const history = (data || []).map((item: any) => ({
      ...item,
      recommendations: recsById[item.id] || [],
    }));
    return NextResponse.json({ history });
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
