import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import {
  createHabit,
  getUserHabits,
  getActiveHabits,
} from "@/app/utils/iharu/habits";
import { CreateHabitRequest } from "@/app/utils/iharu/types";

// GET: 사용자의 습관 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    let habits;
    if (activeOnly) {
      habits = await getActiveHabits(user.id);
    } else {
      habits = await getUserHabits(user.id);
    }

    return NextResponse.json({ habits });
  } catch (error) {
    console.error("습관 조회 오류:", error);
    return NextResponse.json(
      { error: "습관 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 새 습관 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body: CreateHabitRequest = await request.json();

    // 필수 필드 검증
    if (!body.title || !body.category || !body.frequency) {
      return NextResponse.json(
        { error: "제목, 카테고리, 빈도는 필수입니다." },
        { status: 400 }
      );
    }

    const habit = await createHabit(user.id, body);

    if (!habit) {
      return NextResponse.json(
        { error: "습관 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    console.error("습관 생성 오류:", error);
    return NextResponse.json(
      { error: "습관 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
