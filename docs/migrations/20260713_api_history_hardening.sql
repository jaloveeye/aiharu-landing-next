ALTER TABLE api_key_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_generation_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert API key history" ON api_key_history;
DROP POLICY IF EXISTS "Users can insert API generation history" ON api_generation_history;
DROP POLICY IF EXISTS "Users can insert their own API key history" ON api_key_history;
DROP POLICY IF EXISTS "Users can insert their own API generation history" ON api_generation_history;

CREATE POLICY "Users can insert their own API key history"
  ON api_key_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert their own API generation history"
  ON api_generation_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Anonymous writes are accepted only through rate-limited server APIs using service-role.
