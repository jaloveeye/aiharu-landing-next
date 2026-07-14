-- Apply in staging first. Service-role clients bypass RLS.
BEGIN;
ALTER TABLE iharu_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_habits" ON iharu_habits;
CREATE POLICY "users_manage_own_habits" ON iharu_habits FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_manage_own_habit_logs" ON iharu_habit_logs;
CREATE POLICY "users_manage_own_habit_logs" ON iharu_habit_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM iharu_habits
    WHERE iharu_habits.id = iharu_habit_logs.habit_id
      AND iharu_habits.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "users_manage_own_goals" ON iharu_goals;
CREATE POLICY "users_manage_own_goals" ON iharu_goals FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_manage_own_diary" ON iharu_diary;
CREATE POLICY "users_manage_own_diary" ON iharu_diary FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_manage_own_rewards" ON iharu_rewards;
CREATE POLICY "users_manage_own_rewards" ON iharu_rewards FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "users_manage_own_points" ON iharu_points;
CREATE POLICY "users_manage_own_points" ON iharu_points FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
COMMIT;

BEGIN;
ALTER TABLE prompt_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_reads_prompt_results" ON prompt_results;
CREATE POLICY "public_reads_prompt_results" ON prompt_results
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_reads_ai_news" ON ai_news;
CREATE POLICY "public_reads_ai_news" ON ai_news
  FOR SELECT TO anon, authenticated USING (true);
COMMIT;
