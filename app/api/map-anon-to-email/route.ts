import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { apiError } from "@/app/utils/apiError";

type MapAnonToEmailRequest = {
  anon_id?: string;
  email?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { anon_id, email } = (await req.json()) as MapAnonToEmailRequest;
    if (!anon_id || !email) {
      return NextResponse.json(
        { error: "anon_id와 email은 필수입니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user || authData.user.email !== email) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }
    const { error } = await supabase
      .from("meal_analysis")
      .update({ email })
      .eq("anon_id", anon_id)
      .is("email", null); // 이미 email이 없는 데이터만 업데이트
    if (error) {
      return apiError({
        error,
        userMessage: "이메일 매핑 처리 중 오류가 발생했습니다.",
        status: 500,
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError({
      error,
      userMessage: "요청 처리 중 오류가 발생했습니다.",
      status: 500,
    });
  }
}
