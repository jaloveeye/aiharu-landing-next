CREATE TABLE IF NOT EXISTS operation_runs (
  id UUID PRIMARY KEY,
  operation TEXT NOT NULL,
  run_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  processed INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  UNIQUE (operation, run_date)
);

ALTER TABLE operation_runs ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policy: only the service-role operations client may access it.
