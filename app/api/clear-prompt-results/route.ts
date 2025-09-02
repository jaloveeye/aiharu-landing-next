import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 모든 프롬프트 결과 삭제
    const { error } = await supabase
      .from('prompt_results')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 모든 행 삭제

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "모든 프롬프트 결과가 삭제되었습니다.",
      success: true
    });
  } catch (error) {
    console.error('프롬프트 결과 삭제 오류:', error);
    return NextResponse.json(
      { error: "프롬프트 결과 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
