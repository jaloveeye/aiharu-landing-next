"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Alert from "@/components/ui/Alert";
import { useApiData } from "@/app/hooks/useApiData";
import { ImageIcon, TextIcon } from "@/components/ui/IconAnalysisType";
import NutritionRadarChart from "@/components/ui/NutritionRadarChart";
import { parseNutritionPercent } from "@/utils/nutritionParser";

/**
 * 분석 상세 페이지
 */
export default function HistoryDetailPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
        setChecking(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!checking && !userEmail) {
      router.replace("/login?redirect=/history");
    }
  }, [checking, userEmail, router]);

  const { data, error, isLoading } = useApiData<any>(
    userEmail && id ? `/api/analyze-meal?id=${id}` : null
  );

  // 식재료 및 음식명 정리 섹션 추출 및 파싱 함수
  function extractIngredientsSection(md: string): {
    tags: string[];
    mdWithoutSection: string;
  } {
    // '1.' 또는 '#### 1.'으로 시작하는 줄부터 다음 번호(2.)/헤딩 전까지 추출
    const lines = md.split(/\r?\n/);
    const startIdx = lines.findIndex((l) => /^#{0,4}\s*1\./.test(l));
    if (startIdx === -1) return { tags: [], mdWithoutSection: md };
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^#{0,4}\s*\d+\./.test(lines[i])) {
        endIdx = i;
        break;
      }
    }
    // 섹션 내에서 '- '로 시작하는 항목만 추출
    const sectionLines = lines.slice(startIdx, endIdx);
    const tags = sectionLines
      .filter((l) => /^-\s+/.test(l))
      .map((l) => l.replace(/^-\s+/, "").trim())
      .filter(Boolean);
    // 해당 섹션 제거한 md
    const mdWithoutSection = [
      ...lines.slice(0, startIdx),
      ...lines.slice(endIdx),
    ].join("\n");
    return { tags, mdWithoutSection };
  }

  // 섭취량 섹션 추출 및 파싱 함수
  function extractAmountsSection(md: string): {
    items: { name: string; amount: string }[];
    mdWithoutSection: string;
  } {
    // '2.' 또는 '#### 2.'으로 시작하는 줄부터 다음 번호(3.)/헤딩 전까지 추출
    const lines = md.split(/\r?\n/);
    const startIdx = lines.findIndex((l) => /^#{0,4}\s*2\./.test(l));
    if (startIdx === -1) return { items: [], mdWithoutSection: md };
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^#{0,4}\s*\d+\./.test(lines[i])) {
        endIdx = i;
        break;
      }
    }
    // 섹션 내에서 '- '로 시작하는 항목만 추출
    const sectionLines = lines.slice(startIdx, endIdx);
    const items = sectionLines
      .filter((l) => /^-\s+/.test(l))
      .map((l) => {
        const m = l
          .replace(/^-\s+/, "")
          .trim()
          .match(/^(.+?):\s*(.+)$/);
        if (m) return { name: m[1].trim(), amount: m[2].trim() };
        return null;
      })
      .filter(Boolean) as { name: string; amount: string }[];
    // 해당 섹션 제거한 md
    const mdWithoutSection = [
      ...lines.slice(0, startIdx),
      ...lines.slice(endIdx),
    ].join("\n");
    return { items, mdWithoutSection };
  }

  // 3번 영양소 요약표 섹션 추출 및 파싱 함수
  function extractNutritionTableSection(md: string): {
    table: string[][];
    mdWithoutSection: string;
  } {
    // '3.' 또는 '#### 3.'으로 시작하는 줄부터 다음 번호(4.)/헤딩 전까지 추출
    const lines = md.split(/\r?\n/);
    const startIdx = lines.findIndex((l) => /^#{0,4}\s*3\./.test(l));
    if (startIdx === -1) return { table: [], mdWithoutSection: md };
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^#{0,4}\s*\d+\./.test(lines[i])) {
        endIdx = i;
        break;
      }
    }
    // 섹션 내에서 마크다운 표만 추출
    const sectionLines = lines.slice(startIdx, endIdx);
    const tableLines = sectionLines.filter((l) => /^\|.*\|$/.test(l));
    // 마크다운 표 파싱
    const table = tableLines.map((l) =>
      l
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim())
    );
    // 해당 섹션 제거한 md
    const mdWithoutSection = [
      ...lines.slice(0, startIdx),
      ...lines.slice(endIdx),
    ].join("\n");
    return { table, mdWithoutSection };
  }

  // 4번 부족/과잉 영양소 섹션 추출 및 파싱 함수
  function extractDeficiencyExcessSection(md: string): {
    deficiency: string[];
    excess: string[];
    mdWithoutSection: string;
  } {
    // '4.' 또는 '#### 4.'으로 시작하는 줄부터 다음 번호(5.)/헤딩 전까지 추출
    const lines = md.split(/\r?\n/);
    const startIdx = lines.findIndex((l) => /^#{0,4}\s*4\./.test(l));
    if (startIdx === -1)
      return { deficiency: [], excess: [], mdWithoutSection: md };
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^#{0,4}\s*\d+\./.test(lines[i])) {
        endIdx = i;
        break;
      }
    }
    const sectionLines = lines.slice(startIdx, endIdx);
    // '- **부족한 영양소**: ...' 및 '- **과잉된 항목**: ...' 추출
    let deficiency: string[] = [];
    let excess: string[] = [];
    sectionLines.forEach((l) => {
      const defMatch = l.match(/\*\*부족한 영양소\*\*:\s*(.+)/);
      if (defMatch) {
        const val = defMatch[1].replace(/없음|없습니다?/, "").trim();
        if (val)
          deficiency = val
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
      }
      const excMatch = l.match(/\*\*과잉된 항목\*\*:\s*(.+)/);
      if (excMatch) {
        const val = excMatch[1].replace(/없음|없습니다?/, "").trim();
        if (val)
          excess = val
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
      }
    });
    // '없음'만 있을 때 빈 배열로
    if (deficiency.length === 1 && !deficiency[0]) deficiency = [];
    if (excess.length === 1 && !excess[0]) excess = [];
    // 해당 섹션 제거한 md
    const mdWithoutSection = [
      ...lines.slice(0, startIdx),
      ...lines.slice(endIdx),
    ].join("\n");
    return { deficiency, excess, mdWithoutSection };
  }

  // 5번 장점/개선사항 섹션 추출 및 파싱 함수
  function extractAdvantageImprovementSection(md: string): {
    advantage: string;
    improvement: string;
    mdWithoutSection: string;
  } {
    // '5.' 또는 '#### 5.'으로 시작하는 줄부터 다음 번호(6.)/헤딩 전까지 추출
    const lines = md.split(/\r?\n/);
    const startIdx = lines.findIndex((l) => /^#{0,4}\s*5\./.test(l));
    if (startIdx === -1)
      return { advantage: "", improvement: "", mdWithoutSection: md };
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^#{0,4}\s*\d+\./.test(lines[i])) {
        endIdx = i;
        break;
      }
    }
    const sectionLines = lines.slice(startIdx, endIdx);
    let advantage = "",
      improvement = "";
    sectionLines.forEach((l) => {
      const advMatch = l.match(/\*\*장점\*\*:\s*(.+)/);
      if (advMatch) advantage = advMatch[1].trim();
      const impMatch = l.match(/\*\*개선이 필요한 점\*\*:\s*(.+)/);
      if (impMatch) improvement = impMatch[1].trim();
    });
    // 해당 섹션 제거한 md
    const mdWithoutSection = [
      ...lines.slice(0, startIdx),
      ...lines.slice(endIdx),
    ].join("\n");
    return { advantage, improvement, mdWithoutSection };
  }

  // 6번 추천 식단 섹션 추출 및 파싱 함수
  function extractRecommendationSection(md: string): {
    items: string[];
    mdWithoutSection: string;
  } {
    // '6.' 또는 '#### 6.'으로 시작하는 줄부터 다음 번호(7.)/헤딩 전까지 추출
    const lines = md.split(/\r?\n/);
    const startIdx = lines.findIndex((l) => /^#{0,4}\s*6\./.test(l));
    if (startIdx === -1) return { items: [], mdWithoutSection: md };
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^#{0,4}\s*\d+\./.test(lines[i])) {
        endIdx = i;
        break;
      }
    }
    const sectionLines = lines.slice(startIdx, endIdx);
    // '- 식단:' 이후 리스트 항목만 추출
    let items: string[] = [];
    let inList = false;
    sectionLines.forEach((l) => {
      if (/^-\s*식단\s*:/i.test(l)) {
        inList = true;
        return;
      }
      if (inList && /^\s*-\s+/.test(l)) {
        let item = l.replace(/^\s*-\s+/, "").trim();
        // '**식단**:' 또는 '식단:'으로 시작하면 제거
        item = item
          .replace(/^\*\*?식단\*\*?\s*:\s*/i, "")
          .replace(/^식단\s*:\s*/i, "");
        if (item) items.push(item);
      }
    });
    // 만약 '- 식단:' 없이 바로 리스트가 나오면 모두 포함
    if (items.length === 0) {
      items = sectionLines
        .filter((l) => /^\s*-\s+/.test(l))
        .map((l) => {
          let item = l.replace(/^\s*-\s+/, "").trim();
          item = item
            .replace(/^\*\*?식단\*\*?\s*:\s*/i, "")
            .replace(/^식단\s*:\s*/i, "");
          return item;
        })
        .filter(Boolean);
    }
    // 해당 섹션 제거한 md
    const mdWithoutSection = [
      ...lines.slice(0, startIdx),
      ...lines.slice(endIdx),
    ].join("\n");
    return { items, mdWithoutSection };
  }

  let ingredientsTags: string[] = [];
  let resultMarkdown = data?.result || "";
  if (resultMarkdown) {
    const { tags, mdWithoutSection } =
      extractIngredientsSection(resultMarkdown);
    ingredientsTags = tags;
    resultMarkdown = mdWithoutSection;
  }

  let amountsItems: { name: string; amount: string }[] = [];
  if (resultMarkdown) {
    const { items, mdWithoutSection } = extractAmountsSection(resultMarkdown);
    amountsItems = items;
    resultMarkdown = mdWithoutSection;
  }

  let nutritionTable: string[][] = [];
  if (resultMarkdown) {
    const { table, mdWithoutSection } =
      extractNutritionTableSection(resultMarkdown);
    nutritionTable = table;
    resultMarkdown = mdWithoutSection;
  }

  let deficiency: string[] = [],
    excess: string[] = [];
  if (resultMarkdown) {
    const {
      deficiency: d,
      excess: e,
      mdWithoutSection,
    } = extractDeficiencyExcessSection(resultMarkdown);
    deficiency = d;
    excess = e;
    resultMarkdown = mdWithoutSection;
  }

  let advantage = "",
    improvement = "";
  if (resultMarkdown) {
    const {
      advantage: adv,
      improvement: imp,
      mdWithoutSection,
    } = extractAdvantageImprovementSection(resultMarkdown);
    advantage = adv;
    improvement = imp;
    resultMarkdown = mdWithoutSection;
  }

  let recommendationItems: string[] = [];
  if (resultMarkdown) {
    const { items, mdWithoutSection } =
      extractRecommendationSection(resultMarkdown);
    recommendationItems = items;
    resultMarkdown = mdWithoutSection;
  }

  // 7. JSON 형식 결과 섹션 및 '분석 결과', '결과 요약' 헤딩 제거
  if (resultMarkdown) {
    // 7. JSON 형식 결과 섹션 제거
    const lines = resultMarkdown.split(/\r?\n/);
    const startIdx = lines.findIndex((l: string) => /^#{0,4}\s*7\./.test(l));
    let mdWithoutJson = resultMarkdown;
    if (startIdx !== -1) {
      let endIdx = lines.length;
      for (let i = startIdx + 1; i < lines.length; i++) {
        if (/^#{0,4}\s*\d+\./.test(lines[i])) {
          endIdx = i;
          break;
        }
      }
      mdWithoutJson = [
        ...lines.slice(0, startIdx),
        ...lines.slice(endIdx),
      ].join("\n");
    }
    // '분석 결과', '결과 요약' 헤딩/텍스트 제거 (모든 위치)
    mdWithoutJson = mdWithoutJson.replace(/분석 결과/g, "");
    mdWithoutJson = mdWithoutJson.replace(/결과 요약/g, "");
    resultMarkdown = mdWithoutJson;
  }

  if (checking) return null;
  if (!userEmail) return null;

  function formatDateToLocal(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-20">
      <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full mt-6 mx-auto">
        <Link
          href="/history"
          className="self-start mb-4 text-yellow-700 hover:underline flex items-center gap-1 text-sm"
        >
          ← 분석 내역으로 돌아가기
        </Link>
        <div className="text-2xl font-bold text-yellow-700 mb-4 text-center">
          분석 상세
        </div>
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : error ? (
          <Alert variant="error">불러오기 실패: {error.message}</Alert>
        ) : !data ? (
          <div className="text-gray-400 text-center py-8">
            데이터를 찾을 수 없습니다.
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-500">
                {formatDateToLocal(data.analyzed_at)}
              </div>
              {data.source_type && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                    data.source_type === "image"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}
                >
                  {data.source_type === "image" ? <ImageIcon /> : <TextIcon />}
                  {data.source_type === "image" ? "이미지" : "텍스트"}
                </span>
              )}
            </div>
            <div className="mb-4">
              <div className="text-yellow-700 font-bold mb-1">입력한 식단</div>
              <div className="text-yellow-900 whitespace-pre-line break-words">
                {data.meal_text}
              </div>
            </div>
            {/* 영양소 레이더 차트 */}
            {data?.result && (
              <NutritionRadarChart
                nutrition={parseNutritionPercent(data.result)}
                isPercent
              />
            )}
            {/* 상세 분석 결과 전체를 접기/펼치기 */}
            <div className="w-full max-w-md mx-auto mb-4">
              <button
                type="button"
                onClick={() => setDetailsOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition mb-2"
                aria-expanded={detailsOpen}
                style={{ width: "100%" }}
              >
                {detailsOpen ? (
                  <>
                    상세 분석 결과 접기 <span aria-hidden>▲</span>
                  </>
                ) : (
                  <>
                    상세 분석 결과 자세히 보기 <span aria-hidden>▼</span>
                  </>
                )}
              </button>
              {detailsOpen && (
                <div>
                  {/* 식재료 태그 섹션 */}
                  {ingredientsTags.length > 0 && (
                    <section className="mb-6">
                      <div className="mb-2 px-2 py-1 font-bold text-yellow-700 text-base flex items-center gap-2">
                        <span className="text-lg">🥗</span>
                        식재료 및 음식명
                      </div>
                      <div className="flex flex-wrap gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-3">
                        {ingredientsTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                  {/* 섭취량 섹션 */}
                  {amountsItems.length > 0 && (
                    <section className="mb-6">
                      <div className="mb-2 px-2 py-1 font-bold text-blue-700 text-base flex items-center gap-2">
                        <span className="text-lg">⚖️</span>각 식재료의 대략적인
                        섭취량
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-3 overflow-x-auto">
                        <table className="min-w-full text-sm text-blue-900">
                          <thead>
                            <tr className="bg-blue-600 text-white rounded-t-lg">
                              <th className="px-3 py-2 text-left font-bold rounded-tl-lg">
                                식재료명
                              </th>
                              <th className="px-3 py-2 text-left font-bold rounded-tr-lg">
                                섭취량
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {amountsItems.map((item) => (
                              <tr key={item.name} className="even:bg-blue-100">
                                <td className="px-3 py-1 font-semibold whitespace-nowrap">
                                  {item.name}
                                </td>
                                <td className="px-3 py-1 whitespace-nowrap">
                                  {item.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}
                  {/* 3번 영양소 요약표 섹션 */}
                  {nutritionTable.length > 1 && (
                    <section className="mb-6">
                      <div className="mb-2 px-2 py-1 font-bold text-green-700 text-base flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        전체 식사의 열량 및 주요 영양소 요약표
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-3 overflow-x-auto">
                        <table className="min-w-full text-sm text-green-900">
                          <thead>
                            <tr className="bg-green-600 text-white rounded-t-lg">
                              {nutritionTable[0].map((cell, idx) => (
                                <th
                                  key={idx}
                                  className={
                                    "px-3 py-2 text-left font-bold" +
                                    (idx === 0
                                      ? " rounded-tl-lg"
                                      : idx === nutritionTable[0].length - 1
                                      ? " rounded-tr-lg"
                                      : "")
                                  }
                                >
                                  {cell}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {nutritionTable.slice(1).map((row, i) => (
                              <tr
                                key={i}
                                className={i % 2 === 1 ? "bg-green-100" : ""}
                              >
                                {row.map((cell, j) => (
                                  <td
                                    key={j}
                                    className="px-3 py-1 whitespace-nowrap"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}
                  {/* 4번 부족/과잉 영양소 섹션 */}
                  {(deficiency.length > 0 || excess.length > 0) && (
                    <section className="mb-6">
                      <div className="mb-2 px-2 py-1 font-bold text-red-700 text-base">
                        부족한 영양소 및 과잉 항목
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-3 flex flex-col gap-2">
                        <div>
                          <span className="font-semibold text-red-700 mr-2">
                            부족한 영양소
                          </span>
                          {deficiency.length > 0 ? (
                            deficiency.map((item) => (
                              <span
                                key={item}
                                className="inline-block bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-1"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-1">
                              없음
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-blue-700 mr-2">
                            과잉된 항목
                          </span>
                          {excess.length > 0 ? (
                            excess.map((item) => (
                              <span
                                key={item}
                                className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-1"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-1">
                              없음
                            </span>
                          )}
                        </div>
                      </div>
                    </section>
                  )}
                  {/* 5번 장점/개선사항 섹션 */}
                  {(advantage || improvement) && (
                    <section className="mb-6 flex flex-col gap-3">
                      <div className="mb-2 px-2 py-1 font-bold text-green-700 text-base flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        식단의 장점과 개선이 필요한 점
                      </div>
                      {advantage && (
                        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-3">
                          <span className="mt-0.5 text-green-600">👍</span>
                          <div>
                            <div className="font-bold text-green-700 mb-1 flex items-center gap-1">
                              식단의 장점
                            </div>
                            <div className="text-green-900 whitespace-pre-line">
                              {advantage}
                            </div>
                          </div>
                        </div>
                      )}
                      {improvement && (
                        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-3">
                          <span className="mt-0.5 text-yellow-600">🛠️</span>
                          <div>
                            <div className="font-bold text-yellow-700 mb-1 flex items-center gap-1">
                              개선이 필요한 점
                            </div>
                            <div className="text-yellow-900 whitespace-pre-line">
                              {improvement}
                            </div>
                          </div>
                        </div>
                      )}
                    </section>
                  )}
                  {/* 6번 추천 식단 섹션 */}
                  {recommendationItems.length > 0 && (
                    <section className="mb-6">
                      <div className="mb-2 px-2 py-1 font-bold text-purple-700 text-base flex items-center gap-2">
                        <span className="text-lg">🍽️</span>
                        내일 아침 추천 식단
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-3">
                        <ul className="list-disc pl-5">
                          {recommendationItems.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-purple-900 mb-1 font-medium"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  )}
                  {/* 분석 결과 헤딩 제거 */}
                  <div className="text-green-900 whitespace-pre-line break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {resultMarkdown}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function hideJsonSection(md: string): string {
  // '7.' 또는 '#### 7.'으로 시작하는 줄부터 끝까지, 또는 다음 번호(8.)/헤딩 전까지 제거
  const lines = md.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => /^#{0,4}\s*7\./.test(l));
  if (startIdx === -1) return md;
  // 7번 이후에 또 다른 번호(8. 등)가 있으면 거기까지, 없으면 끝까지
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^#{0,4}\s*\d+\./.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  return [...lines.slice(0, startIdx), ...lines.slice(endIdx)].join("\n");
}
