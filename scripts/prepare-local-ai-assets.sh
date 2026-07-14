#!/usr/bin/env bash
set -Eeuo pipefail

image="${VLLM_IMAGE:-nvcr.io/nvidia/vllm:26.05.post1-py3}"
hf_cache="${HF_CACHE_DIR:-$HOME/.cache/huggingface}"
mkdir -p "$hf_cache"

docker image inspect "$image" >/dev/null 2>&1 || docker pull "$image"
docker run --rm -v "$hf_cache:/root/.cache/huggingface" \
  -e HF_HOME=/root/.cache/huggingface \
  "$image" python -c 'from huggingface_hub import snapshot_download; snapshot_download("Qwen/Qwen3.6-35B-A3B-FP8"); snapshot_download("BAAI/bge-m3")'

echo "Local AI assets are ready in $hf_cache"
