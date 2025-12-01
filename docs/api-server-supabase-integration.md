# API 서버 Supabase 통합 가이드

이 문서는 API 발급 및 모험 생성 서버(`connect-agent.aiharu.net`)에서 Supabase에 히스토리를 저장하기 위한 설정 가이드입니다.

## 개요

API 키 발급 히스토리와 API 생성 히스토리를 Supabase에 암호화하여 저장합니다. 랜딩 페이지와 동일한 데이터베이스를 사용하여 통합된 통계를 제공합니다.

## 필수 설정

### 1. 환경 변수

API 서버의 환경 변수에 다음을 추가하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 암호화 키 (랜딩 페이지와 동일한 키 사용 필수!)
ENCRYPTION_KEY=your_encryption_key_here_minimum_32_characters
```

**⚠️ 중요**: `ENCRYPTION_KEY`는 반드시 랜딩 페이지(`aiharu-landing-next`)와 동일한 값이어야 합니다!

### 2. Supabase 테이블 생성

#### 2.1 초기 테이블 생성 (테이블이 없는 경우)

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- API 키 발급 히스토리 테이블
CREATE TABLE IF NOT EXISTS api_key_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id TEXT,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  encrypted_api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API 생성 히스토리 테이블
CREATE TABLE IF NOT EXISTS api_generation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('adventure', 'riddle')),
  encrypted_request TEXT NOT NULL,
  encrypted_response TEXT NOT NULL,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_api_key_history_user_id ON api_key_history(user_id);
CREATE INDEX IF NOT EXISTS idx_api_key_history_anonymous_id ON api_key_history(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_api_key_history_created_at ON api_key_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_user_id ON api_generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_anonymous_id ON api_generation_history(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_created_at ON api_generation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_type ON api_generation_history(type);

-- RLS 활성화
ALTER TABLE api_key_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
CREATE POLICY "Users can view their own API key history"
  ON api_key_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert API key history"
  ON api_key_history FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
  );

CREATE POLICY "Users can delete their own API key history"
  ON api_key_history FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own API generation history"
  ON api_generation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert API generation history"
  ON api_generation_history FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
  );

CREATE POLICY "Users can delete their own API generation history"
  ON api_generation_history FOR DELETE
  USING (auth.uid() = user_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_api_key_history_updated_at
  BEFORE UPDATE ON api_key_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_generation_history_updated_at
  BEFORE UPDATE ON api_generation_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 2.2 기존 테이블 업데이트 (테이블이 이미 있는 경우)

기존 테이블이 있다면 아래 SQL을 실행하여 익명 사용자 지원을 추가하세요:

```sql
-- API 키 발급 히스토리 테이블 (익명 사용자 지원)
ALTER TABLE api_key_history 
  ALTER COLUMN user_id DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS api_key_history_user_id_fkey;

ALTER TABLE api_key_history 
  ADD COLUMN IF NOT EXISTS anonymous_id TEXT;

-- API 생성 히스토리 테이블도 동일하게 수정
ALTER TABLE api_generation_history 
  ALTER COLUMN user_id DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS api_generation_history_user_id_fkey;

ALTER TABLE api_generation_history 
  ADD COLUMN IF NOT EXISTS anonymous_id TEXT;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_api_key_history_anonymous_id ON api_key_history(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_api_generation_history_anonymous_id ON api_generation_history(anonymous_id);

-- RLS 정책 수정 (익명 사용자도 삽입 가능하도록)
DROP POLICY IF EXISTS "Users can insert their own API key history" ON api_key_history;
DROP POLICY IF EXISTS "Users can insert their own API generation history" ON api_generation_history;

CREATE POLICY "Users can insert API key history"
  ON api_key_history FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
  );

CREATE POLICY "Users can insert API generation history"
  ON api_generation_history FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_id IS NOT NULL)
  );
```

## 테이블 구조

### `api_key_history` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | Primary Key |
| `user_id` | UUID (nullable) | 인증된 사용자 ID (auth.users 참조) |
| `anonymous_id` | TEXT (nullable) | 익명 사용자 ID |
| `email` | TEXT | 이메일 |
| `name` | TEXT | API 키 이름 |
| `description` | TEXT | 설명 (선택사항) |
| `encrypted_api_key` | TEXT | 암호화된 API 키 |
| `created_at` | TIMESTAMPTZ | 생성일시 |
| `updated_at` | TIMESTAMPTZ | 수정일시 |

**주의**: `user_id`와 `anonymous_id` 중 하나는 반드시 값이 있어야 합니다.

### `api_generation_history` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | Primary Key |
| `user_id` | UUID (nullable) | 인증된 사용자 ID (auth.users 참조) |
| `anonymous_id` | TEXT (nullable) | 익명 사용자 ID |
| `type` | TEXT | 'adventure' 또는 'riddle' |
| `encrypted_request` | TEXT | 암호화된 요청 데이터 |
| `encrypted_response` | TEXT | 암호화된 응답 데이터 |
| `success` | BOOLEAN | 성공 여부 |
| `error_message` | TEXT | 에러 메시지 (선택사항) |
| `created_at` | TIMESTAMPTZ | 생성일시 |
| `updated_at` | TIMESTAMPTZ | 수정일시 |

**주의**: `user_id`와 `anonymous_id` 중 하나는 반드시 값이 있어야 합니다.

## 암호화 유틸리티

랜딩 페이지와 동일한 암호화 방식을 사용해야 합니다:

```typescript
import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY 환경 변수가 설정되지 않았습니다.");
  }
  return crypto.createHash("sha256").update(key).digest();
}

