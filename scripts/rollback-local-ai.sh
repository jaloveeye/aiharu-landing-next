#!/usr/bin/env bash
set -Eeuo pipefail

systemctl --user disable --now aiharu-daily-prompt.timer aiharu-collect-news.timer
command -v gh >/dev/null || { echo "gh CLI is required to restore external fallback" >&2; exit 69; }
gh variable set EXTERNAL_FALLBACK_ENABLED --body true
echo "Local timers are disabled and scheduled external fallback is restored."
