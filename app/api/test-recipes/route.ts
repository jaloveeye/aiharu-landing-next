import { NextRequest, NextResponse } from "next/server";
import { fetchTestRecipes } from "@/app/utils/supabase/test-recipes";
import { apiError } from "@/app/utils/apiError";
import { requireDevelopment } from "@/app/utils/internalApiAuth";

export async function GET(_request: NextRequest) {
  const unavailable = requireDevelopment();
  if (unavailable) return unavailable;
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
