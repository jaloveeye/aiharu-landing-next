import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 오늘 날짜 (한국 시간 기준)
    const today = new Date();
    const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000); // UTC+9
    const todayString = koreaTime.toISOString().split("T")[0]; // YYYY-MM-DD 형식

    console.log(`🗑️ ${todayString} 날짜의 프롬프트 결과 삭제 시작`);

    // 오늘 생성된 프롬프트 결과만 삭제
    const { error, count } = await supabase
      .from("prompt_results")
      .delete()
      .gte("created_at", `${todayString}T00:00:00.000Z`)
      .lt("created_at", `${todayString}T23:59:59.999Z`);

    if (error) {
      console.error("프롬프트 결과 삭제 오류:", error);
      throw error;
    }

    console.log(`✅ ${todayString} 날짜의 프롬프트 결과 삭제 완료`);

    return NextResponse.json({
      message: `${todayString} 날짜의 프롬프트 결과가 삭제되었습니다.`,
      success: true,
      deletedDate: todayString,
    });
  } catch (error) {
    console.error("프롬프트 결과 삭제 오류:", error);
    return NextResponse.json(
      { error: "프롬프트 결과 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 모든 프롬프트 결과 삭제 (기존 기능 유지)
    const { error } = await supabase
      .from("prompt_results")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "모든 프롬프트 결과가 삭제되었습니다.",
      success: true,
    });
  } catch (error) {
    console.error("프롬프트 결과 삭제 오류:", error);
    return NextResponse.json(
      { error: "프롬프트 결과 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
