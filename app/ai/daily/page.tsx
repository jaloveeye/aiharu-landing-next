"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useApiData } from "@/app/hooks/useApiData";
import { AINews } from "@/app/utils/aiNews";

export default function AiDailyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10); // 페이지당 뉴스 10개로 설정
  const firstPageButtonRef = useRef<HTMLButtonElement | null>(null);

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
    { id: "AI Parenting", name: "AI 육아" },
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
        (item.description &&
          item.description.toLowerCase().includes(searchLower)) ||
        (item.summary && item.summary.toLowerCase().includes(searchLower)) ||
        (item.tags &&
          item.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          ));

      return categoryMatch && searchMatch;
    }) || [];

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const endIndex = startIndex + newsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  // 페이지네이션 그룹 계산 (5개씩 표시)
  const pagesPerGroup = 5;
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 페이지 맨 위로 부드럽게 스크롤
  };

  // 데이터가 준비되었고 첫 페이지라면 페이지 1 버튼에 포커스
  useEffect(() => {
    if (!isLoading && filteredNews.length > 0 && currentPage === 1) {
      firstPageButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isLoading, filteredNews.length, currentPage]);

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
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-on-background)' }}>
              오늘의 AI 뉴스
            </h1>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>
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
        <div className="p-6 border mb-8" style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-outline)',
          borderRadius: 'var(--border-radius-medium)'
        }}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
                  }}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: selectedCategory === category.id ? '#000000' : 'var(--color-on-surface)',
                    borderRadius: 'var(--border-radius-medium)',
                    border: selectedCategory === category.id ? 'none' : '1px solid var(--color-outline)'
                  }}
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 검색 시 첫 페이지로 이동
                }}
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-outline)',
                  color: 'var(--color-on-surface)',
                  borderRadius: 'var(--border-radius-medium)',
                  '--tw-ring-color': 'var(--color-primary)'
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        {/* 뉴스 목록 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--color-primary)' }}></div>
            <p className="mt-4" style={{ color: 'var(--color-on-surface-variant)' }}>뉴스를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-error)' }}>뉴스를 불러오는데 실패했습니다.</p>
            <button
              onClick={() => mutate()}
              className="mt-4 px-4 py-2 font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#000000',
                borderRadius: 'var(--border-radius-medium)'
              }}
            >
              다시 시도
            </button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
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
          <div className="space-y-4">
            {currentNews.map((item) => (
              <article
                key={item.id}
                className="border transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-xl" style={{ color: 'var(--color-on-background)' }}>
                      {item.title}
                    </h3>
                    <div className="shrink-0 flex flex-col gap-1">
                      <span className="inline-block text-xs px-2 py-1 font-medium" style={{
                        backgroundColor: 'var(--color-primary)',
                        color: '#000000',
                        borderRadius: 'var(--border-radius-medium)'
                      }}>
                        {item.category}
                      </span>
                      {item.quality_score && (
                        <span className="inline-block text-xs px-2 py-1 font-medium" style={{
                          backgroundColor: item.quality_score >= 80 ? 'var(--color-primary)' : 'var(--color-surface)',
                          color: item.quality_score >= 80 ? '#000000' : 'var(--color-on-surface)',
                          borderRadius: 'var(--border-radius-medium)'
                        }}>
                          품질: {item.quality_score}/100
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className="mt-3 text-sm whitespace-pre-line"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                    title={item.summary || item.description}
                  >
                    {item.summary || item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <span className="truncate">{item.source}</span>
                    <span>{formatDate(item.published_at)}</span>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1"
                          style={{
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-on-surface)',
                            borderRadius: 'var(--border-radius-small)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm px-4 py-2 font-medium transition-colors"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: '#000000',
                        borderRadius: 'var(--border-radius-medium)'
                      }}
                    >
                      원문 보기 →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 결과 카운트 */}
        {filteredNews.length > 0 && (
          <div className="mt-8 text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
            총 {filteredNews.length}개의 뉴스 중 {startIndex + 1}-
            {Math.min(endIndex, filteredNews.length)}번째 뉴스를 표시 중
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            {/* 이전 페이지 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}
            >
              이전
            </button>

            {/* 이전 그룹 버튼 */}
            {currentGroup > 1 && (
              <button
                onClick={() => handlePageChange(startPage - 1)}
                className="px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}
                aria-label="이전 그룹"
              >
                ...
              </button>
            )}

            {/* 페이지 번호들 (현재 그룹의 5개) */}
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((page) => (
              <button
                key={page}
                ref={page === 1 ? firstPageButtonRef : undefined}
                onClick={() => handlePageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={`페이지 ${page}`}
                className="px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: currentPage === page ? 'var(--color-primary)' : 'var(--color-background)',
                  color: currentPage === page ? '#000000' : 'var(--color-on-surface)',
                  border: currentPage === page ? 'none' : '1px solid var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}
              >
                {page}
              </button>
            ))}

            {/* 다음 그룹 버튼 */}
            {currentGroup < Math.ceil(totalPages / pagesPerGroup) && (
              <button
                onClick={() => handlePageChange(endPage + 1)}
                className="px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-outline)',
                  borderRadius: 'var(--border-radius-medium)'
                }}
                aria-label="다음 그룹"
              >
                ...
              </button>
            )}

            {/* 다음 페이지 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
              className="px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
