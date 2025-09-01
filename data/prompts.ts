export interface PromptExample {
  id: string;
  title: string;
  category:
    | "코드리뷰"
    | "디버깅"
    | "아키텍처"
    | "성능최적화"
    | "보안"
    | "테스트"
    | "문서화"
    | "리팩토링";
  prompt: string;
  result?: string;
  tags: string[];
  difficulty: "초급" | "중급" | "고급";
  createdAt: string;
  updatedAt: string;
}

export const promptTemplates: PromptExample[] = [
  {
    id: "code-review-001",
    title: "코드 리뷰 프롬프트 생성",
    category: "코드리뷰",
    prompt: "코드 리뷰 시 확인해야 할 핵심 포인트와 개선 방안을 간결하게 제시해주세요.",
    tags: ["코드리뷰", "개발", "모범사례"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "debugging-001",
    title: "디버깅 프롬프트 생성",
    category: "디버깅",
    prompt: "일반적인 디버깅 상황과 해결 방법을 간결하게 제시해주세요.",
    tags: ["디버깅", "문제해결", "에러처리"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "architecture-001",
    title: "아키텍처 프롬프트 생성",
    category: "아키텍처",
    prompt: "시스템 아키텍처 설계 시 고려사항과 패턴을 간결하게 제시해주세요.",
    tags: ["아키텍처", "시스템설계", "패턴"],
    difficulty: "고급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "performance-001",
    title: "성능 최적화 프롬프트 생성",
    category: "성능최적화",
    prompt: "성능 최적화의 핵심 기법과 적용 방법을 간결하게 제시해주세요.",
    tags: ["성능최적화", "최적화", "성능"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "security-001",
    title: "보안 프롬프트 생성",
    category: "보안",
    prompt: "웹 애플리케이션 보안의 주요 위협과 방어 방법을 간결하게 제시해주세요.",
    tags: ["보안", "보안점검", "취약점"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "testing-001",
    title: "테스트 프롬프트 생성",
    category: "테스트",
    prompt: "효과적인 테스트 작성 방법과 모범 사례를 간결하게 제시해주세요.",
    tags: ["테스트", "테스트코드", "품질보증"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "documentation-001",
    title: "문서화 프롬프트 생성",
    category: "문서화",
    prompt: "개발 문서 작성의 핵심 요소와 작성 방법을 간결하게 제시해주세요.",
    tags: ["문서화", "기술문서", "API문서"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "refactoring-001",
    title: "리팩토링 프롬프트 생성",
    category: "리팩토링",
    prompt: "코드 리팩토링의 핵심 원칙과 적용 방법을 간결하게 제시해주세요.",
    tags: ["리팩토링", "클린코드", "코드개선"],
    difficulty: "중급",
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
