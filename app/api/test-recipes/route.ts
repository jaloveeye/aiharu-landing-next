import { NextResponse } from "next/server";
import { fetchTestRecipes } from "@/app/utils/supabase/test-recipes";
import { apiError } from "@/app/utils/apiError";

export async function GET() {
  try {
    const { data, count } = await fetchTestRecipes();
    return NextResponse.json({ data, count });
  } catch (error) {
    return apiError({
      error,
      userMessage: "테스트 레시피 조회 중 오류가 발생했습니다.",
      status: 500,
    });
  }
}
