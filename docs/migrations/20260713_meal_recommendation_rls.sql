ALTER TABLE meal_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_history ENABLE ROW LEVEL SECURITY;
-- These tables are accessed only by service-role code after API ownership checks.

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_manage_own_recommendations" ON recommendations;
CREATE POLICY "users_manage_own_recommendations" ON recommendations
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
