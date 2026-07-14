#!/usr/bin/env bash
set -Eeuo pipefail

image="${VLLM_IMAGE:-nvcr.io/nvidia/vllm:26.05.post1-py3}"
hf_cache="${HF_CACHE_DIR:-$HOME/.cache/huggingface}"
qwen_revision="${QWEN_HF_REVISION:-95a723d08a9490559dae23d0cff1d9466213d989}"
bge_revision="${BGE_HF_REVISION:-5617a9f61b028005a4858fdac845db406aefb181}"
mkdir -p "$hf_cache"

docker image inspect "$image" >/dev/null 2>&1 || docker pull "$image"
docker run --rm -v "$hf_cache:/root/.cache/huggingface" \
  -e HF_HOME=/root/.cache/huggingface \
  -e QWEN_HF_REVISION="$qwen_revision" -e BGE_HF_REVISION="$bge_revision" \
  "$image" python -c 'import os; from huggingface_hub import snapshot_download; snapshot_download("Qwen/Qwen3.6-35B-A3B-FP8", revision=os.environ["QWEN_HF_REVISION"]); snapshot_download("BAAI/bge-m3", revision=os.environ["BGE_HF_REVISION"])'

echo "Local AI assets are ready in $hf_cache"
