#!/usr/bin/env bash
set -Eeuo pipefail

operation="${1:-}"
dry_run="${2:-}"
case "$operation" in
  generate-daily-prompt|collect-ai-news) ;;
  *) echo "usage: $0 <generate-daily-prompt|collect-ai-news> [--dry-run]" >&2; exit 64 ;;
esac
if [[ -n "$dry_run" && "$dry_run" != "--dry-run" ]]; then
  echo "unknown option: $dry_run" >&2
  exit 64
fi

project_dir="${AIHARU_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
runtime_root="${XDG_RUNTIME_DIR:-/tmp}/aiharu-scheduled"
image="${VLLM_IMAGE:-nvcr.io/nvidia/vllm:26.05.post1-py3}"
hf_cache="${HF_CACHE_DIR:-$HOME/.cache/huggingface}"
qwen_model="${QWEN_HF_MODEL:-Qwen/Qwen3.6-35B-A3B-FP8}"
qwen_revision="${QWEN_HF_REVISION:-95a723d08a9490559dae23d0cff1d9466213d989}"
qwen_served="${LOCAL_LLM_MODEL:-qwen3.6-35b-a3b}"
bge_model="${LOCAL_EMBEDDING_MODEL:-BAAI/bge-m3}"
bge_revision="${BGE_HF_REVISION:-5617a9f61b028005a4858fdac845db406aefb181}"
qwen_container="aiharu-scheduled-qwen"
bge_container="aiharu-scheduled-bge-m3"
worker_pid=""
owns_qwen=0
owns_bge=0
result_status="failed"
api_run_id=""

log() { printf '%s operation=%s %s\n' "$(date --iso-8601=seconds)" "$operation" "$*"; }

if [[ "$dry_run" == "--dry-run" ]]; then
  log "event=lock_acquire"
  log "event=fallback_policy value=external-only"
  if [[ "$operation" == "generate-daily-prompt" ]]; then
    log "event=schedule local=08:30 target=09:00 fallback=09:30"
    log "event=model_start service=qwen"
    log "event=model_revision service=qwen revision=$qwen_revision"
    log "event=model_start service=bge-m3"
    log "event=model_revision service=bge-m3 revision=$bge_revision"
    log "event=features value=daily-prompt,embedding"
  else
    log "event=schedule local=12:30 target=13:00 fallback=13:30"
    log "event=model_start service=qwen"
    log "event=model_revision service=qwen revision=$qwen_revision"
    log "event=features value=news-classification,news-summary"
  fi
  log "event=worker_start port=3100"
  log "event=api_call path=/api/$operation"
  log "event=worker_stop"
  [[ "$operation" == "generate-daily-prompt" ]] && log "event=model_stop service=bge-m3"
  log "event=model_stop service=qwen"
  exit 0
fi

for command in curl docker flock node npm nvidia-smi; do
  command -v "$command" >/dev/null || { log "event=preflight_failed missing_command=$command"; exit 69; }
done
: "${INTERNAL_API_SECRET:?INTERNAL_API_SECRET is required}"
: "${OPENAI_API_KEY:?OPENAI_API_KEY is required for fallback}"

mkdir -p "$runtime_root"
chmod 700 "$runtime_root"
exec 9>"$runtime_root/operation.lock"
if ! flock -n 9; then
  log "event=skipped status=skipped_lock_busy"
  exit 75
fi

run_id="$(date +%Y%m%dT%H%M%S)-$$"
export AI_PROVIDER_AUDIT_FILE="$runtime_root/$run_id.jsonl"
response_file="$runtime_root/$run_id-response.json"
worker_log="$runtime_root/$run_id-worker.log"
: >"$AI_PROVIDER_AUDIT_FILE"
chmod 600 "$AI_PROVIDER_AUDIT_FILE"

