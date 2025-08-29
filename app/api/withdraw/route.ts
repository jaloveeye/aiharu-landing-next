import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, reason } = await request.json();

    // 필수 필드 검증
    if (!email) {
      return NextResponse.json(
        { error: "이메일 주소는 필수입니다." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = await createClient();

    // 회원 존재 여부 확인
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "해당 이메일로 가입된 회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 탈퇴 요청 기록
    const { error: withdrawError } = await supabase
      .from("withdraw_requests")
      .insert({
        user_id: user.id,
        email: email,
        reason: reason || null,
        requested_at: new Date().toISOString(),
        status: "pending",
      });

    if (withdrawError) {
      console.error("탈퇴 요청 기록 실패:", withdrawError);
      return NextResponse.json(
        { error: "탈퇴 요청 처리 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 회원 상태를 탈퇴 대기로 변경
    const { error: updateError } = await supabase
      .from("users")
      .update({
        status: "withdraw_pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("회원 상태 업데이트 실패:", updateError);
      // 탈퇴 요청 기록은 성공했으므로 부분 성공으로 처리
    }

    // 관리자에게 알림 이메일 발송 (선택사항)
    // await sendWithdrawNotificationEmail(email, reason);

    return NextResponse.json({
      success: true,
      message: "회원 탈퇴 요청이 성공적으로 접수되었습니다.",
      withdrawDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30일 후
    });
  } catch (error) {
    console.error("회원 탈퇴 요청 처리 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

// 탈퇴 요청 상태 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "이메일 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("withdraw_requests")
      .select("*")
      .eq("email", email)
      .order("requested_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("탈퇴 요청 조회 실패:", error);
      return NextResponse.json(
        { error: "탈퇴 요청 조회 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "해당 이메일의 탈퇴 요청을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      withdrawRequest: data[0],
    });
  } catch (error) {
    console.error("탈퇴 요청 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
