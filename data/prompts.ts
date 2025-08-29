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
      "개발자가 코드 리뷰를 할 때 도움이 될 수 있는 실용적인 개발 가이드를 작성해주세요. React, JavaScript, Python, Java 등 다양한 언어의 코드 예시를 포함하고, 성능, 가독성, 보안, 모범 사례 관점에서 구체적인 개선 방안과 실제 코드 예시를 제시해주세요. 각 섹션마다 문제가 있는 코드와 개선된 코드를 비교하여 보여주세요.",
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
      "개발자가 디버깅을 할 때 도움이 될 수 있는 실용적인 디버깅 가이드를 작성해주세요. 비동기 처리, 메모리 누수, 성능 문제, 에러 처리 등 다양한 디버깅 상황에 대한 구체적인 해결 방안과 실제 코드 예시를 제시해주세요. 각 문제 상황마다 진단 방법, 해결 단계, 예방 방법을 포함해주세요.",
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
      "개발자가 시스템 아키텍처를 설계할 때 도움이 될 수 있는 실용적인 아키텍처 설계 가이드를 작성해주세요. 마이크로서비스, 모놀리식, 이벤트 기반 아키텍처, 클라우드 네이티브 등 다양한 아키텍처 패턴의 구체적인 구현 방법과 실제 예시를 제시해주세요. 각 패턴마다 장단점, 사용 시나리오, 구현 단계, 확장성, 유지보수성, 성능 관점에서의 고려사항을 포함해주세요.",
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
      "개발자가 성능 최적화를 할 때 도움이 될 수 있는 실용적인 성능 최적화 가이드를 작성해주세요. 데이터베이스 쿼리 최적화, 프론트엔드 성능, 백엔드 API 최적화, 메모리 사용량 최적화 등 다양한 성능 이슈에 대한 구체적인 최적화 방안과 실제 코드 예시를 제시해주세요. 각 최적화 기법마다 성능 측정 방법, 개선 효과, 구현 단계를 포함해주세요.",
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
      "개발자가 보안을 점검할 때 도움이 될 수 있는 실용적인 보안 가이드를 작성해주세요. SQL Injection, XSS, CSRF, 인증/인가, 데이터 암호화, API 보안 등 다양한 보안 이슈에 대한 구체적인 방어 방안과 실제 코드 예시를 제시해주세요. 각 보안 위협마다 공격 원리, 취약점 진단 방법, 보안 강화 구현 방법을 포함해주세요.",
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
      "개발자가 테스트를 작성할 때 도움이 될 수 있는 실용적인 테스트 작성 가이드를 작성해주세요. 단위 테스트, 통합 테스트, E2E 테스트, 모킹, 테스트 커버리지 등 다양한 테스트 상황에 대한 구체적인 테스트 코드 작성 방법과 실제 예시를 제시해주세요. 각 테스트 유형마다 테스트 구조, 모킹 방법, 어설션 작성법, 테스트 실행 방법을 포함해주세요.",
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
      "개발자가 문서를 작성할 때 도움이 될 수 있는 실용적인 문서화 가이드를 작성해주세요. API 문서, README, 기술 문서, 사용자 가이드, 코드 주석 등 다양한 문서화 상황에 대한 구체적인 작성 방법과 실제 예시를 제시해주세요. 각 문서 유형마다 구조, 필수 요소, 작성 팁, 템플릿 예시를 포함해주세요.",
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
      "개발자가 리팩토링을 할 때 도움이 될 수 있는 실용적인 리팩토링 가이드를 작성해주세요. 코드 중복 제거, 함수 분리, 클래스 설계 개선, 디자인 패턴 적용 등 다양한 리팩토링 상황에 대한 구체적인 개선 방안과 실제 코드 예시를 제시해주세요. 각 리팩토링 기법마다 리팩토링 전후 코드 비교, 개선 효과, 적용 단계를 포함해주세요.",
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
