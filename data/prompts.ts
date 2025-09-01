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
    | "리팩토링"
    | "학습교육"
    | "비즈니스"
    | "창작디자인"
    | "일상라이프"
    | "창의성"
    | "사회환경"
    | "금융투자"
    | "건강웰빙"
    | "육아";
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
  // 개발 카테고리들
  {
    id: "code-review-001",
    title: "코드 리뷰 프롬프트 생성",
    category: "코드리뷰",
    prompt:
      "실제 개발 프로젝트에서 발생하는 복잡한 코드 리뷰 상황을 제시해주세요. 예: 레거시 코드 리팩토링, 성능 병목 지점 개선, 보안 취약점 수정, 팀 코딩 컨벤션 통일, 마이크로서비스 간 의존성 관리, 데이터베이스 쿼리 최적화, 프론트엔드 상태 관리 복잡성 해결, API 설계 개선 등. 구체적인 기술 스택, 프로젝트 규모, 팀 상황, 비즈니스 요구사항을 포함하여 실제 개발자가 마주할 수 있는 복합적인 문제를 다루어주세요.",
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
    id: "business-001",
    title: "비즈니스 전략 프롬프트 생성",
    category: "비즈니스",
    prompt:
      "스타트업이나 소규모 비즈니스의 성장 전략과 구체적인 실행 방법을 제시해주세요. 예: 고객 개발, 제품 시장 적합성, 마케팅 전략 등",
    tags: ["비즈니스", "경영", "전략"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 창작 & 디자인
  {
    id: "creative-001",
    title: "창작 과정 프롬프트 생성",
    category: "창작디자인",
    prompt:
      "창작 과정에서 창의적 블록을 극복하고 아이디어를 발전시키는 구체적인 방법을 제시해주세요. 예: 브레인스토밍 기법, 시각적 사고, 프로토타이핑 등",
    tags: ["창작", "디자인", "창의성"],
    difficulty: "초급",
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
  // 창의성 & 문제해결
  {
    id: "problem-solving-001",
    title: "문제해결 프롬프트 생성",
    category: "창의성",
    prompt:
      "복잡한 문제를 창의적으로 해결하는 구체적인 접근 방법과 사고 과정을 제시해주세요. 예: 디자인 씽킹, 시스템 사고, 역발상 등",
    tags: ["문제해결", "창의성", "사고방법"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 사회 & 환경
  {
    id: "social-001",
    title: "사회적 영향 프롬프트 생성",
    category: "사회환경",
    prompt:
      "기술이나 비즈니스가 사회와 환경에 미치는 긍정적 영향을 극대화하는 구체적인 방법을 제시해주세요. 예: 지속가능성, 사회적 책임, 포용적 디자인 등",
    tags: ["사회적영향", "환경", "지속가능성"],
    difficulty: "중급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 금융 & 투자
  {
    id: "finance-001",
    title: "개인 금융 관리 프롬프트 생성",
    category: "금융투자",
    prompt:
      "개인 재정을 체계적으로 관리하고 미래를 대비하는 구체적인 방법을 제시해주세요. 예: 예산 관리, 투자 전략, 위험 관리 등",
    tags: ["금융", "투자", "재정관리"],
    difficulty: "초급",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20",
  },
  // 건강 & 웰빙
  {
    id: "health-001",
    title: "건강 관리 프롬프트 생성",
    category: "건강웰빙",
    prompt:
      "바쁜 일상 속에서 건강을 유지하고 웰빙을 향상시키는 구체적인 방법을 제시해주세요. 예: 운동 루틴, 영양 관리, 스트레스 관리 등",
    tags: ["건강", "웰빙", "라이프스타일"],
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
