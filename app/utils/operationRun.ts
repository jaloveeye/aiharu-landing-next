import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/app/utils/supabase/admin";

export type OperationName = "generate-daily-prompt" | "collect-ai-news";

export type OperationLease = {
  runId: string;
  alreadyProcessed: boolean;
};

function koreaDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function acquireOperation(operation: OperationName): Promise<OperationLease> {
  const supabase = createAdminClient();
  const runId = randomUUID();
  const runDate = koreaDate();
  const { error } = await supabase.from("operation_runs").insert({
    id: runId,
    operation,
    run_date: runDate,
    status: "running",
    started_at: new Date().toISOString(),
  });

  if (!error) return { runId, alreadyProcessed: false };
  if (error.code !== "23505") throw error;

  const { data, error: readError } = await supabase
    .from("operation_runs")
    .select("id, status")
    .eq("operation", operation)
    .eq("run_date", runDate)
    .single();
  if (readError) throw readError;
  if (data.status !== "failed") {
    return { runId: data.id, alreadyProcessed: true };
  }

  const { data: restarted, error: restartError } = await supabase
    .from("operation_runs")
    .update({
      status: "running",
      processed: 0,
      started_at: new Date().toISOString(),
      finished_at: null,
    })
    .eq("id", data.id)
    .eq("status", "failed")
    .select("id")
    .maybeSingle();
  if (restartError) throw restartError;
  return { runId: data.id, alreadyProcessed: !restarted };
}

export async function finishOperation(
  runId: string,
  status: "completed" | "failed",
  processed: number,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("operation_runs")
    .update({ status, processed, finished_at: new Date().toISOString() })
    .eq("id", runId);
  if (error) throw error;
}
