import { NextResponse } from "next/server";
import { fetchTestRecipes } from "@/app/utils/supabase/test-recipes";

export async function GET() {
  try {
    const { data, count } = await fetchTestRecipes();
    return NextResponse.json({ data, count });
  } catch (error: any) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json(
      {
        error: String(error),
        stack: error?.stack,
        supabaseError: error?.message || error?.details || null,
      },
      { status: 500 }
    );
  }
}