export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  return iv.toString("hex") + ":" + tag.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedData: string): string {
  const key = getEncryptionKey();
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("잘못된 암호화 데이터 형식입니다.");
  }

  const iv = Buffer.from(parts[0], "hex");
  const tag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
```

## API 키 발급 히스토리 저장 예시

```typescript
import { createClient } from "@supabase/supabase-js";
import { encrypt } from "./encryption";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 서비스 역할 키 사용
);

async function saveApiKeyHistory(data: {
  email: string;
  name: string;
  description?: string;
  apiKey: string;
  userId?: string;
  anonymousId?: string;
}) {
  // API 키 암호화
  const encryptedApiKey = encrypt(data.apiKey);

  const insertData: any = {
    email: data.email,
    name: data.name,
    description: data.description || null,
    encrypted_api_key: encryptedApiKey,
    created_at: new Date().toISOString(),
  };

  // 인증된 사용자면 user_id, 아니면 anonymous_id
  if (data.userId) {
    insertData.user_id = data.userId;
  } else if (data.anonymousId) {
    insertData.anonymous_id = data.anonymousId;
  } else {
    throw new Error("user_id 또는 anonymous_id가 필요합니다.");
  }

  const { data: result, error } = await supabase
    .from("api_key_history")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("API 키 히스토리 저장 실패:", error);
    throw error;
  }

  return result;
}
```

## API 생성 히스토리 저장 예시

```typescript
async function saveGenerationHistory(data: {
  type: "adventure" | "riddle";
  request: any;
  response: any;
  success: boolean;
  error?: string;
  userId?: string;
  anonymousId?: string;
}) {
  // 요청/응답 데이터 암호화
  const encryptedRequest = encrypt(JSON.stringify(data.request));
  const encryptedResponse = encrypt(JSON.stringify(data.response));

  const insertData: any = {
    type: data.type,
    encrypted_request: encryptedRequest,
    encrypted_response: encryptedResponse,
    success: data.success,
    error_message: data.error || null,
    created_at: new Date().toISOString(),
  };

  // 인증된 사용자면 user_id, 아니면 anonymous_id
  if (data.userId) {
    insertData.user_id = data.userId;
  } else if (data.anonymousId) {
    insertData.anonymous_id = data.anonymousId;
  } else {
    throw new Error("user_id 또는 anonymous_id가 필요합니다.");
  }

  const { data: result, error } = await supabase
    .from("api_generation_history")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("API 생성 히스토리 저장 실패:", error);
    throw error;
  }

  return result;
}
```

## 익명 사용자 ID 처리

클라이언트에서 `anonymous_id`를 헤더로 전달받거나, 요청에서 추출해야 합니다:

```typescript
// 예시: 요청 헤더에서 anonymous_id 추출
const anonymousId = request.headers.get("x-anonymous-id");

// 또는 요청 본문에서 추출
const { anonymousId } = await request.json();
```

## 통계 조회

관리자용 통계는 랜딩 페이지의 `/api/api-statistics` 엔드포인트를 통해 조회할 수 있습니다.

또는 직접 Supabase에서 조회:

```typescript
// API 키 발급 통계
const { data: keyStats } = await supabase
  .from("api_key_history")
  .select("*")
  .gte("created_at", startDate)
  .lte("created_at", endDate);

// API 생성 통계
const { data: genStats } = await supabase
  .from("api_generation_history")
  .select("*")
  .gte("created_at", startDate)
  .lte("created_at", endDate);
```

## 주의사항

1. **암호화 키 동기화**: `ENCRYPTION_KEY`는 반드시 랜딩 페이지와 동일한 값이어야 합니다.
2. **서비스 역할 키 사용**: 서버 사이드에서는 `SUPABASE_SERVICE_ROLE_KEY`를 사용하여 RLS를 우회할 수 있습니다.
3. **익명 사용자 추적**: 클라이언트에서 `anonymous_id`를 전달받아야 합니다.
4. **에러 처리**: Supabase 저장 실패 시에도 API 응답은 정상적으로 반환해야 합니다 (히스토리 저장은 부가 기능).

## 연락처

문의사항이 있으시면 랜딩 페이지 개발팀에 연락하세요.
