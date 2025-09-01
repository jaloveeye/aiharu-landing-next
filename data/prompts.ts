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
    prompt:
      "React 컴포넌트에서 성능 최적화가 필요한 구체적인 상황과 개선 방안을 제시해주세요. 예: 무거운 계산, 불필요한 리렌더링, 메모이제이션 적용 등",
    tags: ["코드리뷰", "개발", "모범사례"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "debugging-001",
    title: "디버깅 프롬프트 생성",
    category: "디버깅",
    prompt:
      "Node.js 서버에서 메모리 누수가 발생하는 구체적인 시나리오와 해결 방법을 제시해주세요. 예: 이벤트 리스너 누수, 클로저 문제, 타이머 정리 등",
    tags: ["디버깅", "문제해결", "에러처리"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "architecture-001",
    title: "아키텍처 프롬프트 생성",
    category: "아키텍처",
    prompt:
      "마이크로서비스 환경에서 데이터 일관성을 보장하는 구체적인 패턴과 구현 방법을 제시해주세요. 예: Saga 패턴, CQRS, 이벤트 소싱 등",
    tags: ["아키텍처", "시스템설계", "패턴"],
    difficulty: "고급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "performance-001",
    title: "성능 최적화 프롬프트 생성",
    category: "성능최적화",
    prompt:
      "대용량 데이터베이스 쿼리 최적화의 구체적인 기법과 적용 사례를 제시해주세요. 예: 인덱스 전략, 쿼리 튜닝, 파티셔닝 등",
    tags: ["성능최적화", "최적화", "성능"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "security-001",
    title: "보안 프롬프트 생성",
    category: "보안",
    prompt:
      "JWT 토큰 기반 인증에서 발생할 수 있는 보안 취약점과 방어 방법을 구체적으로 제시해주세요. 예: 토큰 탈취, XSS 공격, CSRF 방어 등",
    tags: ["보안", "보안점검", "취약점"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "testing-001",
    title: "테스트 프롬프트 생성",
    category: "테스트",
    prompt:
      "비동기 함수와 외부 API를 포함한 복잡한 로직의 테스트 작성 방법을 구체적으로 제시해주세요. 예: 모킹 전략, 테스트 격리, 통합 테스트 등",
    tags: ["테스트", "테스트코드", "품질보증"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "documentation-001",
    title: "문서화 프롬프트 생성",
    category: "문서화",
    prompt:
      "REST API 문서화의 모범 사례와 구체적인 작성 방법을 제시해주세요. 예: OpenAPI 스펙, 예시 코드, 에러 응답 문서화 등",
    tags: ["문서화", "기술문서", "API문서"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  {
    id: "refactoring-001",
    title: "리팩토링 프롬프트 생성",
    category: "리팩토링",
    prompt:
      "레거시 코드를 현대적인 패턴으로 리팩토링하는 구체적인 전략과 단계를 제시해주세요. 예: 점진적 리팩토링, 테스트 주도 리팩토링, 패턴 적용 등",
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
