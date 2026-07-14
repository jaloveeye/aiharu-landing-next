CREATE TABLE IF NOT EXISTS api_rate_limits (
  client_key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  window_date DATE NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Seoul')::date,
  request_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (client_key, endpoint, window_date)
);
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION consume_api_rate_limit(
  p_client_key TEXT,
  p_endpoint TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_count INTEGER;
BEGIN
  INSERT INTO api_rate_limits (client_key, endpoint, request_count)
  VALUES (p_client_key, p_endpoint, 1)
  ON CONFLICT (client_key, endpoint, window_date)
  DO UPDATE SET request_count = api_rate_limits.request_count + 1
  RETURNING request_count INTO next_count;
  RETURN next_count <= p_limit;
END;
$$;
REVOKE ALL ON FUNCTION consume_api_rate_limit(TEXT, TEXT, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION consume_api_rate_limit(TEXT, TEXT, INTEGER) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION consume_api_rate_limit(TEXT, TEXT, INTEGER) TO service_role;
