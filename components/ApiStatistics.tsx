"use client";

import { useState, useEffect } from "react";

/**
 * 인증 사용자와 익명 사용자 구분 방법:
 * 
 * 1. 인증 사용자:
 *    - Supabase 인증을 통해 로그인한 사용자
 *    - `supabase.auth.getUser()`로 user 객체가 있으면 인증 사용자
 *    - 데이터베이스에 `user_id` 필드에 UUID 저장
 * 
 * 2. 익명 사용자:
 *    - 로그인하지 않은 사용자
 *    - 쿠키/로컬스토리지에 저장된 `anonymous_user_id` 사용
 *    - `getOrCreateAnonymousId()` 함수로 생성 (형식: `anon_타임스탬프_랜덤`)
 *    - 데이터베이스에 `anonymous_id` 필드에 TEXT 저장
 * 
 * 통계에서 구분:
 * - `user_id IS NOT NULL` → 인증 사용자
 * - `anonymous_id IS NOT NULL` → 익명 사용자
 */

interface StatisticsData {
  success: boolean;
  period: {
    start: string | null;
    end: string | null;
  };
  summary: {
    keyIssuances: {
      total: number;
      authenticated: number;
      anonymous: number;
      authenticatedPercentage: string;
    };
    generations: {
      total: number;
      authenticated: number;
      anonymous: number;
      authenticatedPercentage: string;
      byType: {
        adventure: number;
        riddle: number;
      };
      byStatus: {
        successful: number;
        failed: number;
        successRate: string;
      };
    };
  };
  daily: {
    keyIssuances: Record<string, { authenticated: number; anonymous: number; total: number }>;
    generations: Record<string, { adventure: number; riddle: number; total: number; success: number; failed: number }>;
  };
  emailList?: Array<{
    email: string;
    count: number;
    latestIssuance: string;
    isAuthenticated: boolean;
  }>;
}

