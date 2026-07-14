import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { apiError } from "@/app/utils/apiError";

type RecommendationBody = {
  analysis_id: string | null;
  date: string;
  content: string;
  ingredients?: string | string[] | null;
  status?: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    analysis_id,
    date,
    content,
    status,
    ingredients,
  } = (await req.json()) as RecommendationBody;

  // 인증된 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return apiError({
      error: "Unauthorized",
      userMessage: "로그인이 필요합니다.",
      status: 401,
    });
  }

  const { data, error } = await supabase
    .from("recommendations")
    .insert([
      {
        user_id: user.id,
        analysis_id,
        date,
        content,
        ingredients: Array.isArray(ingredients)
          ? ingredients.join(",")
          : ingredients,
        status: status || "pending",
      },
    ])
    .select();

  if (error) {
    return apiError({
      error,
      userMessage: "추천 데이터 저장에 실패했습니다.",
    });
  }
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return apiError({
      error: "Unauthorized",
      userMessage: "로그인이 필요합니다.",
      status: 401,
    });
  }
  const { data, error } = await supabase.rpc("recommendation_stats_by_user", {
    user_id: user.id,
  });
  if (error) {
    return apiError({
      error,
      userMessage: "추천 통계 조회에 실패했습니다.",
    });
  }
  return NextResponse.json({ data });
}
