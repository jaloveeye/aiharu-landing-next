export interface QualityMetrics {
  // 답변 품질 점수
  structureScore: number; // 구조화 점수 (0-100)
  expertiseScore: number; // 전문성 점수 (0-100)
  contextScore: number; // 맥락 연관성 점수 (0-100)
  practicalityScore: number; // 실용성 점수 (0-100)

  // 질문 품질 점수 (새로 추가!)
  questionClarityScore: number; // 질문 명확성 점수 (0-100)
  questionExpertiseScore: number; // 질문 전문성 점수 (0-100)
  questionComplexityScore: number; // 질문 복잡성/깊이 점수 (0-100)

  // 종합 점수
  overallScore: number; // 종합 점수 (0-100)

  details: {
    hasStepByStep: boolean; // 단계별 가이드 포함 여부
    hasWarnings: boolean; // 주의사항 포함 여부
    hasAlternatives: boolean; // 대안/추가 고려사항 포함 여부
    hasConcreteMethods: boolean; // 구체적 실행 방법 포함 여부
    tokenEfficiency: number; // 토큰 효율성 (0-100)
    categoryKeywords: string[]; // 카테고리별 키워드 매칭

    // 질문 품질 세부사항 (새로 추가!)
    questionHasSpecificity: boolean; // 구체적 상황/사례 포함 여부
    questionHasComplexity: boolean; // 복합적 문제 상황 포함 여부
    questionHasProfessionalTerms: boolean; // 전문 용어 포함 여부
  };
}

// 프롬프트 품질 자동 분석
export function analyzePromptQuality(
  promptContent: string,
  aiResult: string,
  category: string,
  tokensUsed: number
): QualityMetrics {
  // 답변 품질 분석
  const structureScore = analyzeStructure(aiResult);
  const expertiseScore = analyzeExpertise(aiResult, category);
  const contextScore = analyzeContext(promptContent, aiResult);
  const practicalityScore = analyzePracticality(aiResult);

  // 질문 품질 분석 (새로 추가!)
  const questionClarityScore = analyzeQuestionClarity(promptContent);
  const questionExpertiseScore = analyzeQuestionExpertise(
    promptContent,
    category
  );
  const questionComplexityScore = analyzeQuestionComplexity(promptContent);

  // 종합 점수 계산 (질문과 답변 모두 반영)
  const overallScore = Math.round(
    // 답변 품질 (60%)
    structureScore * 0.2 +
      expertiseScore * 0.2 +
      contextScore * 0.15 +
      practicalityScore * 0.15 +
      // 질문 품질 (40%)
      questionClarityScore * 0.15 +
      questionExpertiseScore * 0.15 +
      questionComplexityScore * 0.1
  );

  return {
    structureScore,
    expertiseScore,
    contextScore,
    practicalityScore,
    questionClarityScore,
    questionExpertiseScore,
    questionComplexityScore,
    overallScore,
    details: {
      hasStepByStep: detectStepByStep(aiResult),
      hasWarnings: detectWarnings(aiResult),
      hasAlternatives: detectAlternatives(aiResult),
      hasConcreteMethods: detectConcreteMethods(aiResult),
      tokenEfficiency: calculateTokenEfficiency(tokensUsed, aiResult.length),
      categoryKeywords: extractCategoryKeywords(aiResult, category),
      questionHasSpecificity: detectQuestionSpecificity(promptContent),
      questionHasComplexity: detectQuestionComplexity(promptContent),
      questionHasProfessionalTerms: detectQuestionProfessionalTerms(
        promptContent,
        category
      ),
    },
  };
}

// 구조화 분석 (단계별 가이드, 체계적 구성)
function analyzeStructure(text: string): number {
  let score = 0;

  // 단계별 가이드 감지 (개선된 로직)
  if (detectStepByStep(text)) score += 40;

  // 번호 매기기 또는 글머리 기호 감지 (더 포괄적으로)
  if (/\d+\.|•|\-|\*|▶|→|✓/.test(text)) score += 30;

  // 구체적 방법 제시
  if (detectConcreteMethods(text)) score += 25;

  // 주의사항/추가 고려사항
  if (detectWarnings(text)) score += 15;
  if (detectAlternatives(text)) score += 15;

  // 기본 점수 (구조가 있으면 기본적으로 높은 점수)
  if (score > 0) score += 20;

  return Math.min(Math.round(score), 100);
}

