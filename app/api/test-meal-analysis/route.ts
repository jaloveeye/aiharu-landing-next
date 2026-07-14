import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { requireDevelopment } from "@/app/utils/internalApiAuth";

export async function GET(req: NextRequest) {
  const unavailable = requireDevelopment();
  if (unavailable) return unavailable;
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  let query = supabase
    .from("meal_analysis")
    .select("*")
    .order("analyzed_at", { ascending: false });
  if (email) {
    query = query.eq("email", email);
  }
  const { data, error } = await query;
  return NextResponse.json({ data, error });
}
