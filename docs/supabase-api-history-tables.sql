-- API 키 발급 히스토리 테이블
CREATE TABLE IF NOT EXISTS api_key_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  encrypted_api_key TEXT NOT NULL, -- 암호화된 API 키
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API 생성 히스토리 테이블
CREATE TABLE IF NOT EXISTS api_generation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('adventure', 'riddle')),
  encrypted_request TEXT NOT NULL, -- 암호화된 요청 데이터
  encrypted_response TEXT NOT NULL, -- 암호화된 응답 데이터
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_api_key_history_user_id ON api_key_history(user_id);
CREATE INDEX IF NOT EXISTS idx_api_key_history_created_at ON api_key_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_user_id ON api_generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_created_at ON api_generation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_type ON api_generation_history(type);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE api_key_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_generation_history ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회/삽입/삭제 가능
CREATE POLICY "Users can view their own API key history"
  ON api_key_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API key history"
  ON api_key_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API key history"
  ON api_key_history FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own API generation history"
  ON api_generation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API generation history"
  ON api_generation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API generation history"
  ON api_generation_history FOR DELETE
  USING (auth.uid() = user_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_api_key_history_updated_at
  BEFORE UPDATE ON api_key_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_generation_history_updated_at
  BEFORE UPDATE ON api_generation_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

