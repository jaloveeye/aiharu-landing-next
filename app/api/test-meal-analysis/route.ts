import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("meal_analysis")
    .select("*")
    .order("analyzed_at", { ascending: false })
    .limit(2);
  return NextResponse.json({ data, error });
}
