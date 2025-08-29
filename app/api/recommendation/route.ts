import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { analysis_id, date, content, status, ingredients } = await req.json();

  // 인증된 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("user", user);

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  let data, error;
  if (user_id) {
    ({ data, error } = await supabase.rpc("recommendation_stats_by_user", {
      user_id,
    }));
  } else {
    ({ data, error } = await supabase.rpc("recommendation_stats"));
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
