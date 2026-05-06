"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface DiaryEntry {
  id: string;
  date: string;
  mood_rating?: number;
  activities?: string[];
  highlights?: string;
  challenges?: string;
  parent_notes?: string;
  child_notes?: string;
  photos?: string[];
  created_at: string;
}

export default function DiaryPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
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

    const loadDiaryEntries = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("iharu_diary")
          .select(
            "id,date,mood_rating,activities,highlights,challenges,parent_notes,child_notes,photos,created_at"
          )
          .eq("user_id", userId)
          .order("date", { ascending: false });

        if (error) {
          if (error.code !== "42P01") {
            console.error("일기 목록 조회 실패:", error);
          }
          setDiaryEntries([]);
          return;
        }

        setDiaryEntries(data || []);
      } catch (error) {
        console.error("일기 데이터를 가져오는 중 오류가 발생했습니다:", error);
        setDiaryEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadDiaryEntries();
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

  const getMoodEmoji = (rating?: number) => {
    if (!rating) return "😐";
    switch (rating) {
      case 1:
        return "😢";
      case 2:
        return "😕";
      case 3:
        return "😐";
      case 4:
        return "😊";
      case 5:
        return "😄";
      default:
        return "😐";
    }
  };

  const getMoodLabel = (rating?: number) => {
    if (!rating) return "기록 없음";
    switch (rating) {
      case 1:
        return "매우 나쁨";
      case 2:
        return "나쁨";
      case 3:
        return "보통";
      case 4:
        return "좋음";
      case 5:
        return "매우 좋음";
      default:
        return "기록 없음";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
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
          <Body className="mb-8">일일 기록을 위해 로그인해주세요.</Body>
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
              <p className="text-xs text-gray-500">특별한 순간들을 기록해요</p>
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
          <Title>일일 기록</Title>
          <Body>하루의 특별한 순간들을 기록해요</Body>
        </div>

        {/* 새 기록 만들기 버튼 */}
        <div className="flex justify-end mb-8">
          <Link
            href="/iharu/diary/create"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <span className="text-white">기록 작성하기</span>
          </Link>
        </div>

        {/* 일기 목록 */}
        <div className="space-y-6">
          {diaryEntries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                아직 기록이 없어요
              </h3>
              <p className="text-gray-700 mb-6">
                첫 번째 일일 기록을 작성해보세요!
              </p>
              <Link
                href="/iharu/diary/create"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <span className="text-white">기록 작성하기</span>
              </Link>
            </div>
          ) : (
            diaryEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                {/* 날짜와 기분 */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      {formatDate(entry.date)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleTimeString("ko-KR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl mb-1">
                      {getMoodEmoji(entry.mood_rating)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getMoodLabel(entry.mood_rating)}
                    </div>
                  </div>
                </div>

                {/* 활동 목록 */}
                {entry.activities && entry.activities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      오늘의 활동
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.activities.map((activity, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 하이라이트 */}
                {entry.highlights && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      특별한 순간
                    </h4>
                    <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">
                      {entry.highlights}
                    </p>
                  </div>
                )}

                {/* 도전과제 */}
                {entry.challenges && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      도전과제
                    </h4>
                    <p className="text-gray-600 bg-orange-50 p-3 rounded-lg">
                      {entry.challenges}
                    </p>
                  </div>
                )}

                {/* 부모 메모 */}
                {entry.parent_notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      부모님 메모
                    </h4>
                    <p className="text-gray-600 bg-green-50 p-3 rounded-lg">
                      {entry.parent_notes}
                    </p>
                  </div>
                )}

                {/* 아이 메모 */}
                {entry.child_notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      아이 메모
                    </h4>
                    <p className="text-gray-600 bg-purple-50 p-3 rounded-lg">
                      {entry.child_notes}
                    </p>
                  </div>
                )}

                {/* 사진 */}
                {entry.photos && entry.photos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">사진</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {entry.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                        >
                          <span className="text-gray-500 text-sm">
                            사진 {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Link
                    href={`/iharu/diary/${entry.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    상세보기
                  </Link>
                  <Link
                    href={`/iharu/diary/${entry.id}/edit`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    수정하기
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
        {diaryEntries.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">기록 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {diaryEntries.length}
                </div>
                <div className="text-sm text-gray-600">총 기록</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    diaryEntries.filter(
                      (e) => e.mood_rating && e.mood_rating >= 4
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">좋은 하루</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    diaryEntries.filter(
                      (e) => e.activities && e.activities.length > 0
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">활동 기록</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    diaryEntries.filter((e) => e.photos && e.photos.length > 0)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">사진 기록</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
