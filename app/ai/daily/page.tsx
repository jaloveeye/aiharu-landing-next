"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useApiData } from "@/app/hooks/useApiData";
import { AINews } from "@/app/utils/aiNews";

export default function AiDailyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useApiData<{ message: string; news: AINews[] }>("/api/collect-ai-news");

  // API 응답에서 뉴스 배열 추출
  const news = response?.news || [];

  const categories = [
    { id: "all", name: "전체" },
    { id: "AI Technology", name: "AI 기술" },
    { id: "AI Research", name: "AI 연구" },
    { id: "AI Business", name: "AI 비즈니스" },
    { id: "AI Ethics", name: "AI 윤리" },
    { id: "AI Tools", name: "AI 도구" },
  ];

  // 필터링된 뉴스
  const filteredNews =
    news?.filter((item) => {
      const categoryMatch =
        selectedCategory === "all" || item.category === selectedCategory;
      
      // 검색어가 없으면 모든 뉴스 표시
      if (searchTerm === "") {
        return categoryMatch;
      }
      
      const searchLower = searchTerm.toLowerCase();
      
      // 제목, 설명, 요약, 태그에서 검색
      const searchMatch =
        item.title.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        (item.summary && item.summary.toLowerCase().includes(searchLower)) ||
        (item.tags && item.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchLower)
        ));
      
      return categoryMatch && searchMatch;
    }) || [];

  // 수동으로 뉴스 수집
  const handleCollectNews = async () => {
    try {
      const response = await fetch("/api/collect-ai-news", {
        method: "POST",
      });
      if (response.ok) {
        mutate(); // 데이터 새로고침
        alert("뉴스 수집이 완료되었습니다!");
      }
    } catch (error) {
      console.error("뉴스 수집 실패:", error);
      alert("뉴스 수집에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-green-700 hover:underline flex items-center gap-1 text-sm mb-2"
            >
              ← 홈으로 돌아가기
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2">
              오늘의 AI 뉴스
            </h1>
            <p className="text-gray-600">
              최신 AI 관련 뉴스를 한눈에 확인하세요
            </p>
          </div>
          {/* 뉴스 수집 버튼 숨김 */}
          {/* <button
            onClick={handleCollectNews}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading ? "수집 중..." : "뉴스 수집"}
          </button> */}
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* 검색 */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="뉴스 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 뉴스 목록 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">뉴스를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">뉴스를 불러오는데 실패했습니다.</p>
            <button
              onClick={() => mutate()}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              다시 시도
            </button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "검색 결과가 없습니다."
                : "수집된 뉴스가 없습니다."}
            </p>
            {/* 뉴스 수집 버튼 숨김 */}
            {/* {!searchTerm && selectedCategory === "all" && (
              <button
                onClick={handleCollectNews}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                뉴스 수집하기
              </button>
            )} */}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* 카테고리 태그 */}
                <div className="px-6 pt-4">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    {item.category}
                  </span>
                </div>

                {/* 뉴스 내용 */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.summary || item.description}
                  </p>

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{item.source}</span>
                    <span>{formatDate(item.published_at)}</span>
                  </div>

                  {/* 태그 */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 링크 */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 !text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    원문 보기 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 결과 카운트 */}
        {filteredNews.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            총 {filteredNews.length}개의 뉴스를 찾았습니다.
          </div>
        )}
      </div>
    </div>
  );
}
