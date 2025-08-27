import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createClient(cookies());

  // meal_analysis에서 최근 20개 result 추출 (email 포함)
  const { data: meals, error } = await supabase
    .from("meal_analysis")
    .select("id, analyzed_at, result, email")
    .order("analyzed_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let inserted = 0;
  for (const meal of meals || []) {
    // result에서 '추천' 또는 '식단'이 포함된 첫 줄 추출
    const line = (meal.result || "")
      .split(/\n/)
      .find((l: string) => /추천|식단/.test(l));
    if (!line) continue;

    // email → user_id 매핑
    let user_id = null;
    if (meal.email) {
      // Supabase Auth users 테이블에서 email로 id 조회
      const { data: user } = await supabase
        .from("auth.users")
        .select("id")
        .eq("email", meal.email)
        .maybeSingle();
      if (user) user_id = user.id;
    }

    // 이미 같은 analysis_id가 있으면 skip
    const { data: exists } = await supabase
      .from("recommendations")
      .select("id")
      .eq("analysis_id", meal.id)
      .maybeSingle();
    if (exists) continue;

    await supabase.from("recommendations").insert({
      user_id,
      analysis_id: meal.id,
      date: meal.analyzed_at,
      content: line.trim(),
      ingredients: null,
      status: "pending",
    });
    inserted++;
  }

  return NextResponse.json({ inserted });
}