notify() {
  local status="$1"
  [[ -z "${AIHARU_ALERT_WEBHOOK_URL:-}" ]] && return 0
  if curl --silent --show-error --fail --max-time 10 --request POST \
    --header "Content-Type: application/json" \
    --data "{\"operation\":\"$operation\",\"status\":\"$status\",\"runId\":\"$run_id\"}" \
    "$AIHARU_ALERT_WEBHOOK_URL" >/dev/null; then
    if [[ "$status" == "failed" && -n "$api_run_id" && -n "${NEXT_PUBLIC_SUPABASE_URL:-}" && -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
      curl --silent --show-error --fail --max-time 10 --request PATCH \
        --header "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
        --header "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        --header "Content-Type: application/json" \
        --data "{\"failure_notified_at\":\"$(date --iso-8601=seconds)\"}" \
        "${NEXT_PUBLIC_SUPABASE_URL%/}/rest/v1/operation_runs?id=eq.${api_run_id}" >/dev/null || true
    fi
  fi
}

stop_owned_container() {
  local name="$1" owned="$2"
  [[ "$owned" == "1" ]] || return 0
  log "event=model_stop service=$name"
  docker stop --time 30 "$name" >/dev/null 2>&1 || true
  docker rm "$name" >/dev/null 2>&1 || true
}

cleanup() {
  local exit_code=$?
  trap - EXIT INT TERM
  if [[ -n "$worker_pid" ]] && kill -0 "$worker_pid" 2>/dev/null; then
    log "event=worker_stop pid=$worker_pid"
    kill -TERM "$worker_pid" 2>/dev/null || true
    for _ in {1..30}; do kill -0 "$worker_pid" 2>/dev/null || break; sleep 1; done
    kill -KILL "$worker_pid" 2>/dev/null || true
    wait "$worker_pid" 2>/dev/null || true
  fi
  stop_owned_container "$bge_container" "$owns_bge"
  stop_owned_container "$qwen_container" "$owns_qwen"
  rm -f "$response_file" "$worker_log"
  if [[ "$exit_code" -ne 0 ]]; then
    result_status="failed"
    [[ -n "$api_run_id" ]] || notify "$result_status"
  fi
  log "event=finished status=$result_status exit_code=$exit_code audit_file=$AI_PROVIDER_AUDIT_FILE"
  exit "$exit_code"
}
trap cleanup EXIT INT TERM

model_matches() {
  local port="$1" expected="$2"
  curl --silent --fail --max-time 3 "http://127.0.0.1:$port/v1/models" 2>/dev/null | \
    node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.exit(j.data?.some(x=>x.id===process.argv[1])?0:1)}catch{process.exit(1)}})' "$expected"
}

port_responds() {
  curl --silent --max-time 2 "http://127.0.0.1:$1/" >/dev/null 2>&1
}

wait_for_model() {
  local port="$1" expected="$2" deadline=$((SECONDS + ${MODEL_START_TIMEOUT_SECONDS:-1200}))
  until model_matches "$port" "$expected"; do
    (( SECONDS >= deadline )) && return 1
    sleep 5
  done
}

remove_owned_stale_container() {
  local name="$1"
  if docker container inspect "$name" >/dev/null 2>&1; then
    local managed
    managed="$(docker container inspect "$name" --format '{{ index .Config.Labels "aiharu.scheduler" }}' 2>/dev/null || true)"
    [[ "$managed" == "true" ]] || return 1
    docker rm -f "$name" >/dev/null
  fi
}

verified_container_revision() {
  local name="$1" expected="$2"
  [[ "$(docker container inspect "$name" --format '{{ index .Config.Labels "aiharu.revision" }}' 2>/dev/null || true)" == "$expected" ]]
}

