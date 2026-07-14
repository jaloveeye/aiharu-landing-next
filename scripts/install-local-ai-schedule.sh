#!/usr/bin/env bash
set -Eeuo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
unit_dir="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
env_file="${XDG_CONFIG_HOME:-$HOME/.config}/aiharu/scheduled.env"

[[ -f "$env_file" ]] || { echo "missing $env_file (copy env.example and keep only server secrets/settings)" >&2; exit 66; }
[[ "$(stat -c '%a' "$env_file")" == "600" ]] || { echo "$env_file must have mode 600" >&2; exit 77; }
[[ -f "$project_dir/.next/BUILD_ID" ]] || { echo "run npm run build before installing timers" >&2; exit 69; }
[[ -d "$HOME/.cache/huggingface/hub/models--BAAI--bge-m3" ]] || { echo "BGE-M3 cache missing; run scripts/prepare-local-ai-assets.sh" >&2; exit 69; }

mkdir -p "$unit_dir"
for file in "$project_dir"/ops/systemd/*; do
  sed "s|@@PROJECT_DIR@@|$project_dir|g; s|@@ENV_FILE@@|$env_file|g" "$file" >"$unit_dir/$(basename "$file")"
done
systemctl --user daemon-reload
systemctl --user enable --now aiharu-daily-prompt.timer aiharu-collect-news.timer
systemctl --user list-timers 'aiharu-*'
