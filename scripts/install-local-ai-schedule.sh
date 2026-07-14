#!/usr/bin/env bash
set -Eeuo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
unit_dir="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
env_file="${XDG_CONFIG_HOME:-$HOME/.config}/aiharu/scheduled.env"

env_value() {
  sed -n "s/^$1=//p" "$env_file" | tail -1
}

is_placeholder() {
  local value="$1"
  [[ "$value" == your_* || "$value" == *"<"* || "$value" == *">"* || "$value" == "changeme" ]]
}

[[ -f "$env_file" ]] || { echo "missing $env_file (copy env.example and keep only server secrets/settings)" >&2; exit 66; }
[[ "$(stat -c '%a' "$env_file")" == "600" ]] || { echo "$env_file must have mode 600" >&2; exit 77; }
for key in AIHARU_PROJECT_DIR INTERNAL_API_SECRET OPENAI_API_KEY NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY QWEN_HF_REVISION BGE_HF_REVISION AIHARU_ALERT_WEBHOOK_URL; do
  value="$(env_value "$key")"
  [[ -n "$value" ]] || { echo "$key is required in $env_file" >&2; exit 66; }
  ! is_placeholder "$value" || { echo "$key still contains a placeholder" >&2; exit 66; }
done
news_api_key="$(env_value NEWS_API_KEY)"
gnews_api_key="$(env_value GNEWS_API_KEY)"
if [[ -z "$news_api_key" ]] || is_placeholder "$news_api_key"; then news_api_key=""; fi
if [[ -z "$gnews_api_key" ]] || is_placeholder "$gnews_api_key"; then gnews_api_key=""; fi
[[ -n "$news_api_key" || -n "$gnews_api_key" ]] || { echo "a non-placeholder NEWS_API_KEY or GNEWS_API_KEY is required" >&2; exit 66; }
configured_project="$(env_value AIHARU_PROJECT_DIR)"
[[ "$configured_project" == "$project_dir" ]] || { echo "AIHARU_PROJECT_DIR must match $project_dir" >&2; exit 66; }
internal_secret="$(env_value INTERNAL_API_SECRET)"
[[ "${#internal_secret}" -ge 32 ]] || { echo "INTERNAL_API_SECRET must be at least 32 characters" >&2; exit 66; }
qwen_revision="$(env_value QWEN_HF_REVISION)"
bge_revision="$(env_value BGE_HF_REVISION)"
[[ "$qwen_revision" =~ ^[0-9a-f]{40}$ && "$bge_revision" =~ ^[0-9a-f]{40}$ ]] || { echo "model revisions must be 40-character commit hashes" >&2; exit 66; }
hf_cache="$(env_value HF_CACHE_DIR)"
hf_cache="${hf_cache:-$HOME/.cache/huggingface}"
[[ -f "$project_dir/.next/BUILD_ID" ]] || { echo "run npm run build before installing timers" >&2; exit 69; }
[[ -d "$hf_cache/hub/models--Qwen--Qwen3.6-35B-A3B-FP8/snapshots/$qwen_revision" ]] || { echo "pinned Qwen revision missing; run scripts/prepare-local-ai-assets.sh" >&2; exit 69; }
[[ -d "$hf_cache/hub/models--BAAI--bge-m3/snapshots/$bge_revision" ]] || { echo "pinned BGE-M3 revision missing; run scripts/prepare-local-ai-assets.sh" >&2; exit 69; }
for command in docker nvidia-smi systemctl systemd-analyze loginctl; do
  command -v "$command" >/dev/null || { echo "missing required command: $command" >&2; exit 69; }
done
docker info >/dev/null 2>&1 || { echo "Docker daemon is unavailable" >&2; exit 69; }
nvidia-smi -L >/dev/null 2>&1 || { echo "NVIDIA GPU is unavailable" >&2; exit 69; }
free_disk_gb="$(df -Pk "$hf_cache" | awk 'NR==2 {print int($4/1024/1024)}')"
[[ "$free_disk_gb" -ge 80 ]] || { echo "at least 80 GiB free disk is required" >&2; exit 69; }
[[ "$(loginctl show-user "$USER" -p Linger --value)" == "yes" ]] || { echo "enable user linger before installing timers" >&2; exit 69; }

mkdir -p "$unit_dir"
for file in "$project_dir"/ops/systemd/*; do
  sed "s|@@PROJECT_DIR@@|$project_dir|g; s|@@ENV_FILE@@|$env_file|g" "$file" >"$unit_dir/$(basename "$file")"
done
systemd-analyze --user verify "/aiharu-daily-prompt.service" "/aiharu-daily-prompt.timer" "/aiharu-collect-news.service" "/aiharu-collect-news.timer"
systemctl --user daemon-reload
systemctl --user enable --now aiharu-daily-prompt.timer aiharu-collect-news.timer
systemctl --user list-timers 'aiharu-*'
