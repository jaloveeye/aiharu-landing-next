import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { apiError } from "@/app/utils/apiError";
import { requireEnv } from "@/app/utils/checkEnv";

export async function POST(request: NextRequest) {
  try {
    requireEnv("NEXT_PUBLIC_SUPABASE_URL");
    requireEnv("SUPABASE_SERVICE_ROLE_KEY");

    const supabaseClient = await createClient();

    // RLS 비활성화
    const { error: rlsError } = await supabaseClient.rpc("exec_sql", {
      sql: "ALTER TABLE prompt_results DISABLE ROW LEVEL SECURITY;",
    });

    if (rlsError) {
      return apiError({
        error: rlsError,
        userMessage: "RLS 비활성화 실패",
        status: 500,
      });
    }

    // 품질 분석 관련 컬럼 추가
    const { error: qualityError } = await supabaseClient.rpc("exec_sql", {
      sql: `
        ALTER TABLE prompt_results 
        ADD COLUMN IF NOT EXISTS quality_metrics JSONB,
        ADD COLUMN IF NOT EXISTS quality_grade VARCHAR(10),
        ADD COLUMN IF NOT EXISTS quality_suggestions TEXT[];
      `,
    });

    if (qualityError) {
      console.error("품질 분석 컬럼 추가 실패:", qualityError);
    } else {
      console.log("✅ 품질 분석 컬럼 추가 완료");
    }

    return NextResponse.json({
      success: true,
      message: "데이터베이스 설정 완료 - RLS 비활성화됨",
    });
  } catch (error) {
    return apiError({
      error,
      userMessage: error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
      status: 500,
    });
  }
}
