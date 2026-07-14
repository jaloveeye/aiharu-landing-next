import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { createAdminClient } from "@/app/utils/supabase/admin";
import { encrypt } from "@/app/utils/encryption";
import { apiError } from "@/app/utils/apiError";
import { enforceDailyLimit, readJsonBody } from "@/app/utils/requestPolicy";

type ApiHistoryGenerationRequest = {
  type?: string;
  request?: unknown;
  response?: unknown;
  success?: boolean;
  error?: unknown;
  apiKey?: string;
  anonymousId?: string;
};

type ApiGenerationHistoryInsert = {
  type: string;
  encrypted_request: string;
  encrypted_response: string;
  success: boolean;
  error_message: string | null;
  created_at: string;
  user_id?: string | null;
  anonymous_id?: string | null;
};

function toErrorString(error: unknown): string | null {
  if (error == null) return null;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

// API 생성 히스토리 저장 (인증된 사용자 및 익명 사용자 모두 저장)
// 관리자 클라이언트를 사용하여 RLS 정책을 우회하고 저장
export async function POST(request: NextRequest) {
  try {
    const limited = await enforceDailyLimit(request, "api-history-generations", 100);
    if (limited) return limited;
    // 실제 저장은 관리자 클라이언트로 수행 (RLS 우회)
    const adminSupabase = createAdminClient();

    const parsed = await readJsonBody<ApiHistoryGenerationRequest>(request, 256 * 1024);
    if (parsed.error) return parsed.error;
    const body = parsed.data!;
    const {
      type,
      request: requestData,
      response: responseData,
      success,
      error,
      apiKey,
    } = body;

    if (!type || !requestData || !responseData || !apiKey) {
      return apiError({
        error: "Missing required fields",
        userMessage: "필수 필드가 누락되었습니다.",
        status: 400,
      });
    }

    // API 키로 사용자 찾기 (api_key_history에서)
    // API 키가 발급되었다면 반드시 api_key_history에 기록이 있어야 함
    let userId: string | null = null;
    let anonymousId: string | null = null;
    let apiKeyFound = false;

    if (apiKey) {
      try {
        // api_key_history에서 모든 레코드 조회 (관리자 권한으로)
        const { data: keyHistory, error: keyError } = await adminSupabase
          .from("api_key_history")
          .select("user_id, anonymous_id, encrypted_api_key");

        if (keyError) {
          console.error("API 키 히스토리 조회 오류:", keyError);
          return apiError({
            error: keyError,
            userMessage: "API 키 히스토리 조회에 실패했습니다.",
          });
        }

        // 암호화된 API 키 복호화하여 비교
        if (keyHistory && keyHistory.length > 0) {
          const { decrypt } = await import("@/app/utils/encryption");

          for (const record of keyHistory) {
            try {
              const decryptedKey = decrypt(record.encrypted_api_key, false);
              if (decryptedKey === apiKey) {
                userId = record.user_id;
                anonymousId = record.anonymous_id;
                apiKeyFound = true;
                break;
              }
            } catch (decryptError) {
              // 복호화 실패 시 다음 레코드로 (암호화 키 불일치 가능성)
              console.warn("API 키 복호화 실패:", decryptError);
              continue;
            }
          }
        }

        if (!apiKeyFound) {
          return apiError({
            error: "Invalid API key",
            userMessage: "유효하지 않은 API 키입니다.",
            status: 401,
          });
        }
      } catch (findUserError) {
        console.error("API 키로 사용자 찾기 실패:", findUserError);
        // 에러 발생 시 클라이언트의 anonymousId 사용
        const clientAnonymousId = body.anonymousId;
        if (clientAnonymousId) {
          anonymousId = clientAnonymousId;
        } else {
          return apiError({
            error: findUserError,
            userMessage: "사용자 정보 조회 중 오류가 발생했습니다.",
            status: 500,
          });
        }
      }
    } else {
      // API 키가 없는 경우 (테스트 등) anonymousId 사용
      const clientAnonymousId = body.anonymousId;
      if (clientAnonymousId) {
        anonymousId = clientAnonymousId;
      } else {
        return apiError({
          error: "Missing anonymousId",
          userMessage: "API 키 또는 익명 사용자 ID가 필요합니다.",
          status: 400,
        });
      }
    }

    // 민감한 정보 암호화 (API 키 등)
    let encryptedRequest: string;
    let encryptedResponse: string;

    try {
      const requestString =
        typeof requestData === "string"
          ? requestData
          : JSON.stringify(requestData);
      encryptedRequest = encrypt(requestString);
    } catch (encryptError: unknown) {
      console.error("요청 데이터 암호화 오류:", encryptError);
      return apiError({
        error: encryptError,
        userMessage: "요청 데이터 암호화에 실패했습니다.",
      });
    }

    try {
      const responseString =
        typeof responseData === "string"
          ? responseData
          : JSON.stringify(responseData);
      encryptedResponse = encrypt(responseString);
    } catch (encryptError: unknown) {
      console.error("응답 데이터 암호화 오류:", encryptError);
      return apiError({
        error: encryptError,
        userMessage: "응답 데이터 암호화에 실패했습니다.",
      });
    }

    // user_id와 anonymous_id 중 하나는 반드시 있어야 함
    if (!userId && !anonymousId) {
      console.error(
        "사용자 정보가 없습니다. userId:",
        userId,
        "anonymousId:",
        anonymousId
      );
      return apiError({
        error: "Missing user identifiers",
        userMessage: "사용자 정보가 없습니다. user_id 또는 anonymous_id가 필요합니다.",
        status: 400,
      });
    }

    // 중복 체크: 같은 요청/응답이 이미 저장되어 있는지 확인 (1분 이내)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    let duplicateCheck = adminSupabase
      .from("api_generation_history")
      .select("id")
      .eq("type", type)
      .eq("encrypted_request", encryptedRequest)
      .eq("encrypted_response", encryptedResponse)
      .gte("created_at", oneMinuteAgo);

    if (userId) {
      duplicateCheck = duplicateCheck.eq("user_id", userId).is("anonymous_id", null);
    } else if (anonymousId) {
      duplicateCheck = duplicateCheck.eq("anonymous_id", anonymousId).is("user_id", null);
    }

    const { data: existingRecords, error: duplicateError } =
      await duplicateCheck.limit(1);

    if (duplicateError) {
      console.error("중복 조회 실패:", duplicateError);
      return apiError({
        error: duplicateError,
        userMessage: "히스토리 중복 조회에 실패했습니다.",
      });
    }

    if (existingRecords && existingRecords.length > 0) {
      console.log("중복 저장 방지: 같은 요청/응답이 이미 저장되어 있습니다.");
      return NextResponse.json({
        success: true,
        data: existingRecords[0],
        message: "이미 저장된 히스토리입니다.",
      });
    }

    const insertData: ApiGenerationHistoryInsert = {
      type,
      encrypted_request: encryptedRequest,
      encrypted_response: encryptedResponse,
      success: success ?? true,
      error_message: toErrorString(error),
      created_at: new Date().toISOString(),
    };

    // API 키로 찾은 사용자 정보 사용 (API 키로 찾았으면 그 정보만 사용)
    if (userId) {
      insertData.user_id = userId;
      insertData.anonymous_id = null;
    } else if (anonymousId) {
      insertData.anonymous_id = anonymousId;
      insertData.user_id = null;
    }

    const { data, error: dbError } = await adminSupabase
      .from("api_generation_history")
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error("Supabase 저장 오류:", dbError);
      return apiError({
        error: dbError,
        userMessage: "히스토리 저장에 실패했습니다.",
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return apiError({
      error,
      userMessage: "서버 오류가 발생했습니다.",
    });
  }
}

// API 생성 히스토리 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const anonymousId = searchParams.get("anonymousId");

    let query = supabase
      .from("api_generation_history")
      .select("id, type, success, error_message, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    // 인증된 사용자는 자신의 데이터만, 익명 사용자는 자신의 anonymous_id로만
    if (user) {
      query = query.eq("user_id", user.id);
    } else if (anonymousId) {
      query = query.eq("anonymous_id", anonymousId);
    } else {
      return apiError({
        error: "Unauthorized",
        userMessage: "인증이 필요하거나 익명 사용자 ID가 필요합니다.",
        status: 401,
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase 조회 오류:", error);
      return apiError({
        error,
        userMessage: "히스토리 조회에 실패했습니다.",
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return apiError({
      error,
      userMessage: "서버 오류가 발생했습니다.",
    });
  }
}

// 특정 생성 히스토리 상세 조회 (복호화 포함)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError({
        error: "Unauthorized",
        userMessage: "인증이 필요합니다.",
        status: 401,
      });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return apiError({
        error: "Missing id",
        userMessage: "ID가 필요합니다.",
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("api_generation_history")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return apiError({
        error: "History not found",
        userMessage: "히스토리를 찾을 수 없습니다.",
        status: 404,
      });
    }

    // 복호화는 서버에서만 수행 (클라이언트에 전송하지 않음)
    // 필요시 별도 엔드포인트에서 복호화된 데이터 제공

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return apiError({
      error,
      userMessage: "서버 오류가 발생했습니다.",
    });
  }
}

// API 생성 히스토리 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError({
        error: "Unauthorized",
        userMessage: "인증이 필요합니다.",
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // 특정 항목 삭제
      const { error } = await supabase
        .from("api_generation_history")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        return apiError({
          error,
          userMessage: "삭제에 실패했습니다.",
        });
      }
    } else {
      // 전체 삭제
      const { error } = await supabase
        .from("api_generation_history")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        return apiError({
          error,
          userMessage: "전체 삭제에 실패했습니다.",
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError({
      error,
      userMessage: "서버 오류가 발생했습니다.",
    });
  }
}