// 전문성 분석 (전문 용어, 카테고리별 키워드)
function analyzeExpertise(text: string, category: string): number {
  let score = 0;

  // 카테고리별 전문 키워드 매칭 (개선된 로직)
  const categoryKeywords = getCategoryKeywords(category);
  const matchedKeywords = categoryKeywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );

  // 키워드 매칭 점수 (대폭 증가) - Math.round 적용
  const keywordScore = Math.round(
    Math.min(
      (matchedKeywords.length / Math.max(categoryKeywords.length, 1)) * 60,
      60
    )
  );
  score += keywordScore;

  // 키워드 매칭 보너스 점수 (매칭된 키워드 수에 따른 추가 점수)
  if (matchedKeywords.length >= 5) score += 25;
  if (matchedKeywords.length >= 10) score += 30;
  if (matchedKeywords.length >= 15) score += 35;

  // 전문적 표현 감지 (확장)
  if (
    /\b(전략|방법론|프로세스|프레임워크|모델|시스템|접근법|기법|도구|방법|절차|과정|단계|순서)\b/.test(
      text
    )
  )
    score += 25;

  // 구체적 수치나 단위 포함
  if (/\d+%|\d+단계|\d+시간|\d+일|\d+개|\d+가지/.test(text)) score += 25;

  // 연구/트렌드 언급 (확장)
  if (
    /\b(연구|트렌드|최신|동향|사례|데이터|통계|분석|결과|효과|성과|성공|실패|경험)\b/.test(
      text
    )
  )
    score += 20;

  // 카테고리별 보너스 점수
  if (category === "육아") score += 20;
  if (category === "육아창업") score += 25;
  if (category === "비즈니스마케팅") score += 25;

  // 기본 점수 (전문성이 있으면 기본적으로 높은 점수)
  if (score > 0) score += 15;

  // 최종 점수를 반올림하여 반환
  return Math.min(Math.round(score), 100);
}

// 질문 품질 분석 함수들 (새로 추가!)
function analyzeQuestionClarity(question: string): number {
  let score = 0;

  // 질문의 명확성 (어떻게, 무엇, 언제, 어디서, 왜)
  if (/\b(어떻게|무엇|언제|어디서|왜|어떤|어느|몇|얼마나)\b/.test(question))
    score += 30;

  // 구체적 상황이나 사례 포함
  if (detectQuestionSpecificity(question)) score += 25;

  // 복합적 문제 상황 포함
  if (detectQuestionComplexity(question)) score += 25;

  // 질문의 길이와 상세함
  if (question.length >= 50) score += 20;

  return Math.min(Math.round(score), 100);
}

function analyzeQuestionExpertise(question: string, category: string): number {
  let score = 0;

  // 전문 용어 포함 여부
  if (detectQuestionProfessionalTerms(question, category)) score += 40;

  // 카테고리별 전문 키워드 매칭
  const categoryKeywords = getCategoryKeywords(category);
  const matchedKeywords = categoryKeywords.filter((keyword) =>
    question.toLowerCase().includes(keyword.toLowerCase())
  );

  const keywordScore = Math.min(
    (matchedKeywords.length / Math.max(categoryKeywords.length, 1)) * 30,
    30
  );
  score += keywordScore;

  // 전문적 표현 감지
  if (
    /\b(전략|방법론|프로세스|시스템|접근법|기법|도구|방법|절차|과정|단계|순서)\b/.test(
      question
    )
  )
    score += 20;

  // 연구/트렌드 언급
  if (
    /\b(연구|트렌드|최신|동향|사례|분석|경험|실무|적용|실행)\b/.test(question)
  )
    score += 10;

  return Math.min(Math.round(score), 100);
}

function analyzeQuestionComplexity(question: string): number {
  let score = 0;

  // 복합적 문제 상황 포함
  if (detectQuestionComplexity(question)) score += 40;

  // 구체적 상황/사례 포함
  if (detectQuestionSpecificity(question)) score += 30;

  // 조건이나 제약사항 포함
  if (
    /\b(하지만|그런데|하지만|그러나|만약|경우|상황|제약|한계|도전|어려움)\b/.test(
      question
    )
  )
    score += 20;

  // 질문의 깊이 (복잡한 문장 구조)
  if (question.includes(",") && question.includes("그리고")) score += 10;

  return Math.min(Math.round(score), 100);
}

// 질문 품질 감지 헬퍼 함수들
function detectQuestionSpecificity(question: string): boolean {
  return /\b(구체적|상황|사례|경험|실제|현실|구체|특정|이런|저런|그런)\b/.test(
    question
  );
}

