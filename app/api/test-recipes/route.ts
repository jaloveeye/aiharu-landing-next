import { NextResponse } from "next/server";
import { testFetchRecipes } from "@/app/utils/supabase/testRecipes";

export async function GET() {
  try {
    const { data, count } = await testFetchRecipes();
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
