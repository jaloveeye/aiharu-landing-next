# GitHub Actions 외부 LLM fallback 설정

`.github/workflows/external-llm-fallback.yml`은 로컬 작업보다 60분 늦고 기존 게시 기준보다 30분 늦게 보호된 운영 API를 호출한다.

- 일일 프롬프트: 로컬 08:30 → 게시 기준 09:00 → 외부 fallback 09:30 KST
- 뉴스 수집: 로컬 12:30 → 게시 기준 13:00 → 외부 fallback 13:30 KST

두 경로 모두 `operation_runs`의 일자별 lease를 사용하므로 로컬 작업이 완료됐거나 실행 중이면 외부 writer는 저장하지 않는다.

## 필수 GitHub 설정

Actions repository secrets:

- `AIHARU_URL`: 배포된 아이하루 주소
- `INTERNAL_API_SECRET`: 배포 앱과 동일한 내부 API 비밀값

Actions repository variable:

- `EXTERNAL_FALLBACK_ENABLED=true`: 7일 shadow 기간과 롤백 상태

배포 앱에는 OpenAI, Supabase, 뉴스 API 키와 `AIHARU_ALERT_WEBHOOK_URL`이 설정되어 있어야 한다. 외부 workflow에 해당 공급자 비밀값을 직접 전달하지 않는다.

## 자동·수동 실행

자동 cron은 00:30/04:30 UTC에 실행된다. GitHub Actions 지연이 발생해도 lease가 먼저 현재 일자의 완료 상태를 확인한다.

`workflow_dispatch`에서는 일일 프롬프트 또는 뉴스 수집을 선택할 수 있다. 수동 실행은 repository variable이 `false`여도 항상 유지된다.

## Shadow 종료와 롤백

`scripts/promote-local-ai.sh`는 최근 7일의 두 작업이 모두 로컬 executor로 기준 시각 전에 성공했고 fallback 0회, 모델 checksum과 moderation 기록이 있을 때만 `EXTERNAL_FALLBACK_ENABLED=false`로 변경한다.

`scripts/rollback-local-ai.sh`는 로컬 systemd 타이머를 비활성화하고 repository variable을 `true`로 복구한다.
