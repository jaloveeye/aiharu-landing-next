import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { createAdminClient } from "@/app/utils/supabase/admin";
import { encrypt, decrypt } from "@/app/utils/encryption";

// API 키 발급 히스토리 저장 (인증된 사용자 및 익명 사용자 모두 저장)
export async function POST(request: NextRequest) {
  try {
    // 사용자 정보 확인을 위해 일반 클라이언트 사용
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 실제 저장은 관리자 클라이언트로 수행 (RLS 우회)
    const adminSupabase = createAdminClient();

    const body = await request.json();
    const { email, name, description, apiKey, anonymousId } = body;

    if (!email || !name || !apiKey) {
      return NextResponse.json(
        { success: false, error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 인증되지 않은 사용자는 anonymousId 필요
    if (!user && !anonymousId) {
      return NextResponse.json(
        { success: false, error: "익명 사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 모든 민감한 정보 암호화 (DECRYPTION_GUIDE.md 참조)
    const encryptedEmail = encrypt(email);
    const encryptedName = encrypt(name);
    const encryptedDescription = description ? encrypt(description) : null;
    const encryptedApiKey = encrypt(apiKey);

    const insertData: any = {
      encrypted_email: encryptedEmail, // 암호화된 이메일 저장
      encrypted_name: encryptedName, // 암호화된 이름 저장
      encrypted_api_key: encryptedApiKey,
      created_at: new Date().toISOString(),
    };

    // description이 있는 경우에만 추가 (컬럼이 존재하는 경우)
    if (encryptedDescription) {
      insertData.encrypted_description = encryptedDescription;
    }

    // 인증된 사용자면 user_id, 아니면 anonymous_id
    if (user) {
      insertData.user_id = user.id;
      insertData.anonymous_id = null;
    } else {
      insertData.anonymous_id = anonymousId;
      insertData.user_id = null;
    }

    // 중복 체크: 같은 API 키가 이미 저장되어 있는지 확인
    const { data: existingRecords } = await adminSupabase
      .from("api_key_history")
      .select("id, encrypted_api_key")
      .eq("encrypted_api_key", encryptedApiKey)
      .limit(1);

    if (existingRecords && existingRecords.length > 0) {
      console.log("이미 저장된 API 키입니다. 중복 저장을 건너뜁니다.");
      return NextResponse.json({
        success: true,
        data: existingRecords[0],
        message: "이미 저장된 API 키입니다.",
      });
    }

    console.log("API 키 히스토리 저장 시도:", {
      has_user_id: !!insertData.user_id,
      has_anonymous_id: !!insertData.anonymous_id,
      user_id: insertData.user_id,
      anonymous_id: insertData.anonymous_id,
    });

    const { data, error } = await adminSupabase
      .from("api_key_history")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase 저장 오류:", error);
      console.error("에러 코드:", error.code);
      console.error("에러 메시지:", error.message);
      console.error("에러 힌트:", error.hint);
      console.error("에러 세부사항:", error.details);
      console.error("저장 시도 데이터:", {
        has_user_id: !!insertData.user_id,
        has_anonymous_id: !!insertData.anonymous_id,
        user_id: insertData.user_id,
        anonymous_id: insertData.anonymous_id,
      });
      console.error("전체 에러 객체:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          success: false,
          error: "히스토리 저장에 실패했습니다.",
          details: error.message || String(error),
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API 키 히스토리 저장 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// API 키 발급 히스토리 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get("anonymousId");

    let query = supabase
      .from("api_key_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    // 인증된 사용자는 자신의 데이터만, 익명 사용자는 자신의 anonymous_id로만
    if (user) {
      query = query.eq("user_id", user.id);
    } else if (anonymousId) {
      query = query.eq("anonymous_id", anonymousId);
    } else {
      return NextResponse.json(
        { success: false, error: "인증이 필요하거나 익명 사용자 ID가 필요합니다." },
        { status: 401 }
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase 조회 오류:", error);
      return NextResponse.json(
        { success: false, error: "히스토리 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    // 암호화된 데이터 복호화 (DECRYPTION_GUIDE.md 참조)
    // 복호화 실패 시 원본 데이터를 그대로 사용 (평문 데이터일 수 있음)
    const decryptedData = data?.map((item) => {
      try {
        // encrypted_email 또는 email 필드 지원 (데이터베이스 스키마에 따라 다를 수 있음)
        const encryptedEmail = item.encrypted_email || item.email;
        const encryptedName = item.encrypted_name || item.name;
        const encryptedDescription = item.encrypted_description || item.description;
        
        return {
          ...item,
          email: encryptedEmail ? decrypt(encryptedEmail, false) : null, // 복호화된 이메일 (실패 시 원본 반환)
          name: encryptedName ? decrypt(encryptedName, false) : null, // 복호화된 이름 (실패 시 원본 반환)
          description: encryptedDescription ? decrypt(encryptedDescription, false) : null, // 복호화된 설명 (실패 시 원본 반환)
          encrypted_api_key: undefined, // 클라이언트에 전송하지 않음
          api_key_preview: item.encrypted_api_key
            ? `${item.encrypted_api_key.substring(0, 20)}...`
            : null,
        };
      } catch (error) {
        console.error("복호화 오류:", error);
        // 복호화 실패 시 원본 데이터 반환 (평문 데이터일 수 있음)
        return {
          ...item,
          email: item.encrypted_email || item.email || null,
          name: item.encrypted_name || item.name || null,
          description: item.encrypted_description || item.description || null,
          encrypted_api_key: undefined,
          api_key_preview: item.encrypted_api_key
            ? `${item.encrypted_api_key.substring(0, 20)}...`
            : null,
        };
      }
    });

    return NextResponse.json({ success: true, data: decryptedData });
  } catch (error) {
    console.error("API 키 히스토리 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// API 키 발급 히스토리 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // 특정 항목 삭제
      const { error } = await supabase
        .from("api_key_history")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        return NextResponse.json(
          { success: false, error: "삭제에 실패했습니다." },
          { status: 500 }
        );
      }
    } else {
      // 전체 삭제
      const { error } = await supabase
        .from("api_key_history")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        return NextResponse.json(
          { success: false, error: "전체 삭제에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API 키 히스토리 삭제 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

