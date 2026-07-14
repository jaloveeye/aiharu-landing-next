#!/usr/bin/env bash
set -Eeuo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
node "$project_dir/scripts/check-shadow-readiness.mjs"
command -v gh >/dev/null || { echo "gh CLI is required" >&2; exit 69; }
gh variable set EXTERNAL_FALLBACK_ENABLED --body false
echo "Seven-day gate passed; scheduled external fallback is disabled. Manual workflow dispatch remains available."