export default function ApiStatistics() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/api-statistics`);
      const result = await response.json();

      if (result.success) {
        setData(result);
      } else {
        setError(result.error || "통계를 불러올 수 없습니다.");
      }
    } catch (err) {
      setError("통계를 불러오는 중 오류가 발생했습니다.");
      console.error("통계 로드 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color = "primary" }: { title: string; value: string | number; subtitle?: string; color?: "primary" | "secondary" | "success" | "error" }) => {
    const bgColor = color === "primary" ? "var(--color-primary)" : color === "secondary" ? "var(--color-secondary)" : color === "success" ? "var(--color-success)" : "var(--color-error)";
    return (
      <div className="p-6 border rounded-lg" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>{title}</p>
        <p className="text-3xl font-bold mb-1" style={{ color: 'var(--color-on-background)' }}>{value}</p>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{subtitle}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="border p-8 text-center" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>통계를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border p-8 text-center" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-error)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <p style={{ color: 'var(--color-error)' }}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* API 키 발급 통계 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
          API 키 발급 통계
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <StatCard
            title="총 발급 수"
            value={data.summary.keyIssuances.total}
            subtitle="전체 API 키 발급 수"
          />
          <StatCard
            title="인증 사용자"
            value={data.summary.keyIssuances.authenticated}
            subtitle="인증된 사용자 수"
            color="secondary"
          />
        </div>

        {/* 이메일 목록 */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-on-background)' }}>
            발급받은 사용자 이메일 목록
          </h4>
          {data.emailList && data.emailList.length > 0 ? (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-outline)' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'var(--color-surface)' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>
                        이메일
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>
                        발급 횟수
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>
                        최근 발급일
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>
                        사용자 유형
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.emailList.map((item, index) => (
                      <tr 
                        key={item.email || index} 
                        className="border-t"
                        style={{ 
                          borderColor: 'var(--color-outline)',
                          backgroundColor: index % 2 === 0 ? 'var(--color-background)' : 'var(--color-surface)'
                        }}
                      >
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-on-background)' }}>
                          {item.email || '-'}
                        </td>
                        <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--color-on-background)' }}>
                          {item.count}
                        </td>
                        <td className="px-4 py-3 text-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                          {item.latestIssuance ? new Date(item.latestIssuance).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded"
                            style={{
                              backgroundColor: item.isAuthenticated ? 'var(--color-secondary)' : 'var(--color-success)',
                              color: '#FFFFFF'
                            }}
                          >
                            {item.isAuthenticated ? '인증 사용자' : '익명 사용자'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6 text-center" style={{ 
              borderColor: 'var(--color-outline)',
              backgroundColor: 'var(--color-surface)'
            }}>
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                조회 기간 내에 발급된 API 키가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* API 생성 통계 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
          API 생성 통계
        </h3>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-on-background)' }}>
              전체 통계
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="총 생성 수"
                value={data.summary.generations.total}
              />
              <StatCard
                title="성공률"
                value={`${data.summary.generations.byStatus.successRate}%`}
                color="success"
              />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-on-background)' }}>
              사용자 유형별
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="인증 사용자"
                value={data.summary.generations.authenticated}
                subtitle={`${data.summary.generations.authenticatedPercentage}%`}
                color="secondary"
              />
              <StatCard
                title="익명 사용자"
                value={data.summary.generations.anonymous}
                subtitle={`${(100 - parseFloat(data.summary.generations.authenticatedPercentage)).toFixed(2)}%`}
                color="success"
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-on-background)' }}>
              타입별 통계
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="모험 생성"
                value={data.summary.generations.byType.adventure}
                color="primary"
              />
              <StatCard
                title="퀴즈 생성"
                value={data.summary.generations.byType.riddle}
                color="secondary"
              />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-on-background)' }}>
              성공/실패 통계
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="성공"
                value={data.summary.generations.byStatus.successful}
                color="success"
              />
              <StatCard
                title="실패"
                value={data.summary.generations.byStatus.failed}
                color="error"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 일별 통계 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--color-on-background)' }}>
          일별 통계
        </h3>
        <div className="space-y-4">
          {Object.entries(data.daily.keyIssuances).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-on-background)' }}>
                API 키 발급 일별 통계
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-outline)' }}>
                      <th className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>날짜</th>
                      <th className="text-right p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>인증</th>
                      <th className="text-right p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.daily.keyIssuances)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([date, stats]) => (
                        <tr key={date} style={{ borderBottom: '1px solid var(--color-outline)' }}>
                          <td className="p-3 text-sm" style={{ color: 'var(--color-on-background)' }}>{date}</td>
                          <td className="p-3 text-sm text-right" style={{ color: 'var(--color-on-surface-variant)' }}>{stats.authenticated}</td>
                          <td className="p-3 text-sm text-right font-semibold" style={{ color: 'var(--color-on-background)' }}>{stats.total}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {Object.entries(data.daily.generations).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 mt-6" style={{ color: 'var(--color-on-background)' }}>
                API 생성 일별 통계
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-outline)' }}>
                      <th className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>날짜</th>
                      <th className="text-right p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>모험</th>
                      <th className="text-right p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>퀴즈</th>
                      <th className="text-right p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>성공</th>
                      <th className="text-right p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>실패</th>
                      <th className="text-right p-3 text-sm font-semibold" style={{ color: 'var(--color-on-background)' }}>합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.daily.generations)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([date, stats]) => (
                        <tr key={date} style={{ borderBottom: '1px solid var(--color-outline)' }}>
                          <td className="p-3 text-sm" style={{ color: 'var(--color-on-background)' }}>{date}</td>
                          <td className="p-3 text-sm text-right" style={{ color: 'var(--color-on-surface-variant)' }}>{stats.adventure}</td>
                          <td className="p-3 text-sm text-right" style={{ color: 'var(--color-on-surface-variant)' }}>{stats.riddle}</td>
                          <td className="p-3 text-sm text-right" style={{ color: 'var(--color-success)' }}>{stats.success}</td>
                          <td className="p-3 text-sm text-right" style={{ color: 'var(--color-error)' }}>{stats.failed}</td>
                          <td className="p-3 text-sm text-right font-semibold" style={{ color: 'var(--color-on-background)' }}>{stats.total}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

