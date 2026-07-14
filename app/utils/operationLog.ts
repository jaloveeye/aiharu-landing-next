type OperationLog = {
  event: "started" | "completed" | "failed";
  operation: string;
  runId: string;
  processed?: number;
  durationMs?: number;
  errorCode?: string;
};

export function logOperation(entry: OperationLog): void {
  const payload = { scope: "scheduled-operation", ...entry };
  if (entry.event === "failed") {
    console.error(payload);
  } else {
    console.log(payload);
  }
}
