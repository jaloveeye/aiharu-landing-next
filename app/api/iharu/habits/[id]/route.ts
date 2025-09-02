import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import {
  getHabit,
  updateHabit,
  deleteHabit,
  checkInHabit,
} from "@/app/utils/iharu/habits";
import { UpdateHabitRequest } from "@/app/utils/iharu/types";

// GET: 특정 습관 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const habit = await getHabit(id);

    if (!habit) {
      return NextResponse.json(
        { error: "습관을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 본인의 습관만 조회 가능
    if (habit.user_id !== user.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    return NextResponse.json({ habit });
  } catch (error) {
    console.error("습관 조회 오류:", error);
    return NextResponse.json(
      { error: "습관 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PUT: 습관 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const body: UpdateHabitRequest = await request.json();

    // 기존 습관 조회하여 권한 확인
    const existingHabit = await getHabit(id);
    if (!existingHabit) {
      return NextResponse.json(
        { error: "습관을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (existingHabit.user_id !== user.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    const updatedHabit = await updateHabit(id, body);

    if (!updatedHabit) {
      return NextResponse.json(
        { error: "습관 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ habit: updatedHabit });
  } catch (error) {
    console.error("습관 수정 오류:", error);
    return NextResponse.json(
      { error: "습관 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 습관 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // 기존 습관 조회하여 권한 확인
    const existingHabit = await getHabit(id);
    if (!existingHabit) {
      return NextResponse.json(
        { error: "습관을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (existingHabit.user_id !== user.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    const success = await deleteHabit(id);

    if (!success) {
      return NextResponse.json(
        { error: "습관 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "습관이 삭제되었습니다." });
  } catch (error) {
    console.error("습관 삭제 오류:", error);
    return NextResponse.json(
      { error: "습관 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 습관 체크인
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // 기존 습관 조회하여 권한 확인
    const existingHabit = await getHabit(id);
    if (!existingHabit) {
      return NextResponse.json(
        { error: "습관을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (existingHabit.user_id !== user.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { notes, mood_rating } = body;

    const log = await checkInHabit(id, user.id, notes, mood_rating);

    if (!log) {
      return NextResponse.json(
        { error: "체크인에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("습관 체크인 오류:", error);
    return NextResponse.json(
      { error: "습관 체크인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
