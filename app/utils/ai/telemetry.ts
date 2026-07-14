import { AsyncLocalStorage } from "node:async_hooks";

export type AiCallTelemetry = {
  feature: string;
  provider: "local" | "openai";
  model: string;
  checksum: string;
  durationMs: number;
  retryCount: number;
  fallbackReason?: string;
};

type TelemetryStore = { calls: AiCallTelemetry[] };

const storage = new AsyncLocalStorage<TelemetryStore>();

export async function withAiTelemetry<T>(work: () => Promise<T>): Promise<{
  value: T;
  calls: AiCallTelemetry[];
}> {
  const store: TelemetryStore = { calls: [] };
  const value = await storage.run(store, work);
  return { value, calls: store.calls };
}

export function recordAiCall(call: AiCallTelemetry): void {
  storage.getStore()?.calls.push(call);
}

export function summarizeAiCalls(calls: AiCallTelemetry[]) {
  const models = Array.from(
    new Map(
      calls.map((call) => [
        `${call.provider}:${call.model}:${call.checksum}`,
        { provider: call.provider, model: call.model, checksum: call.checksum },
      ]),
    ).values(),
  );
  return {
    models,
    retryCount: calls.reduce((total, call) => total + call.retryCount, 0),
    fallbackCount: calls.filter((call) => call.fallbackReason).length,
  };
}
