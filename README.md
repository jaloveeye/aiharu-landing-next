# aiharu-landing-next

오늘의 하루를 더 똑똑하고 따뜻하게

aiharu는 'AI와 하루', '아이와 하루'의 의미를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물하는 서비스입니다.

---

## ✨ 주요 특징

- 감성적이고 따뜻한 랜딩 페이지 디자인
- Next.js 14, Tailwind CSS 기반
- AI(지능)와 아이(따뜻함)의 조화로운 메시지
- 반응형, 모바일 친화적 UI
- **Storybook 기반 UI 컴포넌트 문서화**
- **테스트 코드 및 유틸/상수 통합 관리**

---

## 🚀 시작하기

```bash
npm install
npm run dev
```

- 개발: [http://localhost:3000](http://localhost:3000)
- Storybook: [http://localhost:6006](http://localhost:6006) (`npm run storybook`)

---

## 🛠️ 주요 파일 구조

- `app/` : 페이지, API, hooks, utils 등 핵심 로직
- `components/ui/` : 공통 UI 컴포넌트 (Button, Card, Alert, Input, Carousel 등)
- `components/MealAnalysisForm.tsx` : 식단 분석 공통 폼 컴포넌트
- `app/hooks/useMealAnalysisForm.ts` : 식단 분석 폼용 커스텀 훅
- `app/utils/constants.ts` : 영양소 카테고리 등 상수
- `app/utils/recommendation.ts` : 영양소 추천 추출/피드백 유틸
- `stories/` : Storybook 예시/가이드

---

## 🧩 주요 UI 컴포넌트

- **Button**: 다양한 스타일의 버튼, `variant`, `as` 등 지원
- **Alert**: 에러/성공/정보 메시지 표시
- **Card**: 기본 카드 레이아웃
- **Input**: 공통 인풋 필드
- **Carousel**: 커스텀 아이템 슬라이더
- **Spinner**: 로딩 인디케이터
- **IconAnalysisType**: 분석 타입별 아이콘

> 모든 컴포넌트는 `components/ui/`에 위치하며, Storybook에서 문서화되어 있습니다.

---

## 🧪 테스트

- `npm run test` 또는 `npx vitest run`  
- 주요 UI 컴포넌트 및 유틸 함수에 대한 테스트 코드 포함

---

## 📚 Storybook 문서화

- `npm run storybook`  
- 모든 UI 컴포넌트는 Storybook에서 문서화/테스트 가능
- 스토리 파일: `components/ui/*.stories.tsx`

---

## 🧑‍💻 주요 유틸/로직 예시

```ts
// 영양소 추천 추출
import { extractRecommendations } from '@/app/utils/recommendation';
const recs = extractRecommendations('부족한 영양소: [단백질, 칼슘]');
// => [{ category: '단백질', content: '단백질 보충이 필요합니다.' }, ...]
```

---

## 💡 기여 및 문의

- 아이디어, 피드백, 버그 제보는 언제든 환영합니다!
- [GitHub Issues](https://github.com/jaloveeye/aiharu-landing-next/issues)로 남겨주세요.

---

함께하는 하루, aiharu
