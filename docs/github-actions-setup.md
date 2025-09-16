# GitHub Actions 뉴스 수집 설정 가이드

## 1. GitHub Secrets 설정

GitHub 저장소에서 다음 환경 변수들을 Secrets로 설정해야 합니다:

### 필수 환경 변수
- `OPENAI_API_KEY`: OpenAI API 키
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 역할 키

### 선택적 환경 변수 (뉴스 수집용)
- `NEWS_API_KEY`: NewsAPI 키 (https://newsapi.org/)
- `GNEWS_API_KEY`: GNews API 키 (https://gnews.io/)

## 2. GitHub Secrets 설정 방법

1. GitHub 저장소로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** → **Actions** 클릭
4. **New repository secret** 버튼 클릭
5. 각 환경 변수 이름과 값을 입력하여 추가

## 3. Workflow 실행

### 자동 실행
- 매일 오전 4시 (UTC) = 한국시간 오전 1시에 자동 실행

### 수동 실행
1. GitHub 저장소의 **Actions** 탭으로 이동
2. **AI 뉴스 수집** workflow 선택
3. **Run workflow** 버튼 클릭

## 4. 로그 확인

Actions 탭에서 실행 결과와 로그를 확인할 수 있습니다:
- ✅ 성공: 수집된 뉴스 개수 표시
- ❌ 실패: 오류 메시지와 함께 실패 원인 표시

## 5. 문제 해결

### 일반적인 문제들

1. **환경 변수 누락**
   - 모든 필수 환경 변수가 설정되었는지 확인
   - 변수 이름이 정확한지 확인 (대소문자 구분)

2. **API 키 오류**
   - OpenAI API 키가 유효한지 확인
   - Supabase 키가 올바른지 확인
   - 뉴스 API 키가 유효한지 확인

3. **네트워크 오류**
   - GitHub Actions의 네트워크 제한으로 인한 일시적 오류
   - 자동으로 재시도되므로 다음 실행에서 정상 작동할 수 있음

## 6. 모니터링

뉴스 수집이 정상적으로 작동하는지 확인하려면:
1. Supabase 데이터베이스의 `ai_news` 테이블 확인
2. GitHub Actions 로그에서 수집된 뉴스 개수 확인
3. 웹사이트에서 뉴스 섹션이 업데이트되는지 확인
