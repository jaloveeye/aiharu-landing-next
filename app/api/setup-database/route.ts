import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // RLS 비활성화
    const { error: rlsError } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE prompt_results DISABLE ROW LEVEL SECURITY;",
    });

    if (rlsError) {
      console.error("Error disabling RLS:", rlsError);
      return NextResponse.json(
        {
          success: false,
          error: "RLS 비활성화 실패",
          details: rlsError,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "데이터베이스 설정 완료 - RLS 비활성화됨",
    });
  } catch (error) {
    console.error("Error in setup-database API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
