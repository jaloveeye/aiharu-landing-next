import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { anon_id, email } = await req.json();
  const supabase = createClient(cookies());
  const { error } = await supabase
    .from("meal_analysis")
    .update({ email })
    .eq("anon_id", anon_id)
    .is("email", null); // 이미 email이 없는 데이터만 업데이트
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
