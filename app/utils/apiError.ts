import { NextResponse } from "next/server";

type ApiErrorPayload = {
  error: unknown;
  userMessage?: string;
  status?: number;
  log?: boolean;
};

function resolveErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : JSON.stringify(error);
  }

  return "Unknown error";
}

/**
 * 개발자 콘솔에는 상세 로그, 사용자에겐 친절한 메시지 반환
 */
export function apiError({
  error,
  userMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  status = 500,
  log = true,
}: ApiErrorPayload) {
  if (log) {
    // 개발자용 상세 로그
    console.error("[API Error]", error);
  }
  return NextResponse.json(
    {
      error: userMessage,
      detail: process.env.NODE_ENV === "development" ? resolveErrorMessage(error) : undefined,
    },
    { status }
  );
}
