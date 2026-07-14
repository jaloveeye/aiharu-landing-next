import OpenAI from "openai";
import { appendFileSync } from "node:fs";
import { recordAiCall } from "./telemetry";

export type AiFeature =
  | "news-classification"
  | "news-summary"
  | "daily-prompt"
  | "developer-answer"
  | "meal-text"
  | "meal-vision"
  | "embedding";

export type AiProviderName = "local" | "openai";

export interface TextGenerationResult {
  content: string;
  provider: AiProviderName;
  model: string;
  durationMs: number;
  tokensUsed: number;
  fallbackReason?: string;
}

export interface EmbeddingGeneration {
  embedding: number[];
  provider: AiProviderName;
  model: string;
  dimensions: number;
  version: string;
}

export interface EmbeddingGenerationResult {
  primary: EmbeddingGeneration;
  shadow?: EmbeddingGeneration;
  durationMs: number;
  fallbackReason?: string;
}

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type Client = {
  chat: { completions: { create: (input: unknown) => Promise<{ choices: Array<{ message?: { content?: string | null } }>; usage?: { total_tokens?: number } }> } };
  embeddings: { create: (input: unknown) => Promise<{ data: Array<{ embedding?: number[] }> }> };
};

interface ProviderEnvironment {
  [key: string]: string | undefined;
  OPENAI_API_KEY?: string;
  LOCAL_AI_FEATURES?: string;
  LOCAL_LLM_BASE_URL?: string;
  LOCAL_LLM_API_KEY?: string;
  LOCAL_LLM_MODEL?: string;
  LOCAL_EMBEDDING_BASE_URL?: string;
  LOCAL_EMBEDDING_API_KEY?: string;
  LOCAL_EMBEDDING_MODEL?: string;
  LOCAL_EMBEDDING_DUAL_WRITE?: string;
  LOCAL_AI_REQUIRE_LOCAL?: string;
  AI_PROVIDER_AUDIT_FILE?: string;
  LOCAL_LLM_CHECKSUM?: string;
  LOCAL_EMBEDDING_CHECKSUM?: string;
}

interface ProviderDependencies {
  env?: ProviderEnvironment;
  createClient?: (options: ConstructorParameters<typeof OpenAI>[0]) => Client;
  now?: () => number;
}

export interface GenerateTextOptions {
  feature: Exclude<AiFeature, "embedding">;
  messages: ChatMessage[];
  openAIModel: string;
  maxTokens?: number;
  temperature?: number;
  validate?: (content: string) => boolean;
}

const DEFAULT_LOCAL_LLM_URL = "http://127.0.0.1:8000/v1";
const DEFAULT_LOCAL_EMBEDDING_URL = "http://127.0.0.1:8001/v1";
const DEFAULT_LOCAL_LLM_MODEL = "qwen3.6-35b-a3b";
const DEFAULT_LOCAL_EMBEDDING_MODEL = "BAAI/bge-m3";

export class LocalAiRequiredError extends Error {
  readonly feature: AiFeature;

  constructor(feature: AiFeature, reason: string, options?: ErrorOptions) {
    super(`Local AI is required for ${feature}: ${reason}`, options);
    this.name = "LocalAiRequiredError";
    this.feature = feature;
  }
}

export function isLocalAiRequired(
  env: ProviderEnvironment = process.env,
): boolean {
  return env.LOCAL_AI_REQUIRE_LOCAL === "true";
}

export function isLocalAiRequiredError(error: unknown): error is LocalAiRequiredError {
  return error instanceof LocalAiRequiredError;
}

