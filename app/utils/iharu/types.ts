// 아이하루 기본 타입들
export interface IharuHabit {
  id: string;
  user_id: string;
  child_name?: string;
  title: string;
  description?: string;
  category: "morning" | "afternoon" | "evening" | "custom";
  frequency: "daily" | "weekly" | "monthly";
  target_count: number;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IharuHabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes?: string;
  mood_rating?: number;
  created_at: string;
}

export interface IharuGoal {
  id: string;
  user_id: string;
  child_name?: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number;
  target_value: number;
  unit?: string;
  status: "active" | "completed" | "paused";
  created_at: string;
  updated_at: string;
}

export interface IharuDiary {
  id: string;
  user_id: string;
  child_name?: string;
  date: string;
  mood_rating?: number;
  activities?: string[];
  highlights?: string;
  challenges?: string;
  parent_notes?: string;
  child_notes?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface IharuReward {
  id: string;
  user_id: string;
  child_name?: string;
  title: string;
  description?: string;
  points_required: number;
  is_active: boolean;
  created_at: string;
}

export interface IharuPoint {
  id: string;
  user_id: string;
  child_name?: string;
  points: number;
  type: "earned" | "spent";
  source?: string;
  source_id?: string;
  notes?: string;
  created_at: string;
}

// API 요청/응답 타입들
export interface CreateHabitRequest {
  child_name?: string;
  title: string;
  description?: string;
  category: IharuHabit["category"];
  frequency: IharuHabit["frequency"];
  target_count?: number;
}

export interface UpdateHabitRequest {
  title?: string;
  description?: string;
  category?: IharuHabit["category"];
  frequency?: IharuHabit["frequency"];
  target_count?: number;
  is_active?: boolean;
}

export interface CreateGoalRequest {
  child_name?: string;
  title: string;
  description?: string;
  target_date?: string;
  target_value?: number;
  unit?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  target_date?: string;
  progress?: number;
  target_value?: number;
  unit?: string;
  status?: IharuGoal["status"];
}

export interface CreateDiaryRequest {
  child_name?: string;
  date: string;
  mood_rating?: number;
  activities?: string[];
  highlights?: string;
  challenges?: string;
  parent_notes?: string;
  child_notes?: string;
  photos?: string[];
}

export interface CreateRewardRequest {
  child_name?: string;
  title: string;
  description?: string;
  points_required: number;
}

// 대시보드 통계 타입
export interface IharuStats {
  total_habits: number;
  active_habits: number;
  completed_today: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
}

// 습관 카테고리 옵션
export const HABIT_CATEGORIES = [
  { value: "morning", label: "아침", emoji: "🌅" },
  { value: "afternoon", label: "오후", emoji: "☀️" },
  { value: "evening", label: "저녁", emoji: "🌙" },
  { value: "custom", label: "커스텀", emoji: "⭐" },
] as const;

// 습관 빈도 옵션
export const HABIT_FREQUENCIES = [
  { value: "daily", label: "매일", emoji: "📅" },
  { value: "weekly", label: "매주", emoji: "📆" },
  { value: "monthly", label: "매월", emoji: "🗓️" },
] as const;

// 감정 등급 옵션
export const MOOD_RATINGS = [
  { value: 1, label: "매우 나쁨", emoji: "😢" },
  { value: 2, label: "나쁨", emoji: "😕" },
  { value: 3, label: "보통", emoji: "😐" },
  { value: 4, label: "좋음", emoji: "😊" },
  { value: 5, label: "매우 좋음", emoji: "😄" },
] as const;
