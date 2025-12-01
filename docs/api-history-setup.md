# API 히스토리 Supabase 저장 설정 가이드

## 개요

API 키 발급 히스토리와 API 생성 히스토리를 Supabase에 암호화하여 저장하는 기능입니다.

## 필수 설정

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# 암호화 키 (32자 이상의 랜덤 문자열)
# ⚠️ 중요: API 발급 서버(connect-agent.aiharu.net)와 동일한 키를 사용해야 합니다!
ENCRYPTION_KEY=your_encryption_key_here_minimum_32_characters
```

**⚠️ 중요 사항**:
1. **API 발급 서버와 동일한 키 사용**: `ENCRYPTION_KEY`는 반드시 API 발급 서버(`connect-agent.aiharu.net`)와 동일한 값이어야 합니다. 그렇지 않으면 데이터 암호화/복호화가 제대로 작동하지 않습니다.
2. **키 보안**: 암호화 키는 안전하게 보관하세요. 키를 잃어버리면 저장된 데이터를 복호화할 수 없습니다.
3. **키 공유**: API 발급 서버 관리자에게 동일한 암호화 키를 요청하거나, 공유된 키를 사용하세요.

암호화 키 생성 방법 (새로 생성하는 경우):
```bash
# OpenSSL 사용
openssl rand -hex 32

# 또는 Node.js 사용
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Supabase 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- docs/supabase-api-history-tables.sql 파일의 내용을 실행
```

또는 Supabase 대시보드에서:
1. SQL Editor 열기
2. `docs/supabase-api-history-tables.sql` 파일의 내용 복사하여 실행

### 3. 테이블 구조

#### `api_key_history` 테이블
- `id`: UUID (Primary Key)
- `user_id`: UUID (사용자 ID, auth.users 참조)
- `email`: TEXT (이메일)
- `name`: TEXT (API 키 이름)
- `description`: TEXT (설명, 선택사항)
- `encrypted_api_key`: TEXT (암호화된 API 키)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

#### `api_generation_history` 테이블
- `id`: UUID (Primary Key)
- `user_id`: UUID (사용자 ID, auth.users 참조)
- `type`: TEXT ('adventure' 또는 'riddle')
- `encrypted_request`: TEXT (암호화된 요청 데이터)
- `encrypted_response`: TEXT (암호화된 응답 데이터)
- `success`: BOOLEAN (성공 여부)
- `error_message`: TEXT (에러 메시지, 선택사항)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### 4. 보안 설정

- **Row Level Security (RLS)**: 각 사용자는 자신의 데이터만 조회/삭제 가능
- **암호화**: API 키와 요청/응답 데이터는 AES-256-GCM으로 암호화되어 저장
- **인증**: Supabase 인증이 필요하며, 인증되지 않은 사용자는 접근 불가

## 사용 방법

### API 키 발급 히스토리

1. API 키를 발급하면 자동으로 Supabase에 저장됩니다
2. 히스토리는 `/api/api-history/keys` 엔드포인트를 통해 조회됩니다
3. API 키는 암호화되어 저장되며, 클라이언트에는 마스킹된 형태로만 표시됩니다

### API 생성 히스토리

1. 모험 또는 퀴즈를 생성하면 자동으로 Supabase에 저장됩니다
2. 히스토리는 `/api/api-history/generations` 엔드포인트를 통해 조회됩니다
3. 요청/응답 데이터는 암호화되어 저장됩니다

## API 엔드포인트

### API 키 히스토리

- `POST /api/api-history/keys`: 히스토리 저장
- `GET /api/api-history/keys`: 히스토리 조회
- `DELETE /api/api-history/keys`: 전체 삭제
- `DELETE /api/api-history/keys?id={id}`: 특정 항목 삭제

### API 생성 히스토리

- `POST /api/api-history/generations`: 히스토리 저장
- `GET /api/api-history/generations?limit={limit}`: 히스토리 조회
- `DELETE /api/api-history/generations`: 전체 삭제
- `DELETE /api/api-history/generations?id={id}`: 특정 항목 삭제

## 폴백 메커니즘

Supabase 저장이 실패하거나 네트워크 오류가 발생하면:
- 로컬 스토리지에 백업 저장
- Supabase 조회 실패 시 로컬 스토리지에서 로드

이를 통해 오프라인 환경에서도 기본 기능을 사용할 수 있습니다.

## 주의사항

1. **암호화 키 보안**: `ENCRYPTION_KEY`는 절대 공개 저장소에 커밋하지 마세요
2. **데이터 복구**: 암호화 키를 잃어버리면 저장된 데이터를 복구할 수 없습니다
3. **용량 관리**: 히스토리는 최대 50개(API 키), 100개(생성)까지 저장됩니다
4. **인증 필요**: 모든 API는 Supabase 인증이 필요합니다