export function parseLocalAiFeatures(value?: string): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((feature) => feature.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isLocalAiFeatureEnabled(
  feature: AiFeature,
  env: ProviderEnvironment = process.env,
): boolean {
  return parseLocalAiFeatures(env.LOCAL_AI_FEATURES).has(feature);
}

function defaultCreateClient(options: ConstructorParameters<typeof OpenAI>[0]): Client {
  return new OpenAI(options) as unknown as Client;
}

function cloudClient(env: ProviderEnvironment, createClient: ProviderDependencies["createClient"]): Client {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required");
  return (createClient ?? defaultCreateClient)({
    apiKey: env.OPENAI_API_KEY,
    timeout: 60_000,
    maxRetries: 2,
  });
}

function localClient(
  baseURL: string,
  apiKey: string | undefined,
  createClient: ProviderDependencies["createClient"],
): Client {
  return (createClient ?? defaultCreateClient)({
    apiKey: apiKey || "local",
    baseURL,
    timeout: 60_000,
    maxRetries: 1,
  });
}

function fallbackReason(error: unknown): string {
  if (error instanceof Error) return error.name || "Error";
  return "UnknownError";
}

function logCompletion(data: Record<string, string | number | undefined>) {
  console.info("[ai-provider]", data);
  const auditFile = process.env.AI_PROVIDER_AUDIT_FILE;
  if (!auditFile) return;
  try {
    appendFileSync(auditFile, `${JSON.stringify({ at: new Date().toISOString(), ...data })}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch (error) {
    console.warn("[ai-provider] audit write failed", {
      errorCode: error instanceof Error ? error.name : "UnknownError",
    });
  }
}

function checksumFor(provider: AiProviderName, feature: AiFeature, env: ProviderEnvironment): string {
  if (provider === "openai") return "provider-managed";
  return feature === "embedding"
    ? env.LOCAL_EMBEDDING_CHECKSUM || "unknown"
    : env.LOCAL_LLM_CHECKSUM || "unknown";
}

function recordCompletion(
  feature: AiFeature,
  result: { provider: AiProviderName; model: string; durationMs: number; fallbackReason?: string },
  env: ProviderEnvironment,
) {
  const checksum = checksumFor(result.provider, feature, env);
  const data = {
    feature,
    provider: result.provider,
    model: result.model,
    checksum,
    durationMs: result.durationMs,
    fallbackReason: result.fallbackReason,
  };
  logCompletion(data);
  recordAiCall({ ...data, retryCount: result.fallbackReason ? 1 : 0 });
}

async function requestText(
  client: Client,
  model: string,
  options: GenerateTextOptions,
  local = false,
): Promise<{ content: string; tokensUsed: number }> {
  const completion = await client.chat.completions.create({
    model,
    messages: options.messages,
    max_tokens: options.maxTokens,
    temperature: options.temperature,
    ...(local
      ? {
          extra_body: {
            top_k: 20,
            chat_template_kwargs: { enable_thinking: false },
          },
        }
      : {}),
  });
  const content = completion.choices[0]?.message?.content?.trim() ?? "";
  if (!content) throw new Error("EmptyModelResponse");
  if (options.validate && !options.validate(content)) throw new Error("InvalidModelResponse");
  return { content, tokensUsed: completion.usage?.total_tokens || 0 };
}

export async function generateText(
  options: GenerateTextOptions,
  dependencies: ProviderDependencies = {},
): Promise<TextGenerationResult> {
  const env = dependencies.env ?? process.env;
  const now = dependencies.now ?? Date.now;
  const startedAt = now();
  let reason: string | undefined;

  if (isLocalAiFeatureEnabled(options.feature, env)) {
    const model = env.LOCAL_LLM_MODEL || DEFAULT_LOCAL_LLM_MODEL;
    try {
      const generated = await requestText(
        localClient(
          env.LOCAL_LLM_BASE_URL || DEFAULT_LOCAL_LLM_URL,
          env.LOCAL_LLM_API_KEY,
          dependencies.createClient,
        ),
        model,
        options,
        true,
      );
      const result = { ...generated, provider: "local" as const, model, durationMs: now() - startedAt };
      recordCompletion(options.feature, result, env);
      return result;
    } catch (error) {
      reason = fallbackReason(error);
      if (isLocalAiRequired(env)) {
        throw new LocalAiRequiredError(options.feature, reason, { cause: error });
      }
    }
  } else if (isLocalAiRequired(env)) {
    throw new LocalAiRequiredError(options.feature, "LocalFeatureDisabled");
  }

  const generated = await requestText(cloudClient(env, dependencies.createClient), options.openAIModel, options);
  const result = {
    ...generated,
    provider: "openai" as const,
    model: options.openAIModel,
    durationMs: now() - startedAt,
    fallbackReason: reason,
  };
  recordCompletion(options.feature, result, env);
  return result;
}

async function requestEmbedding(client: Client, model: string, input: string): Promise<number[]> {
  const response = await client.embeddings.create({ model, input });
  const embedding = response.data[0]?.embedding;
  if (!embedding?.length) throw new Error("EmptyEmbeddingResponse");
  return embedding;
}

export async function generateEmbedding(
  input: string,
  dependencies: ProviderDependencies = {},
): Promise<EmbeddingGenerationResult> {
  const env = dependencies.env ?? process.env;
  const now = dependencies.now ?? Date.now;
  const startedAt = now();
  const useLocal = isLocalAiFeatureEnabled("embedding", env);
  let reason: string | undefined;

  if (useLocal) {
    const model = env.LOCAL_EMBEDDING_MODEL || DEFAULT_LOCAL_EMBEDDING_MODEL;
    try {
      const embedding = await requestEmbedding(
        localClient(
          env.LOCAL_EMBEDDING_BASE_URL || DEFAULT_LOCAL_EMBEDDING_URL,
          env.LOCAL_EMBEDDING_API_KEY,
          dependencies.createClient,
        ),
        model,
        input,
      );
      const primary: EmbeddingGeneration = {
        embedding,
        provider: "local",
        model,
        dimensions: embedding.length,
        version: "v2",
      };
      let shadow: EmbeddingGeneration | undefined;
      if (env.LOCAL_EMBEDDING_DUAL_WRITE !== "false") {
        const cloudModel = "text-embedding-3-small";
        const cloudEmbedding = await requestEmbedding(cloudClient(env, dependencies.createClient), cloudModel, input);
        shadow = {
          embedding: cloudEmbedding,
          provider: "openai",
          model: cloudModel,
          dimensions: cloudEmbedding.length,
          version: "v1",
        };
      }
      const result = { primary, shadow, durationMs: now() - startedAt };
      recordCompletion("embedding", { ...primary, durationMs: result.durationMs }, env);
      if (shadow) recordCompletion("embedding", { ...shadow, durationMs: result.durationMs }, env);
      return result;
    } catch (error) {
      reason = fallbackReason(error);
      if (isLocalAiRequired(env)) {
        throw new LocalAiRequiredError("embedding", reason, { cause: error });
      }
    }
  } else if (isLocalAiRequired(env)) {
    throw new LocalAiRequiredError("embedding", "LocalFeatureDisabled");
  }

  const model = "text-embedding-3-small";
  const embedding = await requestEmbedding(cloudClient(env, dependencies.createClient), model, input);
  const result: EmbeddingGenerationResult = {
    primary: {
      embedding,
      provider: "openai",
      model,
      dimensions: embedding.length,
      version: "v1",
    },
    durationMs: now() - startedAt,
    fallbackReason: reason,
  };
  recordCompletion("embedding", { ...result.primary, durationMs: result.durationMs, fallbackReason: reason }, env);
  return result;
}
