-- API 키 발급 히스토리 테이블 (익명 사용자 지원)
-- 기존 테이블이 있다면 ALTER로 수정, 없다면 CREATE

-- user_id를 nullable로 변경하고 anonymous_id 추가
ALTER TABLE api_key_history 
  ALTER COLUMN user_id DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS api_key_history_user_id_fkey;

ALTER TABLE api_key_history 
  ADD COLUMN IF NOT EXISTS anonymous_id TEXT;

-- API 생성 히스토리 테이블도 동일하게 수정
ALTER TABLE api_generation_history 
  ALTER COLUMN user_id DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS api_generation_history_user_id_fkey;

ALTER TABLE api_generation_history 
  ADD COLUMN IF NOT EXISTS anonymous_id TEXT;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_api_key_history_anonymous_id ON api_key_history(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_anonymous_id ON api_generation_history(anonymous_id);

-- RLS 정책 수정 (익명 사용자도 삽입 가능하도록)
DROP POLICY IF EXISTS "Users can insert their own API key history" ON api_key_history;
DROP POLICY IF EXISTS "Users can insert their own API generation history" ON api_generation_history;

-- 인증된 사용자는 자신의 데이터만 조회/삭제 가능
-- 익명 사용자는 자신의 anonymous_id로만 조회/삭제 가능
CREATE POLICY "Users can insert API key history"
  ON api_key_history FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
  );

CREATE POLICY "Users can insert API generation history"
  ON api_generation_history FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
  );

-- 관리자용 통계 뷰 (서비스 역할 키로만 접근 가능)
CREATE OR REPLACE VIEW api_statistics AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) as authenticated_key_issuances,
  COUNT(*) FILTER (WHERE anonymous_id IS NOT NULL) as anonymous_key_issuances,
  COUNT(*) as total_key_issuances
FROM api_key_history
GROUP BY DATE(created_at);

CREATE OR REPLACE VIEW api_generation_statistics AS
SELECT 
  DATE(created_at) as date,
  type,
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) as authenticated_generations,
  COUNT(*) FILTER (WHERE anonymous_id IS NOT NULL) as anonymous_generations,
  COUNT(*) as total_generations,
  COUNT(*) FILTER (WHERE success = true) as successful_generations,
  COUNT(*) FILTER (WHERE success = false) as failed_generations
FROM api_generation_history
GROUP BY DATE(created_at), type;

