import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

const API_BASE_URL = "https://connect-agent.aiharu.net";

// API 키 발급 (인증된 사용자는 히스토리에 저장, 비인증 사용자도 발급 가능)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // 인증 여부와 관계없이 API 키 발급 가능

    const body = await request.json();
    const { email, name, description } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "이메일과 API 키 이름을 입력해주세요." },
        { status: 400 }
      );
    }

    // 외부 API에 API 키 발급 요청
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        description: description || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || "API 키 발급에 실패했습니다." 
        },
        { status: response.status || 500 }
      );
    }

    // 성공 시 데이터 반환
    return NextResponse.json({
      success: true,
      data: data.data,
      message: "API 키가 성공적으로 발급되었습니다.",
    });
  } catch (error) {
    console.error("API 키 발급 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

