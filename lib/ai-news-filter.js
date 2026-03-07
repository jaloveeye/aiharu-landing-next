const SEARCH_TERMS = [
  '"인공지능"',
  '"생성형 AI"',
  '"생성 AI"',
  '"머신러닝"',
  '"딥러닝"',
  '"LLM"',
  '"ChatGPT"',
  '"OpenAI"',
  '"오픈AI"',
  '"Claude"',
  '"Anthropic"',
  '"Gemini"',
  '"Copilot"',
  '"AI 에이전트"',
  '"AI 반도체"',
  '"온디바이스 AI"',
];

const STRONG_AI_PATTERNS = [
  /인공지능/u,
  /생성형\s*ai/iu,
  /생성\s*ai/iu,
  /\bllm\b/iu,
  /\bchatgpt\b/iu,
  /\bgpt(?:-?\d+(?:\.\d+)?)?\b/iu,
  /\bopenai\b/iu,
  /오픈\s*ai/u,
  /\bclaude\b/iu,
  /\banthropic\b/iu,
  /\bgemini\b/iu,
  /\bcopilot\b/iu,
  /\bmistral\b/iu,
  /\bllama\b/iu,
  /\bperplexity\b/iu,
  /\bgrok\b/iu,
  /\bsora\b/iu,
  /머신러닝/u,
  /딥러닝/u,
  /멀티모달/u,
  /파운데이션\s*모델/u,
  /온디바이스\s*ai/iu,
  /ai\s*반도체/iu,
  /\bnpu\b/iu,
  /프롬프트/u,
  /추론\s*모델/u,
  /\bai\s*(에이전트|모델|서비스|기술|기능|검색|도구|플랫폼|비서|학습|추론|반도체|칩)\b/iu,
];

const CONTEXT_PATTERNS = [
  /출시/u,
  /공개/u,
  /발표/u,
  /업데이트/u,
  /도입/u,
  /적용/u,
  /개발/u,
  /투자/u,
  /인수/u,
  /협업/u,
  /제휴/u,
  /연구/u,
  /논문/u,
  /서비스/u,
  /플랫폼/u,
  /\bapi\b/iu,
  /모델/u,
  /칩/u,
  /반도체/u,
  /에이전트/u,
  /자동화/u,
];

const EXCLUDED_PATTERNS = [
  /프로야구/u,
  /야구/u,
  /축구/u,
  /농구/u,
  /배구/u,
  /골프/u,
  /연예/u,
  /드라마/u,
  /영화/u,
  /아이돌/u,
  /가수/u,
  /배우/u,
  /패션/u,
  /뷰티/u,
  /화장품/u,
  /부동산/u,
  /운세/u,
  /로또/u,
  /살인/u,
  /강도/u,
  /절도/u,
  /사망/u,
];

const LOW_QUALITY_PATTERNS = [/\[removed\]/iu, /\[삭제됨\]/u, /\[removed by source\]/iu];

const MAX_DAILY_NEWS = 10;
const MIN_QUALITY_SCORE = 60;

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(text, patterns) {
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

function hasStandaloneAIToken(text) {
  return /\bai\b/i.test(text);
}

function evaluateAINewsRelevance(title = "", description = "", content = "") {
  const safeTitle = normalizeText(title);
  const safeDescription = normalizeText(description);
  const safeContent = normalizeText(content);
  const primaryText = normalizeText(`${safeTitle} ${safeDescription}`);
  const fullText = normalizeText(`${primaryText} ${safeContent}`);

  if (!safeTitle) {
    return { isRelevant: false, score: 0, reason: "제목 없음" };
  }

  if (!fullText || LOW_QUALITY_PATTERNS.some((pattern) => pattern.test(fullText))) {
    return { isRelevant: false, score: 0, reason: "본문 품질 부족" };
  }

  const titleStrongMatches = countMatches(safeTitle, STRONG_AI_PATTERNS);
  const primaryStrongMatches = countMatches(primaryText, STRONG_AI_PATTERNS);
  const fullStrongMatches = countMatches(fullText, STRONG_AI_PATTERNS);
  const contextMatches = countMatches(primaryText, CONTEXT_PATTERNS);
  const excludedMatches = countMatches(primaryText, EXCLUDED_PATTERNS);
  const standaloneAiInTitle = hasStandaloneAIToken(safeTitle);
  const standaloneAiInPrimary = hasStandaloneAIToken(primaryText);

  let score = 0;
  if (titleStrongMatches > 0) score += 4;
  if (primaryStrongMatches > 1) {
    score += 2;
  } else if (primaryStrongMatches > 0) {
    score += 1;
  }
  if (fullStrongMatches > primaryStrongMatches) score += 1;
  if (contextMatches > 0) score += 1;
  if (standaloneAiInTitle) {
    score += 1;
  } else if (standaloneAiInPrimary) {
    score += 0.5;
  }
  if (safeDescription.length >= 40) score += 0.5;
  if (safeContent.length >= 120) score += 0.5;
  score -= excludedMatches * 2;

  const hasStrongPrimarySignal = titleStrongMatches > 0 || primaryStrongMatches > 0;
  const likelyBareAiMention = !hasStrongPrimarySignal && standaloneAiInPrimary;

  if (excludedMatches > 0 && !hasStrongPrimarySignal) {
    return {
      isRelevant: false,
      score,
      reason: "비AI 도메인 키워드 우세",
    };
  }

  if (likelyBareAiMention && contextMatches + fullStrongMatches < 3) {
    return {
      isRelevant: false,
      score,
      reason: "단순 AI 약어 언급",
    };
  }

  if (hasStrongPrimarySignal && score >= 4) {
    return {
      isRelevant: true,
      score,
      reason: "제목/설명에 명확한 AI 신호",
    };
  }

  if (fullStrongMatches >= 2 && contextMatches >= 1 && score >= 4) {
    return {
      isRelevant: true,
      score,
      reason: "본문까지 포함해 AI 맥락 확인",
    };
  }

  return {
    isRelevant: false,
    score,
    reason: "AI 직접 관련성 부족",
  };
}

function buildNewsApiUrl(apiKey) {
  const params = new URLSearchParams({
    q: SEARCH_TERMS.join(" OR "),
    language: "ko",
    searchIn: "title,description",
    sortBy: "publishedAt",
    pageSize: "25",
    apiKey,
  });

  return `https://newsapi.org/v2/everything?${params.toString()}`;
}

function buildGNewsUrl(apiKey) {
  const params = new URLSearchParams({
    q: SEARCH_TERMS.join(" OR "),
    lang: "ko",
    country: "kr",
    max: "15",
    apikey: apiKey,
  });

  return `https://gnews.io/api/v4/search?${params.toString()}`;
}

function limitAndSortNews(news, maxDailyNews = MAX_DAILY_NEWS) {
  return [...news]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, maxDailyNews);
}

module.exports = {
  SEARCH_TERMS,
  MAX_DAILY_NEWS,
  MIN_QUALITY_SCORE,
  buildNewsApiUrl,
  buildGNewsUrl,
  evaluateAINewsRelevance,
  limitAndSortNews,
  normalizeText,
};
