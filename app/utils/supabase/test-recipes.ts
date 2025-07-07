import { createClient } from "./server";
import { cookies } from "next/headers";

export async function fetchTestRecipes() {
  const supabase = createClient(cookies());
  let query = supabase.from("recipes").select(
    `
      id,
      title,
      main_ingredient,
      ingredient_count,
      dish_type,
      servings,
      meal_category,
      cooking_time,
      image_url
    `,
    { count: "exact" }
  );
  const { data, error, count } = await query;
  if (error) {
    throw error;
  }
  return { data, count };
}
