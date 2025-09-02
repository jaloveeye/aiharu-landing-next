export interface PromptExample {
  id: string;
  title: string;
  category: "육아" | "육아창업" | "비즈니스마케팅" | "학습교육" | "일상라이프";
  prompt: string;
  result?: string;
  tags: string[];
  difficulty: "초급" | "중급" | "고급";
  createdAt: string;
  updatedAt: string;
}

export const promptTemplates: PromptExample[] = [
  // 육아 (우선순위 높음)
  {
    id: "parenting-001",
    title: "육아 방법 프롬프트 생성",
    category: "육아",
    prompt:
      "현대적인 육아 환경에서 발생하는 구체적이고 복잡한 문제 상황을 제시해주세요. 예: 디지털 기기 중독, 감정 조절 어려움, 학습 동기 부족, 형제자매 갈등, 부모-자녀 소통 문제, 학교 적응 어려움, 특별한 재능이나 관심사 개발, 건강한 습관 형성 등. 구체적인 연령, 상황, 제약사항을 포함하여 실제 부모가 마주할 수 있는 복합적인 문제를 다루어주세요.",
    tags: ["육아", "자녀교육", "부모역할"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 육아창업 (새로 추가)
  {
    id: "parenting-startup-001",
    title: "육아창업 프롬프트 생성",
    category: "육아창업",
    prompt:
      "육아와 관련된 창업 아이디어나 비즈니스 모델을 구체적으로 제시해주세요. 예: 육아용품 개발, 육아 서비스 플랫폼, 육아 교육 콘텐츠, 육아 관련 앱 개발, 육아 커뮤니티 운영, 육아 전문가 매칭 서비스, 육아 관련 이커머스, 육아 문제 해결 솔루션 등. 구체적인 시장 분석, 타겟 고객, 수익 모델, 경쟁 우위, 실행 전략을 포함하여 실제 창업가가 마주할 수 있는 복합적인 문제와 기회를 다루어주세요.",
    tags: ["육아창업", "창업아이디어", "비즈니스모델", "육아서비스"],
    difficulty: "고급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 학습 & 교육
  {
    id: "learning-001",
    title: "학습 방법 프롬프트 생성",
    category: "학습교육",
    prompt:
      "실제 학습 상황에서 발생하는 복잡한 문제와 도전 과제를 제시해주세요. 예: 새로운 프로그래밍 언어 습득, 업무와 병행하는 온라인 강의 수강, 팀 내 기술 공유 및 멘토링, 학습 동기 부족 극복, 효율적인 시간 관리, 학습 내용의 실제 적용, 학습 슬럼프 극복, 다양한 학습 스타일 대응 등. 구체적인 상황, 제약사항, 목표, 환경을 포함하여 실제 학습자가 마주할 수 있는 복합적인 문제를 다루어주세요.",
    tags: ["학습", "교육", "자기계발"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 비즈니스 & 경영
  {
    id: "business-marketing-001",
    title: "비즈니스마케팅 프롬프트 생성",
    category: "비즈니스마케팅",
    prompt:
      "현대 비즈니스 환경에서 효과적인 마케팅 전략과 실행 방법을 제시해주세요. 예: 디지털 마케팅, 고객 세분화, 브랜드 전략, 성과 측정 등",
    tags: ["비즈니스마케팅", "마케팅", "전략"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 일상 & 라이프스타일
  {
    id: "lifestyle-001",
    title: "생산성 향상 프롬프트 생성",
    category: "일상라이프",
    prompt:
      "일상에서 생산성을 높이고 시간을 효율적으로 관리하는 구체적인 방법을 제시해주세요. 예: 시간 블로킹, 우선순위 설정, 습관 형성 등",
    tags: ["생산성", "시간관리", "습관"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
];

export const getPromptByCategory = (category: PromptExample["category"]) => {
  return promptTemplates.filter((prompt) => prompt.category === category);
};

export const getPromptById = (id: string) => {
  return promptTemplates.find((prompt) => prompt.id === id);
};

export const getRandomPrompt = () => {
  const randomIndex = Math.floor(Math.random() * promptTemplates.length);
  return promptTemplates[randomIndex];
};

export const getPromptsByDifficulty = (
  difficulty: PromptExample["difficulty"]
) => {
  return promptTemplates.filter((prompt) => prompt.difficulty === difficulty);
};
