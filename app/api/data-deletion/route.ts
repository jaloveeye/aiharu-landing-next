import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { apiError } from "@/app/utils/apiError";

type DataDeletionRequest = {
  email?: unknown;
  dataTypes?: unknown;
};

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^(?:[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(value);
}

function toStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : null;
}

function parseRequestBody(body: unknown): { email: string; dataTypes: string[] } {
  if (!body || typeof body !== "object") {
    throw new Error("요청 형식이 올바르지 않습니다.");
  }

  const parsed = body as DataDeletionRequest;
  const email = isValidEmail(parsed.email) ? parsed.email : null;
  const dataTypes = toStringArray(parsed.dataTypes);

  if (!email) {
    throw new Error("email은 필수이며, 올바른 이메일 형식이어야 합니다.");
  }

  if (!dataTypes) {
    throw new Error("삭제할 데이터를 하나 이상 문자열로 전달해 주세요.");
  }

  return { email, dataTypes };
}

export async function POST(request: NextRequest) {
  try {
    let email: string;
    let dataTypes: string[];
    try {
      ({ email, dataTypes } = parseRequestBody(await request.json()));
    } catch (error) {
      return apiError({
        error,
        userMessage: error instanceof Error ? error.message : "요청 형식이 올바르지 않습니다.",
        status: 400,
      });
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user || authData.user.email !== email) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return apiError({
        error: userError ?? "USER_NOT_FOUND",
        userMessage: "해당 이메일로 가입된 회원을 찾을 수 없습니다.",
        status: 404,
      });
    }

    const { error: deletionError } = await supabase
      .from("data_deletion_requests")
      .insert({
        user_id: user.id,
        email: email,
        data_types: dataTypes,
        requested_at: new Date().toISOString(),
        status: "pending",
        deletion_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7일 후
      });

    if (deletionError) {
      return apiError({
        error: deletionError,
        userMessage: "데이터 삭제 요청 처리 중 오류가 발생했습니다.",
      });
    }

    // 관리자에게 알림 이메일 발송 (선택사항)
    // await sendDataDeletionNotificationEmail(email, dataTypes);

    return NextResponse.json({
      success: true,
      message: "데이터 삭제 요청이 성공적으로 접수되었습니다.",
      deletionDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 7일 후
      requestedDataTypes: dataTypes,
    });
  } catch (error) {
    return apiError({
      error,
      userMessage: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}

// 데이터 삭제 요청 상태 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return apiError({
        error: "Missing email query",
        userMessage: "이메일 파라미터가 필요합니다.",
        status: 400,
      });
    }

    if (!/^(?:[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(email)) {
      return apiError({
        error: "Invalid email format",
        userMessage: "올바른 이메일 형식이 아닙니다.",
        status: 400,
      });
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user || authData.user.email !== email) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("data_deletion_requests")
      .select("*")
      .eq("email", email)
      .order("requested_at", { ascending: false })
      .limit(1);

    if (error) {
      return apiError({
        error,
        userMessage: "데이터 삭제 요청 조회 중 오류가 발생했습니다.",
      });
    }

    if (!data || data.length === 0) {
      return apiError({
        error: "No data deletion request",
        userMessage: "해당 이메일의 데이터 삭제 요청을 찾을 수 없습니다.",
        status: 404,
      });
    }

    return NextResponse.json({
      deletionRequest: data[0],
    });
  } catch (error) {
    return apiError({
      error,
      userMessage: "서버 오류가 발생했습니다.",
    });
  }
}