function detectQuestionComplexity(question: string): boolean {
  return /\b(복합적|복잡|다양|여러|여러가지|다양한|복합|통합|연결|관련|상호작용)\b/.test(
    question
  );
}

function detectQuestionProfessionalTerms(
  question: string,
  category: string
): boolean {
  const categoryKeywords = getCategoryKeywords(category);
  return categoryKeywords.some((keyword) =>
    question.toLowerCase().includes(keyword.toLowerCase())
  );
}

// 맥락 연관성 분석 (질문과 답변의 연결성)
function analyzeContext(prompt: string, answer: string): number {
  let score = 0;

  // 질문의 핵심 키워드가 답변에 포함되는지 확인
  const promptKeywords = prompt
    .toLowerCase()
    .match(
      /\b(어떻게|무엇|언제|어디서|왜|방법|과정|단계|전략|기법|도구|방법|절차|과정|단계|순서)\b/g
    );

  if (promptKeywords) {
    const matchedKeywords = promptKeywords.filter((keyword) =>
      answer.toLowerCase().includes(keyword)
    );
    // Math.round 적용
    score += Math.round(
      Math.min((matchedKeywords.length / promptKeywords.length) * 40, 40)
    );
  }

  // 구체적 요구사항 대응
  if (
    /\b(어떻게)\b/.test(prompt) &&
    /\b(단계|방법|가이드|과정|절차)\b/.test(answer)
  )
    score += 30;
  if (
    /\b(무엇)\b/.test(prompt) &&
    /\b(정의|개념|의미|내용|구성요소)\b/.test(answer)
  )
    score += 30;
  if (
    /\b(언제)\b/.test(prompt) &&
    /\b(시기|타이밍|시점|단계|순서)\b/.test(answer)
  )
    score += 30;

  // 질문과 답변의 주제 일치성
  const promptTopic = prompt
    .toLowerCase()
    .match(/\b(육아|창업|마케팅|비즈니스|교육|학습|성장|발달)\b/);
  if (promptTopic && answer.toLowerCase().includes(promptTopic[0])) score += 20;

  // 기본 점수 (맥락이 있으면 기본적으로 높은 점수)
  if (score > 0) score += 20;

  return Math.min(Math.round(score), 100);
}

// 실용성 분석 (실행 가능성, 구체적 방법)
function analyzePracticality(text: string): number {
  let score = 0;

  // 구체적 실행 방법 제시
  if (detectConcreteMethods(text)) score += 45;

  // 단계별 가이드 제공
  if (detectStepByStep(text)) score += 40;

  // 주의사항/경고 포함
  if (detectWarnings(text)) score += 25;

  // 대안/추가 고려사항
  if (detectAlternatives(text)) score += 25;

  // 구체적 수치나 단위 포함
  if (/\d+%|\d+단계|\d+시간|\d+일|\d+개|\d+가지/.test(text)) score += 20;

  // 즉시 실행 가능한 표현
  if (/\b(지금|바로|즉시|당장|오늘|내일|이번주|다음주)\b/.test(text))
    score += 15;

  // 기본 점수 (실용성이 있으면 기본적으로 높은 점수)
  if (score > 0) score += 20;

  return Math.min(Math.round(score), 100);
}

// 헬퍼 함수들
function detectStepByStep(text: string): boolean {
  // 더 포괄적인 단계별 가이드 감지
  return /\d+\.|첫째|둘째|셋째|넷째|다섯째|단계|절차|과정|순서|방법/.test(text);
}

function detectWarnings(text: string): boolean {
  return /\b(주의|경고|주의사항|주의해야|조심|신중|꼭|반드시)\b/.test(text);
}

function detectAlternatives(text: string): boolean {
  return /\b(또는|대안|대신|그렇지 않으면|그 외에도|추가로|또한)\b/.test(text);
}

function detectConcreteMethods(text: string): boolean {
  // 더 포괄적인 구체적 방법 감지
  return /방법|기법|도구|프로그램|앱|서비스|플랫폼|매뉴얼|가이드|절차|과정|단계|순서|접근법|전략|제시|가르쳐|찾아보고|보여줌/.test(
    text
  );
}

