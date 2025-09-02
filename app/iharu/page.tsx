"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { IharuHabit, IharuStats } from "@/app/utils/iharu/types";
import {
  getActiveHabits,
  getTodayCheckedHabits,
} from "@/app/utils/iharu/habits";

export default function IharuPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [habits, setHabits] = useState<IharuHabit[]>([]);
  const [todayCheckedHabits, setTodayCheckedHabits] = useState<string[]>([]);
  const [stats, setStats] = useState<IharuStats>({
    total_habits: 0,
    active_habits: 0,
    completed_today: 0,
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
      setUserId(data?.user?.id ?? null);
    });
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      // 로그아웃 후 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log("userId가 없어서 로딩을 중단합니다.");
      setLoading(false); // 로딩 상태를 false로 설정
      return;
    }

    // 임시: 데이터 로딩을 건너뛰고 기본 상태로 설정
    console.log("임시: 데이터 로딩을 건너뛰고 기본 상태로 설정합니다.");
    setHabits([]);
    setTodayCheckedHabits([]);
    setStats({
      total_habits: 0,
      active_habits: 0,
      completed_today: 0,
      total_points: 0,
      current_streak: 0,
      longest_streak: 0,
    });
    setLoading(false);

    // 실제 데이터 로딩은 나중에 활성화
    /*
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("아이하루 데이터 로딩 시작... userId:", userId);
        
        // 간단한 테스트: Supabase 연결 확인
        const supabase = createClient();
        console.log("Supabase 클라이언트 생성됨");
        
        // 활성 습관 조회
        console.log("활성 습관 조회 중...");
        const activeHabits = await getActiveHabits(userId);
        console.log("활성 습관 조회 결과:", activeHabits);
        setHabits(activeHabits || []);

        // 오늘 체크인한 습관 조회
        console.log("오늘 체크인 습관 조회 중...");
        const checkedHabits = await getTodayCheckedHabits(userId);
        console.log("오늘 체크인 습관 조회 결과:", checkedHabits);
        setTodayCheckedHabits(checkedHabits || []);

        // 통계 계산 (안전한 배열 처리)
        const safeHabits = activeHabits || [];
        const totalPoints = safeHabits.reduce(
          (sum, habit) => sum + (habit.total_completions || 0) * 10,
          0
        );
        const currentStreak = safeHabits.length > 0 
          ? Math.max(...safeHabits.map((h) => h.current_streak || 0), 0)
          : 0;
        const longestStreak = safeHabits.length > 0
          ? Math.max(...safeHabits.map((h) => h.longest_streak || 0), 0)
          : 0;

        const newStats = {
          total_habits: safeHabits.length,
          active_habits: safeHabits.length,
          completed_today: checkedHabits?.length || 0,
          total_points: totalPoints,
          current_streak: currentStreak,
          longest_streak: longestStreak,
        };
        
        console.log("계산된 통계:", newStats);
        setStats(newStats);
        
        console.log("아이하루 데이터 로딩 완료");
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
        // 오류가 발생해도 기본 상태로 설정
        setHabits([]);
        setTodayCheckedHabits([]);
        setStats({
          total_habits: 0,
          active_habits: 0,
          completed_today: 0,
          total_points: 0,
          current_streak: 0,
          longest_streak: 0,
        });
      } finally {
        console.log("로딩 상태를 false로 설정합니다.");
        setLoading(false);
      }
    };

    fetchData();
    */
  }, [userId]);

  const featureCards = [
    {
      icon: "📝",
      title: "습관 관리",
      desc: "매일의 작은 습관을 체크하고 기록해요.",
      href: "/iharu/habits",
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: "🎯",
      title: "목표 설정",
      desc: "아이와 함께 목표를 정하고 달성해요.",
      href: "/iharu/goals",
      color: "bg-green-50 border-green-200",
    },
    {
      icon: "📖",
      title: "일일 기록",
      desc: "하루의 특별한 순간들을 기록해요.",
      href: "/iharu/diary",
      color: "bg-purple-50 border-purple-200",
    },
    {
      icon: "🏆",
      title: "보상 시스템",
      desc: "목표 달성 시 포인트를 받고 보상으로 교환해요.",
      href: "/iharu/rewards",
      color: "bg-yellow-50 border-yellow-200",
    },
  ];

  const statCards = [
    {
      icon: "📊",
      title: "활성 습관",
      value: stats.active_habits,
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: "✅",
      title: "오늘 완료",
      value: stats.completed_today,
      color: "bg-green-100 text-green-700",
    },
    {
      icon: "🔥",
      title: "현재 스트릭",
      value: stats.current_streak,
      color: "bg-orange-100 text-orange-700",
    },
    {
      icon: "⭐",
      title: "총 포인트",
      value: stats.total_points,
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

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
          <div className="text-6xl mb-4">👶</div>
          <Title>아이하루에 오신 것을 환영해요!</Title>
          <Body className="mb-8">
            아이와 함께 성장하는 특별한 하루를 만들어보세요.
          </Body>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-white">로그인하기</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
          >
            ← 홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                안녕하세요, {userEmail}님!
              </p>
              <p className="text-xs text-gray-500">
                오늘도 아이와 함께 특별한 하루를 만들어보세요
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 메인 타이틀 */}
        <div className="text-center mb-12">
          <Title>아이하루</Title>
          <Body>아이와 부모가 함께 만드는 성장 일기</Body>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* 기능 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featureCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className={`block p-6 rounded-xl shadow-sm border-2 transition-all hover:shadow-md hover:scale-105 ${card.color}`}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-700">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* 오늘의 습관 */}
        {habits.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">오늘의 습관</h3>
            <div className="space-y-3">
              {habits.map((habit) => {
                const isChecked = todayCheckedHabits.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                      isChecked
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-2xl ${
                          isChecked ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {isChecked ? "✅" : "⭕"}
                      </div>
                      <div>
                        <div className="font-medium">{habit.title}</div>
                        <div className="text-sm text-gray-600">
                          {habit.category} • {habit.frequency}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {habit.current_streak}일 연속
                      </div>
                      <div className="text-xs text-gray-500">
                        총 {habit.total_completions}회
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 빠른 액션 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">빠른 액션</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/iharu/habits/create"
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl">➕</div>
              <div>
                <div className="font-medium">새 습관 만들기</div>
                <div className="text-sm text-gray-600">
                  오늘부터 시작할 습관을 추가해요
                </div>
              </div>
            </Link>
            <Link
              href="/iharu/diary/create"
              className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <div className="text-2xl">📝</div>
              <div>
                <div className="font-medium">오늘 기록하기</div>
                <div className="text-sm text-gray-600">
                  특별한 순간을 기록해요
                </div>
              </div>
            </Link>
            <Link
              href="/iharu/reports"
              className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
            >
              <div className="text-2xl">📊</div>
              <div>
                <div className="font-medium">성장 리포트</div>
                <div className="text-sm text-gray-600">
                  우리 아이의 성장을 확인해요
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
