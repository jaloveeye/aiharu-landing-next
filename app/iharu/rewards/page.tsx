"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface Reward {
  id: string;
  title: string;
  description?: string;
  points_required: number;
  is_active: boolean;
  created_at: string;
}

interface PointHistory {
  id: string;
  points: number;
  type: "earned" | "spent";
  source?: string;
  notes?: string;
  created_at: string;
}

export default function RewardsPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
      return;
    }

    // 임시: 보상 데이터 로딩을 건너뛰고 기본 상태로 설정
    console.log("보상 데이터 로딩을 건너뛰고 기본 상태로 설정합니다.");
    setRewards([]);
    setPointHistory([]);
    setTotalPoints(0);
    setLoading(false);
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

  const handlePurchaseReward = async (
    rewardId: string,
    pointsRequired: number
  ) => {
    if (totalPoints < pointsRequired) {
      alert("포인트가 부족합니다!");
      return;
    }

    if (confirm("이 보상을 구매하시겠습니까?")) {
      // TODO: 실제 구매 로직 구현
      alert("보상 구매가 완료되었습니다!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case "habit_completion":
        return "습관 완료";
      case "goal_achievement":
        return "목표 달성";
      case "reward_purchase":
        return "보상 구매";
      default:
        return "기타";
    }
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
          <Body className="mb-8">보상 시스템을 위해 로그인해주세요.</Body>
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
      <div className="max-w-6xl mx-auto">
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
                포인트로 보상을 받아보세요
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
          <Title>보상 시스템</Title>
          <Body>목표 달성 시 포인트를 받고 보상으로 교환해요</Body>
        </div>

        {/* 포인트 카드 */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold mb-2">
              {totalPoints.toLocaleString()} 포인트
            </div>
            <p className="text-yellow-100">현재 보유 포인트</p>
          </div>
        </div>

        {/* 새 보상 만들기 버튼 */}
        <div className="flex justify-end mb-8">
          <Link
            href="/iharu/rewards/create"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <span className="text-white">새 보상 만들기</span>
          </Link>
        </div>

        {/* 보상 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {rewards.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">아직 보상이 없어요</h3>
              <p className="text-gray-600 mb-6">첫 번째 보상을 만들어보세요!</p>
              <Link
                href="/iharu/rewards/create"
                className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <span className="text-white">보상 만들기</span>
              </Link>
            </div>
          ) : (
            rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎁</div>
                  <h3 className="text-lg font-bold mb-2">{reward.title}</h3>
                  {reward.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {reward.description}
                    </p>
                  )}
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {reward.points_required.toLocaleString()} 포인트
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() =>
                      handlePurchaseReward(reward.id, reward.points_required)
                    }
                    disabled={
                      totalPoints < reward.points_required || !reward.is_active
                    }
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      totalPoints >= reward.points_required && reward.is_active
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={
                        totalPoints >= reward.points_required &&
                        reward.is_active
                          ? "text-white"
                          : ""
                      }
                    >
                      {totalPoints >= reward.points_required && reward.is_active
                        ? "보상 받기"
                        : totalPoints < reward.points_required
                        ? "포인트 부족"
                        : "비활성화됨"}
                    </span>
                  </button>

                  <div className="flex gap-2">
                    <Link
                      href={`/iharu/rewards/${reward.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
                    >
                      <span className="text-white">상세보기</span>
                    </Link>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                      <span className="text-white">삭제</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 포인트 히스토리 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">포인트 히스토리</h3>
          {pointHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600">아직 포인트 기록이 없어요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pointHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-2xl ${
                        entry.type === "earned"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {entry.type === "earned" ? "➕" : "➖"}
                    </div>
                    <div>
                      <div className="font-medium">
                        {entry.type === "earned" ? "+" : "-"}
                        {entry.points.toLocaleString()} 포인트
                      </div>
                      <div className="text-sm text-gray-600">
                        {getSourceLabel(entry.source)}
                        {entry.notes && ` - ${entry.notes}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(entry.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 통계 요약 */}
        {rewards.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
            <h3 className="text-lg font-bold mb-4">보상 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {rewards.length}
                </div>
                <div className="text-sm text-gray-600">전체 보상</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {rewards.filter((r) => r.is_active).length}
                </div>
                <div className="text-sm text-gray-600">활성 보상</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pointHistory
                    .filter((p) => p.type === "earned")
                    .reduce((sum, p) => sum + p.points, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">총 획득 포인트</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {pointHistory
                    .filter((p) => p.type === "spent")
                    .reduce((sum, p) => sum + p.points, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">총 사용 포인트</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