function calculateTokenEfficiency(
  tokensUsed: number,
  textLength: number
): number {
  // 토큰 효율성: 적절한 길이의 답변에 높은 점수
  const idealLength = 800; // 이상적인 답변 길이
  const lengthDiff = Math.abs(textLength - idealLength);
  const lengthScore = Math.max(0, 100 - lengthDiff / 10);

  // 토큰 사용량 효율성
  const tokenScore = Math.max(0, 100 - (tokensUsed - 800) / 5);

  return Math.round((lengthScore + tokenScore) / 2);
}

function extractKeywords(text: string): string[] {
  // 개선된 키워드 추출
  const commonWords = [
    "이",
    "그",
    "저",
    "것",
    "수",
    "등",
    "및",
    "또는",
    "그리고",
    "하지만",
    "그러나",
    "때",
    "때문",
    "위해",
    "통해",
    "가지",
    "것은",
    "것이",
    "것을",
    "것의",
  ];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !commonWords.includes(word));

  // 더 많은 키워드 추출
  return words.slice(0, 20); // 상위 20개 키워드
}

function getCategoryKeywords(category: string): string[] {
  const categoryKeywords: Record<string, string[]> = {
    육아: [
      "감정",
      "통제",
      "화",
      "짜증",
      "학습",
      "교육",
      "동기",
      "습관",
      "사회성",
      "친구",
      "대화",
      "소통",
      "건강",
      "영양",
      "운동",
      "수면",
      "발달",
      "연령",
      "단계",
      "성장",
      "부모",
      "아이",
      "아동",
      "심리",
      "행동",
      "관리",
      "조절",
      "안전",
      "환경",
      "공간",
      "제공",
      "도움",
      "지원",
      "가르침",
      "학습",
      "발달",
      "성장",
      "변화",
      "향상",
      "능력",
    ],
    육아창업: [
      "시장",
      "분석",
      "트렌드",
      "기회",
      "비즈니스",
      "모델",
      "수익",
      "전략",
      "마케팅",
      "고객",
      "브랜드",
      "홍보",
      "자금",
      "투자",
      "재무",
      "운영",
      "창업",
      "사업",
      "서비스",
      "육아",
      "부모",
      "아이",
      "가족",
      "교육",
      "케어",
      "돌봄",
      "양육",
      "시설",
      "센터",
      "프로그램",
      "커리큘럼",
      "시스템",
      "플랫폼",
      "앱",
      "도구",
      "솔루션",
      "서비스",
    ],
    비즈니스마케팅: [
      "디지털",
      "온라인",
      "소셜",
      "모바일",
      "고객",
      "세분화",
      "타겟",
      "경험",
      "브랜드",
      "이미지",
      "포지셔닝",
      "정체성",
      "성과",
      "ROI",
      "측정",
      "분석",
      "전략",
      "캠페인",
      "마케팅",
      "홍보",
      "광고",
      "판매",
      "수익",
      "성장",
      "확장",
      "경쟁",
      "시장",
      "고객",
      "데이터",
      "인사이트",
      "결과",
      "효과",
      "성공",
      "목표",
      "계획",
      "실행",
      "관리",
    ],
  };

  return categoryKeywords[category] || [];
}

function extractCategoryKeywords(text: string, category: string): string[] {
  const categoryKeywords = getCategoryKeywords(category);
  return categoryKeywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

// 품질 등급 평가
export function getQualityGrade(overallScore: number): string {
  if (overallScore >= 90) return "A+";
  if (overallScore >= 80) return "A";
  if (overallScore >= 70) return "B+";
  if (overallScore >= 60) return "B";
  if (overallScore >= 50) return "C+";
  if (overallScore >= 40) return "C";
  return "D";
}

// 품질 개선 제안 생성
export function generateQualitySuggestions(
  metrics: QualityMetrics,
  category: string
): string[] {
  const suggestions: string[] = [];

  if (metrics.structureScore < 70) {
    suggestions.push(
      "구조화 개선: 단계별 가이드나 번호 매기기를 추가하여 체계적인 구성"
    );
  }

  if (metrics.expertiseScore < 70) {
    suggestions.push(
      "전문성 강화: 해당 분야의 전문 용어와 구체적 방법론을 더 포함"
    );
  }

  if (metrics.contextScore < 70) {
    suggestions.push(
      "맥락 연결: 질문의 핵심 요구사항과 더 직접적으로 연결되는 답변"
    );
  }

  if (metrics.practicalityScore < 70) {
    suggestions.push(
      "실용성 향상: 즉시 실행 가능한 구체적인 방법과 주의사항 추가"
    );
  }

  return suggestions;
}
