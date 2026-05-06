"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface Goal {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number;
  target_value: number;
  unit?: string;
  status: "active" | "completed" | "paused";
  created_at: string;
}

export default function GoalsPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
      setUserId(data?.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadGoals = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("iharu_goals")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          if (error.code !== "42P01") {
            console.error("목표 목록 조회 실패:", error);
          }
          setGoals([]);
          return;
        }

        setGoals(data || []);
      } catch (error) {
        console.error("목표 데이터를 가져오는 중 오류가 발생했습니다:", error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [userId]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "진행중";
      case "completed":
        return "완료";
      case "paused":
        return "일시정지";
      default:
        return "알 수 없음";
    }
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
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
          <Body className="mb-8">목표 관리를 위해 로그인해주세요.</Body>
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
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                안녕하세요, {userEmail}님!
              </p>
              <p className="text-xs text-gray-500">
                목표를 달성하는 여정을 함께해요
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
        <div className="text-center mb-8">
          <Title>목표 관리</Title>
          <Body>아이와 함께 목표를 정하고 달성해요</Body>
        </div>

        {/* 새 목표 만들기 버튼 */}
        <div className="flex justify-end mb-8">
          <Link
            href="/iharu/goals/create"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <span className="text-white">목표 만들기</span>
          </Link>
        </div>

        {/* 목표 목록 */}
        <div className="space-y-6">
          {goals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                아직 목표가 없어요
              </h3>
              <p className="text-gray-700 mb-6">첫 번째 목표를 설정해보세요!</p>
              <Link
                href="/iharu/goals/create"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="text-white">목표 만들기</span>
              </Link>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {goal.target_date && (
                        <span>
                          목표일:{" "}
                          {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                      )}
                      {goal.unit && <span>단위: {goal.unit}</span>}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        goal.status
                      )}`}
                    >
                      {getStatusLabel(goal.status)}
                    </span>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">진행률</span>
                    <span className="font-medium">
                      {goal.progress} / {goal.target_value} (
                      {Math.round(
                        getProgressPercentage(goal.progress, goal.target_value)
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getProgressPercentage(
                          goal.progress,
                          goal.target_value
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    진행률 업데이트
                  </button>
                  <Link
                    href={`/iharu/goals/${goal.id}`}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    상세보기
                  </Link>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 통계 요약 */}
        {goals.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">목표 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {goals.length}
                </div>
                <div className="text-sm text-gray-600">전체 목표</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {goals.filter((g) => g.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">완료된 목표</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {goals.filter((g) => g.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">진행중인 목표</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    goals.reduce(
                      (sum, goal) =>
                        sum +
                        getProgressPercentage(goal.progress, goal.target_value),
                      0
                    ) / goals.length
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">평균 진행률</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
