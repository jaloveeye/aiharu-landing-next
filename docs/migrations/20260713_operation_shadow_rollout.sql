alter table public.operation_runs
  add column if not exists executor text not null default 'manual'
    check (executor in ('local', 'external-fallback', 'manual')),
  add column if not exists scheduled_for timestamptz,
  add column if not exists target_at timestamptz,
  add column if not exists published_at timestamptz,
  add column if not exists duration_ms bigint,
  add column if not exists models jsonb not null default '[]'::jsonb,
  add column if not exists moderation_result jsonb not null default '{}'::jsonb,
  add column if not exists retry_count integer not null default 0,
  add column if not exists fallback_count integer not null default 0,
  add column if not exists failure_notified_at timestamptz,
  add column if not exists lease_token uuid,
  add column if not exists lease_expires_at timestamptz;

create index if not exists operation_runs_shadow_readiness_idx
  on public.operation_runs (operation, run_date desc, executor, status);
