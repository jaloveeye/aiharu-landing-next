-- 프롬프트 결과 저장 테이블
CREATE TABLE prompt_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id VARCHAR(50) NOT NULL,
  prompt_title VARCHAR(255) NOT NULL,
  prompt_content TEXT NOT NULL,
  prompt_category VARCHAR(50) NOT NULL,
  prompt_difficulty VARCHAR(20) NOT NULL,
  prompt_tags TEXT[] NOT NULL,
  ai_result TEXT NOT NULL,
  ai_model VARCHAR(50),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_prompt_results_created_at ON prompt_results(created_at DESC);
CREATE INDEX idx_prompt_results_category ON prompt_results(prompt_category);
CREATE INDEX idx_prompt_results_difficulty ON prompt_results(prompt_difficulty);
-- RLS (Row Level Security) 비활성화 - 모든 사용자가 읽기/쓰기 가능
ALTER TABLE prompt_results DISABLE ROW LEVEL SECURITY;

-- 또는 RLS를 유지하면서 모든 사용자에게 모든 권한을 주는 정책
-- ALTER TABLE prompt_results ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all access" ON prompt_results FOR ALL USING (true) WITH CHECK (true);

-- AI 뉴스 저장 테이블
CREATE TABLE ai_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  url VARCHAR(1000) NOT NULL UNIQUE,
  source VARCHAR(200) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_ai_news_published_at ON ai_news(published_at DESC);
CREATE INDEX idx_ai_news_category ON ai_news(category);
CREATE INDEX idx_ai_news_source ON ai_news(source);
CREATE INDEX idx_ai_news_url ON ai_news(url);

-- RLS (Row Level Security) 비활성화 - 모든 사용자가 읽기/쓰기 가능
ALTER TABLE ai_news DISABLE ROW LEVEL SECURITY;

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_prompt_results_updated_at
  BEFORE UPDATE ON prompt_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_news_updated_at
  BEFORE UPDATE ON ai_news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
