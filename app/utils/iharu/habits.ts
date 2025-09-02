import { createClient } from "@/app/utils/supabase/client";
import {
  IharuHabit,
  IharuHabitLog,
  CreateHabitRequest,
  UpdateHabitRequest,
} from "./types";

// 습관 생성
export async function createHabit(
  userId: string,
  habitData: CreateHabitRequest
): Promise<IharuHabit | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("iharu_habits")
      .insert({
        user_id: userId,
        ...habitData,
        target_count: habitData.target_count || 1,
      })
      .select()
      .single();

    if (error) {
      console.error("습관 생성 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("습관 생성 중 오류:", error);
    return null;
  }
}

// 사용자의 모든 습관 조회
export async function getUserHabits(userId: string): Promise<IharuHabit[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("iharu_habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("습관 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("습관 조회 중 오류:", error);
    return [];
  }
}

// 활성 습관만 조회
export async function getActiveHabits(userId: string): Promise<IharuHabit[]> {
  try {
    console.log("getActiveHabits 호출됨, userId:", userId);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("iharu_habits")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("활성 습관 조회 오류:", error);
      // 테이블이 존재하지 않는 경우 빈 배열 반환
      if (error.code === '42P01') {
        console.log("iharu_habits 테이블이 존재하지 않습니다. 빈 배열을 반환합니다.");
        return [];
      }
      return [];
    }

    console.log("활성 습관 조회 성공:", data);
    return data || [];
  } catch (error) {
    console.error("활성 습관 조회 중 오류:", error);
    return [];
  }
}

// 특정 습관 조회
export async function getHabit(habitId: string): Promise<IharuHabit | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("iharu_habits")
      .select("*")
      .eq("id", habitId)
      .single();

    if (error) {
      console.error("습관 조회 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("습관 조회 중 오류:", error);
    return null;
  }
}

// 습관 수정
export async function updateHabit(
  habitId: string,
  updates: UpdateHabitRequest
): Promise<IharuHabit | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("iharu_habits")
      .update(updates)
      .eq("id", habitId)
      .select()
      .single();

    if (error) {
      console.error("습관 수정 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("습관 수정 중 오류:", error);
    return null;
  }
}

// 습관 삭제
export async function deleteHabit(habitId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("iharu_habits")
      .delete()
      .eq("id", habitId);

    if (error) {
      console.error("습관 삭제 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("습관 삭제 중 오류:", error);
    return false;
  }
}

// 습관 체크인
export async function checkInHabit(
  habitId: string,
  userId: string,
  notes?: string,
  moodRating?: number
): Promise<IharuHabitLog | null> {
  try {
    const supabase = createClient();

    // 체크인 로그 생성
    const { data: logData, error: logError } = await supabase
      .from("iharu_habit_logs")
      .insert({
        habit_id: habitId,
        user_id: userId,
        notes,
        mood_rating: moodRating,
      })
      .select()
      .single();

    if (logError) {
      console.error("체크인 로그 생성 오류:", logError);
      return null;
    }

    // 습관 통계 업데이트
    await updateHabitStats(habitId);

    return logData;
  } catch (error) {
    console.error("습관 체크인 중 오류:", error);
    return null;
  }
}

// 습관 통계 업데이트
async function updateHabitStats(habitId: string): Promise<void> {
  try {
    const supabase = createClient();

    // 오늘 체크인 횟수 조회
    const today = new Date().toISOString().split("T")[0];
    const { data: todayLogs } = await supabase
      .from("iharu_habit_logs")
      .select("id")
      .eq("habit_id", habitId)
      .gte("completed_at", `${today}T00:00:00`)
      .lte("completed_at", `${today}T23:59:59`);

    // 전체 체크인 횟수 조회
    const { data: allLogs } = await supabase
      .from("iharu_habit_logs")
      .select("completed_at")
      .eq("habit_id", habitId)
      .order("completed_at", { ascending: false });

    const totalCompletions = allLogs?.length || 0;

    // 연속 달성 스트릭 계산
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: string | null = null;

    if (allLogs && allLogs.length > 0) {
      for (const log of allLogs) {
        const logDate = log.completed_at.split("T")[0];

        if (!lastDate) {
          lastDate = logDate;
          tempStreak = 1;
        } else {
          const daysDiff = Math.floor(
            (new Date(lastDate).getTime() - new Date(logDate).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 1) {
            tempStreak++;
          } else {
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
            tempStreak = 1;
          }
          lastDate = logDate;
        }
      }

      // 마지막 스트릭도 고려
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }

      // 현재 스트릭 계산 (오늘 포함)
      const todayLogsCount = todayLogs?.length || 0;
      if (todayLogsCount > 0) {
        currentStreak = tempStreak;
      } else {
        // 오늘 체크인하지 않았다면 0
        currentStreak = 0;
      }
    }

    // 습관 통계 업데이트
    await supabase
      .from("iharu_habits")
      .update({
        total_completions: totalCompletions,
        current_streak: currentStreak,
        longest_streak: longestStreak,
      })
      .eq("id", habitId);
  } catch (error) {
    console.error("습관 통계 업데이트 중 오류:", error);
  }
}

// 오늘 체크인한 습관 조회
export async function getTodayCheckedHabits(userId: string): Promise<string[]> {
  try {
    console.log("getTodayCheckedHabits 호출됨, userId:", userId);
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("iharu_habit_logs")
      .select("habit_id")
      .eq("user_id", userId)
      .gte("completed_at", `${today}T00:00:00`)
      .lte("completed_at", `${today}T23:59:59`);

    if (error) {
      console.error("오늘 체크인 습관 조회 오류:", error);
      // 테이블이 존재하지 않는 경우 빈 배열 반환
      if (error.code === '42P01') {
        console.log("iharu_habit_logs 테이블이 존재하지 않습니다. 빈 배열을 반환합니다.");
        return [];
      }
      return [];
    }

    console.log("오늘 체크인 습관 조회 성공:", data);
    return data?.map((log) => log.habit_id) || [];
  } catch (error) {
    console.error("오늘 체크인 습관 조회 중 오류:", error);
    return [];
  }
}

// 습관 체크인 히스토리 조회
export async function getHabitLogs(
  habitId: string,
  limit = 30
): Promise<IharuHabitLog[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("iharu_habit_logs")
      .select("*")
      .eq("habit_id", habitId)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("습관 로그 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("습관 로그 조회 중 오류:", error);
    return [];
  }
}
