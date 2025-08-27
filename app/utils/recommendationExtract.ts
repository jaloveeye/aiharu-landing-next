// 추천 식단(내일 아침 추천 식단)만 robust하게 추출하는 함수
export function extractRecommendationSection(result: string): string | null {
  if (!result) return null;
  // 6. 내일 아침 추천 식단 제안 섹션 추출 (#### 6. 또는 6. 또는 bold 등 다양한 패턴)
  const match = result.match(/####?\s*6[\.|\)]?\s*([\s\S]*?)(####|7[\.|\)]|$)/);
  if (match && match[1]) {
    // 불필요한 머릿말/타이틀 제거, 리스트/텍스트만 남김
    let text = match[1]
      .replace(/^\s*-\s*\*\*?추천식단\*\*?\s*:?/im, "")
      .replace(/^\*\*?추천식단\*\*?\s*:?/im, "")
      .replace(/^추천식단\s*:?/im, "")
      .replace(/^\s*-\s*/gm, "- ")
      .trim();
    // 빈 줄/머릿말 제거
    text = text.replace(/^\s*\n+/g, "").replace(/\n{2,}/g, "\n");
    return text.length > 0 ? text : null;
  }
  return null;
}

// 추천 식단 텍스트에서 주요 식재료(음식명) 배열 추출
export function extractIngredientsFromRecommendation(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n|,|-/)
    .map((s) => s.replace(/^[^가-힣a-zA-Z0-9]+/, "").trim())
    .filter(Boolean)
    .map((s) => s.replace(/\(.+\)/, "").trim()); // 괄호 등 제거
}
