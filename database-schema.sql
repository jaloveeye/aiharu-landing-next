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
  embedding VECTOR(1536),
  quality_metrics JSONB,
  quality_grade VARCHAR(10),
  quality_suggestions TEXT[],
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
  quality_score INTEGER DEFAULT 50 CHECK (quality_score >= 0 AND quality_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_ai_news_published_at ON ai_news(published_at DESC);
CREATE INDEX idx_ai_news_category ON ai_news(category);
CREATE INDEX idx_ai_news_source ON ai_news(source);
CREATE INDEX idx_ai_news_url ON ai_news(url);
CREATE INDEX idx_ai_news_quality_score ON ai_news(quality_score DESC);
CREATE INDEX idx_ai_news_quality_published ON ai_news(quality_score DESC, published_at DESC);

-- RLS (Row Level Security) 비활성화 - 모든 사용자가 읽기/쓰기 가능
ALTER TABLE ai_news DISABLE ROW LEVEL SECURITY;

-- 아이하루 습관 관리 테이블
CREATE TABLE iharu_habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  child_name VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'morning', 'afternoon', 'evening', 'custom'
  frequency VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  target_count INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 습관 체크인 기록
CREATE TABLE iharu_habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES iharu_habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 목표 관리 테이블
CREATE TABLE iharu_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  child_name VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  progress INTEGER DEFAULT 0,
  target_value INTEGER DEFAULT 100,
  unit VARCHAR(50), -- 'pages', 'minutes', 'times', etc.
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 일일 기록 테이블
CREATE TABLE iharu_diary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  child_name VARCHAR(100),
  date DATE NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  activities TEXT[],
  highlights TEXT,
  challenges TEXT,
  parent_notes TEXT,
  child_notes TEXT,
  photos TEXT[], -- URL 배열
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 보상 시스템 테이블
CREATE TABLE iharu_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  child_name VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 포인트 적립/사용 기록
CREATE TABLE iharu_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  child_name VARCHAR(100),
  points INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'earned', 'spent'
  source VARCHAR(100), -- 'habit_completion', 'goal_achievement', 'reward_purchase'
  source_id UUID, -- 관련 habit_id, goal_id, reward_id
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 아이하루 인덱스 생성
CREATE INDEX idx_iharu_habits_user_id ON iharu_habits(user_id);
CREATE INDEX idx_iharu_habit_logs_habit_id ON iharu_habit_logs(habit_id);
CREATE INDEX idx_iharu_habit_logs_date ON iharu_habit_logs(completed_at);
CREATE INDEX idx_iharu_goals_user_id ON iharu_goals(user_id);
CREATE INDEX idx_iharu_diary_user_date ON iharu_diary(user_id, date);
CREATE INDEX idx_iharu_points_user_id ON iharu_points(user_id);

-- 아이하루 RLS 비활성화
ALTER TABLE iharu_habits DISABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_habit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_diary DISABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_rewards DISABLE ROW LEVEL SECURITY;
ALTER TABLE iharu_points DISABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER update_iharu_habits_updated_at
  BEFORE UPDATE ON iharu_habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iharu_goals_updated_at
  BEFORE UPDATE ON iharu_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iharu_diary_updated_at
  BEFORE UPDATE ON iharu_diary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
