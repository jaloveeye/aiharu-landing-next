import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { createAdminClient } from "./supabase/admin";

export type OperationName = "generate-daily-prompt" | "collect-ai-news";
export type OperationExecutor = "local" | "external-fallback" | "manual";

export type OperationContext = {
  executor: OperationExecutor;
  scheduledFor?: string;
  targetAt?: string;
};

export type OperationLease = {
  runId: string;
  leaseToken: string;
  alreadyProcessed: boolean;
};

export type OperationCompletion = {
  models: Array<{ provider: string; model: string; checksum: string }>;
  moderationResult: Record<string, unknown>;
  retryCount: number;
  fallbackCount: number;
  durationMs: number;
};

function koreaDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function validIsoDate(value: string | null): string | undefined {
  if (!value || Number.isNaN(Date.parse(value))) return undefined;
  return new Date(value).toISOString();
}

export function operationContextFromRequest(request: NextRequest): OperationContext {
  const executorHeader = request.headers.get("x-aiharu-executor");
  const executor: OperationExecutor =
    executorHeader === "local" || executorHeader === "external-fallback"
      ? executorHeader
      : "manual";
  return {
    executor,
    scheduledFor: validIsoDate(request.headers.get("x-aiharu-scheduled-for")),
    targetAt: validIsoDate(request.headers.get("x-aiharu-target-at")),
  };
}

export async function acquireOperation(
  operation: OperationName,
  context: OperationContext,
): Promise<OperationLease> {
  const supabase = createAdminClient();
  const runId = randomUUID();
  const leaseToken = randomUUID();
  const runDate = koreaDate();
  const now = new Date();
  const leaseExpiresAt = new Date(now.getTime() + 55 * 60 * 1000).toISOString();
  const values = {
    id: runId,
    operation,
    run_date: runDate,
    status: "running",
    started_at: now.toISOString(),
    executor: context.executor,
    scheduled_for: context.scheduledFor,
    target_at: context.targetAt,
    lease_token: leaseToken,
    lease_expires_at: leaseExpiresAt,
  };
  const { error } = await supabase.from("operation_runs").insert(values);

  if (!error) return { runId, leaseToken, alreadyProcessed: false };
  if (error.code !== "23505") throw error;

  const { data, error: readError } = await supabase
    .from("operation_runs")
    .select("id, status, lease_token, lease_expires_at")
    .eq("operation", operation)
    .eq("run_date", runDate)
    .single();
  if (readError) throw readError;
  if (data.status === "completed") {
    return { runId: data.id, leaseToken: "", alreadyProcessed: true };
  }
  if (data.status === "running" && Date.parse(data.lease_expires_at || "") > now.getTime()) {
    return { runId: data.id, leaseToken: "", alreadyProcessed: true };
  }

  let restartQuery = supabase
    .from("operation_runs")
    .update({
      ...values,
      id: data.id,
      processed: 0,
      finished_at: null,
      published_at: null,
    })
    .eq("id", data.id)
    .in("status", ["failed", "running"]);
  restartQuery = data.lease_token
    ? restartQuery.eq("lease_token", data.lease_token)
    : restartQuery.is("lease_token", null);
  const { data: restarted, error: restartError } = await restartQuery
    .select("id")
    .maybeSingle();
  if (restartError) throw restartError;
  return { runId: data.id, leaseToken, alreadyProcessed: !restarted };
}

export async function finishOperation(
  lease: OperationLease,
  status: "completed" | "failed",
  processed: number,
  completion?: OperationCompletion,
): Promise<void> {
  const supabase = createAdminClient();
  const finishedAt = new Date();
  const { data, error } = await supabase
    .from("operation_runs")
    .update({
      status,
      processed,
      finished_at: finishedAt.toISOString(),
      published_at: status === "completed" ? finishedAt.toISOString() : null,
      duration_ms: completion?.durationMs ?? null,
      models: completion?.models || [],
      moderation_result: completion?.moderationResult || {},
      retry_count: completion?.retryCount || 0,
      fallback_count: completion?.fallbackCount || 0,
      lease_expires_at: null,
    })
    .eq("id", lease.runId)
    .eq("lease_token", lease.leaseToken)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("OperationLeaseLost");
}

export async function notifyOperationFailure(
  lease: OperationLease,
  operation: OperationName,
): Promise<void> {
  const webhook = process.env.AIHARU_ALERT_WEBHOOK_URL;
  if (!webhook) return;
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation, status: "failed", runId: lease.runId }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return;
    await createAdminClient()
      .from("operation_runs")
      .update({ failure_notified_at: new Date().toISOString() })
      .eq("id", lease.runId)
      .eq("lease_token", lease.leaseToken);
  } catch (error) {
    console.error("[scheduled-operation] failure notification failed", {
      operation,
      runId: lease.runId,
      errorCode: error instanceof Error ? error.name : "UnknownError",
    });
  }
}
