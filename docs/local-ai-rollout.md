# Local AI rollout

All local features are off by default. Interactive application features keep the existing OpenAI path and automatically fall back when the local endpoint times out, errors, returns an empty response, or fails a feature validator. Scheduled local workers set `LOCAL_AI_REQUIRE_LOCAL=true`; they fail the operation instead so the delayed GitHub Actions workflow is the only generation fallback.

## Services

The language endpoint defaults to `http://127.0.0.1:8000/v1` and model name `qwen3.6-35b-a3b`. Do not restart or reconfigure an occupied vLLM process. After the current language-only test is complete, start the same cached Qwen model without `--language-model-only` to evaluate `meal-vision`; do not load a second copy of the large model.

Run BGE-M3 independently on port 8001 with an OpenAI-compatible embeddings server. It produces 1024-dimensional vectors. Apply `docs/migrations/20260713_prompt_embeddings_v2.sql` before enabling the `embedding` feature.

Enable one stage at a time with `LOCAL_AI_FEATURES`:

1. `news-classification`
2. `news-summary`
3. `daily-prompt`
4. `developer-answer`
5. `meal-text`
6. `embedding`
7. `meal-vision`

Multiple approved stages use a comma-separated value. Rollback is immediate: remove the feature name and restart the Next.js process. The OpenAI key remains required for fallback. Local requests use a 60-second timeout and one SDK retry.

## Evaluation gate

Create a fixed JSONL file with exactly 30 cases per feature. Each line has `id` and an OpenAI-compatible `messages` array. Keep fixtures free of personal information. Run comparisons only after the separate vLLM test has finished:

```bash
node scripts/evaluate-local-ai.mjs news-summary data/ai-evaluation/news-summary.jsonl > /tmp/news-summary-report.json
node scripts/evaluate-local-embeddings.mjs data/ai-evaluation/embedding-retrieval.jsonl > /tmp/embedding-report.json
```

Promotion requires local format validity of at least 95%, blind human preference/acceptability of at least 80%, and local p95 latency no greater than 30 seconds. The report calculates format and latency gates; two reviewers should score randomized outputs without provider labels for the quality gate.

For embeddings, `LOCAL_EMBEDDING_DUAL_WRITE=true` stores BGE-M3 in `embedding_v2` and the OpenAI shadow vector in the existing `embedding` column. Compare retrieval on the same 30 queries before setting dual write to false. Logs contain only feature, provider, model, duration, and fallback reason—not prompts or outputs.
