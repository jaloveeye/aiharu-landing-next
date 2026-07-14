# 운영 보안 및 예약 작업

## 비밀키

INTERNAL_API_SECRET은 32바이트 이상의 무작위 값으로 생성하고 배포 앱과 작업 서버에만 저장한다.
내부 작업 API는 Authorization: Bearer <INTERNAL_API_SECRET> 헤더가 없는 요청을 401로 거부한다.
키 교체 시 새 값을 배포 앱에 먼저 반영한 뒤 작업 서버를 갱신한다.

## 로컬 AI 예약 작업

AI 워크스테이션의 사용자 systemd 타이머가 유일한 자동 실행 주체다. 각 실행은 필요한 vLLM 컨테이너와 로컬 Next.js 작업 서버를 시작하고 API 완료 후 자신이 시작한 프로세스만 종료한다.

- 매일 08:30 Asia/Seoul: Qwen + BGE-M3 → `/api/generate-daily-prompt` (게시 기준 09:00)
- 매일 12:30 Asia/Seoul: Qwen → `/api/collect-ai-news` (게시 기준 13:00)
- GitHub Actions 외부 fallback: 09:30/13:30. 로컬 작업이 완료된 날은 동일 lease에 의해 writer가 차단된다.
- 다른 GPU 작업, 누락된 모델, 모델 시작 실패 시 로컬 작업을 `failed`로 기록하고 09:30/13:30 GitHub Actions가 OpenAI로 인수한다.
- 실행 중인 호환 모델은 재사용하되 예약 실행이 시작하지 않은 프로세스는 종료하지 않는다.

### 최초 준비

1. `20260713_operation_runs.sql`, `20260713_operation_shadow_rollout.sql`, `20260713_prompt_embeddings_v2.sql`을 순서대로 Supabase 관리 채널에서 적용한다.
2. `QWEN_HF_REVISION`과 `BGE_HF_REVISION`을 40자리 commit hash로 고정하고 `scripts/prepare-local-ai-assets.sh`로 Docker 이미지와 해당 Qwen/BGE-M3 snapshot을 미리 캐시한다. 예약 실행 중 다운로드는 금지된다.
3. 프로덕션 환경값으로 `npm run build`를 실행한다.
4. `~/.config/aiharu/scheduled.env`에 OpenAI, Supabase, 뉴스 API, 내부 인증 및 로컬 AI 환경값을 저장하고 권한을 `0600`으로 설정한다.
5. `loginctl enable-linger "$USER"`를 한 번 실행한 뒤 `scripts/install-local-ai-schedule.sh`를 실행한다.

설치 스크립트는 BGE 캐시, Next 빌드, 환경 파일 권한을 확인한 후에만 타이머를 활성화한다. 현재 상태는 `systemctl --user list-timers 'aiharu-*'`로 확인한다.

### 수동 검증 및 운영

```bash
scripts/run-scheduled-operation.sh generate-daily-prompt --dry-run
scripts/run-scheduled-operation.sh collect-ai-news --dry-run
systemctl --user start aiharu-collect-news.service
journalctl --user -u aiharu-collect-news.service -n 200
```

작업은 전역 파일 락으로 직렬화된다. API는 `operation_runs`의 일자별 고유 제약으로 재시도를 멱등 처리한다. 로그와 선택적인 실패 웹훅에는 작업명, 실행 ID, 모델, 공급자, 지연시간과 폴백 사유만 기록하며 프롬프트·응답·비밀값은 기록하지 않는다.

결과 상태는 `completed`, `failed`, `skipped_already_processed`, `skipped_lock_busy`다. 예약 로컬 worker는 `LOCAL_AI_REQUIRE_LOCAL=true`를 강제하므로 로컬 생성 실패를 같은 프로세스의 OpenAI 호출로 숨기지 않는다. 단, 7일 비교 기간의 OpenAI embedding dual-write는 fallback이 아닌 shadow 측정으로 유지한다. 실패·SIGTERM에서도 trap이 로컬 작업 서버, BGE, Qwen 순으로 종료한다.

### 7일 shadow 전환

`operation_runs`에는 시작·게시 시각, 실행 시간, executor, 모델과 Hugging Face revision checksum, 기존 프롬프트/뉴스 품질 moderation 결과, 재시도·fallback 횟수를 기록한다. `AIHARU_ALERT_WEBHOOK_URL`이 설정된 경우에만 실패 알림 시각도 기록한다. 일자별 unique 제약과 55분 lease token이 로컬·외부·수동 writer를 직렬화한다. 로컬 systemd 작업은 50분에 강제 종료되므로 60분 뒤 외부 fallback과 동시에 쓰지 않는다.

외부 정기 fallback은 저장소 변수 `EXTERNAL_FALLBACK_ENABLED`가 `false`가 될 때까지 유지한다. 다음 명령은 두 작업 모두 최근 7일 연속 로컬 실행이고 09:00/13:00 이전 게시, checksum 및 moderation 기록이 있을 때만 외부 정기 fallback을 비활성화한다. 수동 workflow dispatch는 계속 사용할 수 있다.

```bash
scripts/promote-local-ai.sh
```

비활성화는 다음 명령으로 수행한다.

```bash
scripts/rollback-local-ai.sh
```

롤백은 로컬 타이머를 즉시 비활성화하고 `EXTERNAL_FALLBACK_ENABLED=true`를 복구한다.

## RLS 적용

1. 스테이징 DB에 다음 순서로 migration을 적용한다: operation_runs, operation_shadow_rollout, prompt_embeddings_v2, api_rate_limits, api_history_hardening, meal_recommendation_rls, enable_rls.
2. anon 공개 읽기, 사용자 본인 CRUD, 타 사용자 접근 거부, service-role 쓰기를 검증한다.
3. 사용자 데이터 테이블 그룹을 운영에 먼저 적용한 후 공개 콘텐츠 테이블 그룹을 적용한다.
4. 장애 시 정책을 수정하며 RLS 전체 비활성화나 런타임 SQL API를 복구하지 않는다.

## 개발 전용 경로

/api/debug-news와 /api/test-* API, 그리고 비전·추천·UI 예제 페이지는 production에서 404를 반환한다. DB migration은 Supabase 관리 채널에서만 실행한다.