start_qwen() {
  if model_matches 8000 "$qwen_served"; then
    verified_container_revision "$qwen_container" "$qwen_revision" || { log "event=model_unavailable service=qwen reason=unverified_revision"; return 1; }
    log "event=model_reused service=qwen owned=false revision=$qwen_revision"; return 0
  fi
  [[ "$gpu_busy_initial" == "0" ]] || { log "event=model_unavailable service=qwen reason=gpu_busy"; return 1; }
  if port_responds 8000; then log "event=model_unavailable service=qwen reason=incompatible_port"; return 1; fi
  docker image inspect "$image" >/dev/null 2>&1 || { log "event=model_unavailable service=qwen reason=image_missing"; return 1; }
  [[ -d "$hf_cache/hub/models--Qwen--Qwen3.6-35B-A3B-FP8/snapshots/$qwen_revision" ]] || { log "event=model_unavailable service=qwen reason=revision_missing revision=$qwen_revision"; return 1; }
  remove_owned_stale_container "$qwen_container" || { log "event=model_unavailable service=qwen reason=foreign_container"; return 1; }
  log "event=model_start service=qwen"
  docker run -d --name "$qwen_container" --label aiharu.scheduler=true --label "aiharu.revision=$qwen_revision" --gpus all --ipc=host --shm-size=32g \
    -p 127.0.0.1:8000:8000 -v "$hf_cache:/root/.cache/huggingface" \
    -e HF_HOME=/root/.cache/huggingface -e HF_HUB_OFFLINE=1 -e TRANSFORMERS_OFFLINE=1 \
    "$image" vllm serve "$qwen_model" --revision "$qwen_revision" --host 0.0.0.0 --port 8000 \
    --served-model-name "$qwen_served" --max-model-len 8192 --gpu-memory-utilization 0.72 \
    --enable-prefix-caching --trust-remote-code --language-model-only --reasoning-parser qwen3 >/dev/null
  owns_qwen=1
  wait_for_model 8000 "$qwen_served" || { log "event=model_unavailable service=qwen reason=start_timeout"; return 1; }
  log "event=model_ready service=qwen owned=true"
}

start_bge() {
  if model_matches 8001 "$bge_model"; then
    verified_container_revision "$bge_container" "$bge_revision" || { log "event=model_unavailable service=bge-m3 reason=unverified_revision"; return 1; }
    log "event=model_reused service=bge-m3 owned=false revision=$bge_revision"; return 0
  fi
  [[ "$gpu_busy_initial" == "0" ]] || { log "event=model_unavailable service=bge-m3 reason=gpu_busy"; return 1; }
  if port_responds 8001; then log "event=model_unavailable service=bge-m3 reason=incompatible_port"; return 1; fi
  docker image inspect "$image" >/dev/null 2>&1 || { log "event=model_unavailable service=bge-m3 reason=image_missing"; return 1; }
  [[ -d "$hf_cache/hub/models--BAAI--bge-m3/snapshots/$bge_revision" ]] || { log "event=model_unavailable service=bge-m3 reason=revision_missing revision=$bge_revision"; return 1; }
  remove_owned_stale_container "$bge_container" || { log "event=model_unavailable service=bge-m3 reason=foreign_container"; return 1; }
  log "event=model_start service=bge-m3"
  docker run -d --name "$bge_container" --label aiharu.scheduler=true --label "aiharu.revision=$bge_revision" --gpus all --ipc=host --shm-size=8g \
    -p 127.0.0.1:8001:8000 -v "$hf_cache:/root/.cache/huggingface" \
    -e HF_HOME=/root/.cache/huggingface -e HF_HUB_OFFLINE=1 -e TRANSFORMERS_OFFLINE=1 \
    "$image" vllm serve "$bge_model" --revision "$bge_revision" --runner pooling --host 0.0.0.0 --port 8000 \
    --served-model-name "$bge_model" --max-model-len 8192 --gpu-memory-utilization 0.08 \
    --trust-remote-code >/dev/null
  owns_bge=1
  wait_for_model 8001 "$bge_model" || { log "event=model_unavailable service=bge-m3 reason=start_timeout"; return 1; }
  curl --silent --fail --max-time 30 "http://127.0.0.1:8001/v1/embeddings" \
    --header "Content-Type: application/json" \
    --data "{\"model\":\"$bge_model\",\"input\":\"health check\"}" >/dev/null || return 1
  log "event=model_ready service=bge-m3 owned=true"
}

gpu_busy_initial=0
nvidia-smi --query-compute-apps=pid --format=csv,noheader 2>/dev/null | grep -Eq '[0-9]' && gpu_busy_initial=1 || true
qwen_ready=0
bge_ready=0
start_qwen && qwen_ready=1 || true
if [[ "$operation" == "generate-daily-prompt" ]]; then start_bge && bge_ready=1 || true; fi

if [[ "$operation" == "generate-daily-prompt" ]]; then
  features="daily-prompt,embedding"
else
  features="news-classification,news-summary"
