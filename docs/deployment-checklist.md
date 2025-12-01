# 배포 전 체크리스트

## 환경 변수 확인

### 필수 환경 변수

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase 프로젝트 URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key (서버 사이드 전용)
- [ ] `ENCRYPTION_KEY` - 암호화 키 (API 서버와 동일한 값)
- [ ] `OPENAI_API_KEY` - OpenAI API 키 (선택사항, 기본값 사용 가능)

### 확인 사항

- [ ] `ENCRYPTION_KEY`가 API 발급 서버(`connect-agent.aiharu.net`)와 동일한지 확인
- [ ] 모든 환경 변수가 `.env.local`에 설정되어 있는지 확인
- [ ] 프로덕션 환경 변수가 배포 플랫폼(Vercel 등)에 설정되어 있는지 확인

## Supabase 설정 확인

### 테이블 생성

- [ ] `api_key_history` 테이블 생성 완료
- [ ] `api_generation_history` 테이블 생성 완료
- [ ] `anonymous_id` 필드 추가 완료
- [ ] 인덱스 생성 완료

### RLS 정책

- [ ] RLS 활성화 확인
- [ ] INSERT 정책이 익명 사용자도 허용하는지 확인
- [ ] SELECT/DELETE 정책이 올바르게 설정되었는지 확인

### SQL 실행 확인

- [ ] `docs/supabase-api-history-tables-v2.sql` 실행 완료
- [ ] 또는 초기 테이블 생성 SQL 실행 완료

## 기능 테스트

### API 키 발급

- [ ] 인증되지 않은 사용자도 API 키 발급 가능한지 확인
- [ ] API 키 발급 후 히스토리가 로컬 스토리지에 저장되는지 확인
- [ ] API 키 발급 후 Supabase에 저장되는지 확인 (익명 사용자)
- [ ] API 키 발급 후 Supabase에 저장되는지 확인 (인증 사용자)

### API 테스트

- [ ] 모험 생성 테스트 (OpenAI API 키 필수)
- [ ] 퀴즈 생성 테스트 (OpenAI API 키 필수)
- [ ] 요청/응답이 히스토리에 저장되는지 확인
- [ ] 에러 발생 시에도 히스토리에 저장되는지 확인

### 히스토리 조회

- [ ] API 키 발급 히스토리 조회 가능한지 확인
- [ ] API 생성 히스토리 조회 가능한지 확인
- [ ] 익명 사용자 히스토리 조회 가능한지 확인
- [ ] 인증 사용자 히스토리 조회 가능한지 확인

### 통계 API

- [ ] `/api/api-statistics` 엔드포인트 작동 확인
- [ ] 날짜 범위 필터링 작동 확인
- [ ] 인증/익명 사용자 구분 통계 확인
- [ ] 타입별 통계 확인

## 보안 확인

- [ ] `ENCRYPTION_KEY`가 공개 저장소에 커밋되지 않았는지 확인
- [ ] `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [ ] Supabase Service Role Key가 클라이언트에 노출되지 않는지 확인
- [ ] RLS 정책이 올바르게 작동하는지 확인

## 성능 확인

- [ ] 암호화/복호화 성능 확인
- [ ] Supabase 저장 성능 확인
- [ ] 네트워크 오류 시 폴백 메커니즘 작동 확인

## 문서 확인

- [ ] API 매뉴얼에 OpenAI API 키 필수 표시 확인
- [ ] 사용 예시 코드에 OpenAI API 키 포함 확인
- [ ] Rate Limit 섹션 제거 확인

## 배포 후 확인 사항

- [ ] 프로덕션 환경에서 API 키 발급 작동 확인
- [ ] 프로덕션 환경에서 API 테스트 작동 확인
- [ ] 프로덕션 환경에서 히스토리 저장 작동 확인
- [ ] 프로덕션 환경에서 통계 API 작동 확인
- [ ] 에러 로그 모니터링

## 알려진 이슈

- 없음

## 다음 단계

1. 배포 전 모든 체크리스트 항목 확인
2. 로컬 환경에서 전체 기능 테스트
3. 스테이징 환경(있는 경우)에서 테스트
4. 프로덕션 배포
5. 배포 후 확인 사항 체크

