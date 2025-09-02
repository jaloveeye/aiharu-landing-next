"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import {
  IharuHabit,
  HABIT_CATEGORIES,
  HABIT_FREQUENCIES,
} from "@/app/utils/iharu/types";
import { getTodayCheckedHabits } from "@/app/utils/iharu/habits";

export default function HabitsPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [habits, setHabits] = useState<IharuHabit[]>([]);
  const [todayCheckedHabits, setTodayCheckedHabits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
      setUserId(data?.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/iharu/habits?active=true");
        const data = await response.json();

        if (response.ok) {
          setHabits(data.habits || []);
        } else {
          console.error("습관 조회 오류:", data.error);
        }

        // 오늘 체크인한 습관 조회
        const checkedHabits = await getTodayCheckedHabits(userId);
        setTodayCheckedHabits(checkedHabits);
      } catch (error) {
        console.error("습관 로딩 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [userId]);

  const handleCheckIn = async (habitId: string) => {
    try {
      const response = await fetch(`/api/iharu/habits/${habitId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        // 체크인 성공 시 상태 업데이트
        setTodayCheckedHabits((prev) => [...prev, habitId]);

        // 습관 목록 새로고침
        const habitsResponse = await fetch("/api/iharu/habits?active=true");
        const habitsData = await habitsResponse.json();
        if (habitsResponse.ok) {
          setHabits(habitsData.habits || []);
        }
      } else {
        console.error("체크인 실패");
      }
    } catch (error) {
      console.error("체크인 오류:", error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm("정말로 이 습관을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/iharu/habits/${habitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 삭제 성공 시 목록에서 제거
        setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
      } else {
        console.error("습관 삭제 실패");
      }
    } catch (error) {
      console.error("습관 삭제 오류:", error);
    }
  };

  const filteredHabits =
    selectedCategory === "all"
      ? habits
      : habits.filter((habit) => habit.category === selectedCategory);

  const getCategoryEmoji = (category: string) => {
    const found = HABIT_CATEGORIES.find((c) => c.value === category);
    return found?.emoji || "⭐";
  };

  const getFrequencyLabel = (frequency: string) => {
    const found = HABIT_FREQUENCIES.find((f) => f.value === frequency);
    return found?.label || frequency;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <Title>로그인이 필요합니다</Title>
          <Body className="mb-8">습관 관리를 위해 로그인해주세요.</Body>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/iharu"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
          >
            ← 아이하루로 돌아가기
          </Link>
          <Link
            href="/iharu/habits/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            새 습관 만들기
          </Link>
        </div>

        {/* 메인 타이틀 */}
        <div className="text-center mb-8">
          <Title>습관 관리</Title>
          <Body>매일의 작은 습관이 큰 변화를 만들어요</Body>
        </div>

        {/* 카테고리 필터 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">카테고리별 보기</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {HABIT_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.emoji} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 습관 목록 */}
        <div className="space-y-4">
          {filteredHabits.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">아직 습관이 없어요</h3>
              <p className="text-gray-600 mb-6">첫 번째 습관을 만들어보세요!</p>
              <Link
                href="/iharu/habits/create"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="text-white">습관 만들기</span>
              </Link>
            </div>
          ) : (
            filteredHabits.map((habit) => {
              const isChecked = todayCheckedHabits.includes(habit.id);
              const categoryInfo = HABIT_CATEGORIES.find(
                (c) => c.value === habit.category
              );

              return (
                <div
                  key={habit.id}
                  className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all ${
                    isChecked
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">
                          {categoryInfo?.emoji || "⭐"}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{habit.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{categoryInfo?.label}</span>
                            <span>•</span>
                            <span>{getFrequencyLabel(habit.frequency)}</span>
                          </div>
                        </div>
                      </div>

                      {habit.description && (
                        <p className="text-gray-700 mb-4">
                          {habit.description}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-orange-600">🔥</span>
                          <span>{habit.current_streak}일 연속</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600">⭐</span>
                          <span>최고 {habit.longest_streak}일</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-600">✅</span>
                          <span>총 {habit.total_completions}회</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!isChecked && (
                        <button
                          onClick={() => handleCheckIn(habit.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <span className="text-white">체크인</span>
                        </button>
                      )}
                      {isChecked && (
                        <div className="text-green-600 font-bold">✅ 완료</div>
                      )}
                      <Link
                        href={`/iharu/habits/${habit.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span className="text-white">상세보기</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <span className="text-white">삭제</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 통계 요약 */}
        {habits.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
            <h3 className="text-lg font-bold mb-4">오늘의 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {habits.length}
                </div>
                <div className="text-sm text-gray-600">전체 습관</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {todayCheckedHabits.length}
                </div>
                <div className="text-sm text-gray-600">오늘 완료</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {habits.length > 0
                    ? Math.round(
                        (todayCheckedHabits.length / habits.length) * 100
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">달성률</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...habits.map((h) => h.current_streak), 0)}
                </div>
                <div className="text-sm text-gray-600">최고 스트릭</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
