import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { apiError } from "@/app/utils/apiError";
import { requireInternalApi } from "@/app/utils/internalApiAuth";

export async function DELETE(request: NextRequest) {
  const unauthorized = requireInternalApi(request);
  if (unauthorized) return unauthorized;
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];
    
    // 오늘 생성된 프롬프트 결과 삭제
    const { error } = await supabase
      .from('prompt_results')
      .delete()
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (error) {
      return apiError({
        error,
        userMessage: "프롬프트 결과 삭제에 실패했습니다.",
        status: 500,
      });
    }

    return NextResponse.json({
      message: '오늘의 프롬프트 결과가 성공적으로 삭제되었습니다.',
      deletedDate: today
    });

  } catch (error) {
    return apiError({
      error,
      userMessage: "프롬프트 결과 삭제 중 오류가 발생했습니다.",
      status: 500,
    });
  }
}
