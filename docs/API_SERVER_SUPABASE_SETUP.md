# API 서버 Supabase 통합 가이드 (요약)

## 빠른 시작

### 1. 환경 변수 설정

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ENCRYPTION_KEY=랜딩페이지와_동일한_키
```

### 2. Supabase 테이블 생성

`docs/supabase-api-history-tables-v2.sql` 파일의 SQL을 실행하세요.

### 3. 암호화 유틸리티

`docs/api-server-supabase-integration.md` 파일의 암호화 코드를 참고하세요.

### 4. 히스토리 저장

API 키 발급 시:
- `api_key_history` 테이블에 저장
- `encrypted_api_key` 필드에 암호화된 API 키 저장
- `user_id` 또는 `anonymous_id` 필수

API 생성 시:
- `api_generation_history` 테이블에 저장
- `encrypted_request`, `encrypted_response` 필드에 암호화된 데이터 저장
- `user_id` 또는 `anonymous_id` 필수

## 상세 가이드

자세한 내용은 `docs/api-server-supabase-integration.md` 파일을 참고하세요.

