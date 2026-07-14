-- Parallel BGE-M3 rollout. Keep the 1536-dimensional legacy column intact.
alter table public.prompt_results
  add column if not exists embedding_v2 vector(1024),
  add column if not exists embedding_model text,
  add column if not exists embedding_version text default 'v1';

create index if not exists prompt_results_embedding_v2_hnsw_idx
  on public.prompt_results
  using hnsw (embedding_v2 vector_cosine_ops);

comment on column public.prompt_results.embedding_v2 is
  'BGE-M3 1024-dimensional embedding used during local AI v2 rollout';