fi
preflight_errors=()
[[ "$qwen_ready" == "1" ]] || preflight_errors+=("qwen_unavailable")
if [[ "$operation" == "generate-daily-prompt" && "$bge_ready" != "1" ]]; then
  preflight_errors+=("bge_unavailable")
fi
export LOCAL_AI_FEATURES="$features"
export LOCAL_AI_REQUIRE_LOCAL=true
export LOCAL_SCHEDULE_PREFLIGHT_ERROR="$(IFS=,; echo "${preflight_errors[*]}")"
export LOCAL_LLM_BASE_URL="http://127.0.0.1:8000/v1"
export LOCAL_LLM_MODEL="$qwen_served"
export LOCAL_EMBEDDING_BASE_URL="http://127.0.0.1:8001/v1"
export LOCAL_EMBEDDING_MODEL="$bge_model"
export LOCAL_EMBEDDING_DUAL_WRITE="${LOCAL_EMBEDDING_DUAL_WRITE:-true}"
export LOCAL_LLM_CHECKSUM="$qwen_revision"
export LOCAL_EMBEDDING_CHECKSUM="$bge_revision"
export NEXT_PUBLIC_SITE_URL="http://127.0.0.1:3100"
export AIHARU_URL="http://127.0.0.1:3100"

[[ -f "$project_dir/.next/BUILD_ID" ]] || { log "event=preflight_failed reason=next_build_missing"; exit 69; }
if port_responds 3100; then log "event=preflight_failed reason=worker_port_busy"; exit 69; fi
log "event=worker_start port=3100 features=${features:-openai-only}"
(cd "$project_dir" && exec ./node_modules/.bin/next start --hostname 127.0.0.1 --port 3100) >"$worker_log" 2>&1 &
worker_pid=$!
worker_deadline=$((SECONDS + 120))
until curl --silent --fail --max-time 2 http://127.0.0.1:3100/api/health >/dev/null 2>&1; do
  kill -0 "$worker_pid" 2>/dev/null || { log "event=worker_failed reason=exited"; exit 70; }
  (( SECONDS >= worker_deadline )) && { log "event=worker_failed reason=start_timeout"; exit 70; }
  sleep 2
done

log "event=api_call path=/api/$operation"
korea_date="$(TZ=Asia/Seoul date +%F)"
if [[ "$operation" == "generate-daily-prompt" ]]; then
  target_at="${korea_date}T09:00:00+09:00"
  scheduled_for="${korea_date}T08:30:00+09:00"
else
  target_at="${korea_date}T13:00:00+09:00"
  scheduled_for="${korea_date}T12:30:00+09:00"
fi
http_code="$(curl --silent --show-error --max-time 1500 --request POST \
  --header "Authorization: Bearer $INTERNAL_API_SECRET" \
  --header "X-AIHaru-Executor: local" \
  --header "X-AIHaru-Target-At: $target_at" \
  --header "X-AIHaru-Scheduled-For: $scheduled_for" \
  --output "$response_file" --write-out '%{http_code}' \
  "http://127.0.0.1:3100/api/$operation")"
api_run_id="$(node -e 'const fs=require("fs");try{const j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));process.stdout.write(j.runId||"")}catch{}' "$response_file")"
[[ "$http_code" =~ ^2 ]] || { log "event=api_failed http_code=$http_code run_id=${api_run_id:-unknown}"; exit 22; }
node -e 'const fs=require("fs");const j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));if(j.success!==true)process.exit(1)' "$response_file"
already_processed="$(node -e 'const fs=require("fs");const j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));process.stdout.write(j.alreadyProcessed===true?"1":"0")' "$response_file")"

fallback_count="$(node -e 'const fs=require("fs");const p=process.argv[1];if(!fs.existsSync(p)){console.log(0);process.exit()}const rows=fs.readFileSync(p,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);console.log(rows.filter(x=>x.fallbackReason).length)' "$AI_PROVIDER_AUDIT_FILE")"
if [[ "$already_processed" == "1" ]]; then
  result_status="skipped_already_processed"
elif [[ "$fallback_count" -gt 0 ]]; then
  log "event=policy_violation reason=unexpected_in_process_fallback count=$fallback_count"
  exit 70
else
  result_status="completed"
fi
log "event=api_completed status=$result_status fallback_count=$fallback_count"
