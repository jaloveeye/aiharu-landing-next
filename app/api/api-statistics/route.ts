import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/app/utils/supabase/admin";
import { decrypt } from "@/app/utils/encryption";

// 관리자용 API 통계 조회 (서비스 역할 키 필요)
export async function GET(request: NextRequest) {
  try {
    // 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인하세요." 
        },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();
    
    // 전체 기간 조회 (날짜 필터 없음)

    // API 키 발급 통계
    let keyStats: any[] = [];
    let keyError: any = null;
    
    try {
      const result = await supabase
        .from("api_key_history")
        .select("*")
        .order("created_at", { ascending: false });
      
      keyStats = result.data || [];
      keyError = result.error;
    } catch (err: any) {
      // 테이블이 없거나 RLS 문제인 경우
      if (err.message?.includes("relation") || err.message?.includes("does not exist")) {
        console.warn("api_key_history 테이블이 아직 생성되지 않았습니다.");
        keyStats = [];
      } else {
        console.error("API 키 통계 조회 오류:", err);
        keyError = err;
      }
    }

    if (keyError && !keyError.message?.includes("does not exist")) {
      console.error("API 키 통계 조회 오류:", keyError);
    }

    // API 생성 통계
    let generationStats: any[] = [];
    let genError: any = null;
    
    try {
      const result = await supabase
        .from("api_generation_history")
        .select("*")
        .order("created_at", { ascending: false });
      
      generationStats = result.data || [];
      genError = result.error;
    } catch (err: any) {
      // 테이블이 없거나 RLS 문제인 경우
      if (err.message?.includes("relation") || err.message?.includes("does not exist")) {
        console.warn("api_generation_history 테이블이 아직 생성되지 않았습니다.");
        generationStats = [];
      } else {
        console.error("API 생성 통계 조회 오류:", err);
        genError = err;
      }
    }

    if (genError && !genError.message?.includes("does not exist")) {
      console.error("API 생성 통계 조회 오류:", genError);
      console.error("조회된 데이터 개수:", generationStats?.length || 0);
    } else {
      console.log("API 생성 통계 조회 성공, 데이터 개수:", generationStats?.length || 0);
    }

    // 통계 계산
    const totalKeyIssuances = keyStats?.length || 0;
    // 고유한 사용자 수 계산 (같은 사용자가 여러 번 발급받아도 1명으로 카운트)
    const uniqueAuthenticatedUsers = new Set(
      keyStats?.filter((k) => k.user_id).map((k) => k.user_id) || []
    );
    const authenticatedKeyIssuances = uniqueAuthenticatedUsers.size;

    // 이메일 목록 (복호화 후 중복 제거, 최신순 정렬)
    // 복호화 실패 시 원본 데이터를 그대로 사용 (평문 데이터일 수 있음)
    const decryptedKeyStats = (keyStats || []).map((k) => {
      // encrypted_email 또는 email 필드 지원 (데이터베이스 스키마에 따라 다를 수 있음)
      const encryptedEmail = k.encrypted_email || k.email;
      
      if (!encryptedEmail) {
        return null; // 이메일이 없으면 제외
      }
      
      try {
        // throwOnError: false로 설정하여 복호화 실패 시 원본 반환
        const decryptedEmail = decrypt(encryptedEmail, false);
        return {
          ...k,
          email: decryptedEmail || encryptedEmail, // 복호화 실패 시 원본 사용
        };
      } catch (error) {
        console.error("이메일 복호화 오류:", error);
        // 복호화 실패 시 원본 사용 (평문 데이터일 수 있음)
        return {
          ...k,
          email: encryptedEmail,
        };
      }
    }).filter((k): k is NonNullable<typeof k> => k !== null && !!k.email); // null과 빈 이메일 제거

    // 이메일별로 그룹화하고 통계 생성
    const emailMap = new Map<string, {
      email: string;
      count: number;
      latestIssuance: string | null;
      isAuthenticated: boolean;
    }>();

    decryptedKeyStats.forEach((k) => {
      const email = k.email?.trim();
      if (!email) return;

      if (!emailMap.has(email)) {
        emailMap.set(email, {
          email,
          count: 0,
          latestIssuance: null,
          isAuthenticated: false,
        });
      }

      const entry = emailMap.get(email)!;
      entry.count++;
      
      const keyDate = new Date(k.created_at).getTime();
      const currentDate = entry.latestIssuance ? new Date(entry.latestIssuance).getTime() : 0;
      
      if (keyDate > currentDate) {
        entry.latestIssuance = k.created_at;
        entry.isAuthenticated = !!k.user_id;
      }
    });

    const emailList = Array.from(emailMap.values()).sort((a, b) => {
      const dateA = a.latestIssuance ? new Date(a.latestIssuance).getTime() : 0;
      const dateB = b.latestIssuance ? new Date(b.latestIssuance).getTime() : 0;
      return dateB - dateA; // 최신순 정렬
    });

    const totalGenerations = generationStats?.length || 0;
    // 고유한 사용자 수 계산 (같은 사용자가 여러 번 생성해도 1명으로 카운트)
    const uniqueAuthenticatedGenUsers = new Set(
      generationStats?.filter((g) => g.user_id).map((g) => g.user_id) || []
    );
    const uniqueAnonymousGenUsers = new Set(
      generationStats?.filter((g) => g.anonymous_id).map((g) => g.anonymous_id) || []
    );
    const authenticatedGenerations = uniqueAuthenticatedGenUsers.size;
    const anonymousGenerations = uniqueAnonymousGenUsers.size;

    // 타입별 통계
    const adventureGenerations = generationStats?.filter((g) => g.type === "adventure").length || 0;
    const riddleGenerations = generationStats?.filter((g) => g.type === "riddle").length || 0;

    // 성공/실패 통계
    const successfulGenerations = generationStats?.filter((g) => g.success).length || 0;
    const failedGenerations = generationStats?.filter((g) => !g.success).length || 0;

    // 일별 통계
    const dailyKeyIssuances: Record<string, { authenticated: number; total: number }> = {};
    keyStats?.forEach((stat) => {
      const date = stat.created_at.split("T")[0];
      if (!dailyKeyIssuances[date]) {
        dailyKeyIssuances[date] = { authenticated: 0, total: 0 };
      }
      dailyKeyIssuances[date].total++;
      if (stat.user_id) {
        dailyKeyIssuances[date].authenticated++;
      }
    });

    const dailyGenerations: Record<string, { adventure: number; riddle: number; total: number; success: number; failed: number }> = {};
    generationStats?.forEach((stat) => {
      const date = stat.created_at.split("T")[0];
      if (!dailyGenerations[date]) {
        dailyGenerations[date] = { adventure: 0, riddle: 0, total: 0, success: 0, failed: 0 };
      }
      dailyGenerations[date].total++;
      if (stat.type === "adventure") {
        dailyGenerations[date].adventure++;
      } else {
        dailyGenerations[date].riddle++;
      }
      if (stat.success) {
        dailyGenerations[date].success++;
      } else {
        dailyGenerations[date].failed++;
      }
    });

    return NextResponse.json({
      success: true,
      period: { start: null, end: null }, // 전체 기간
      summary: {
        keyIssuances: {
          total: totalKeyIssuances,
          authenticated: authenticatedKeyIssuances,
        },
        generations: {
          total: totalGenerations,
          authenticated: authenticatedGenerations,
          anonymous: anonymousGenerations,
          authenticatedPercentage: totalGenerations > 0 ? ((authenticatedGenerations / totalGenerations) * 100).toFixed(2) : "0.00",
          byType: {
            adventure: adventureGenerations,
            riddle: riddleGenerations,
          },
          byStatus: {
            successful: successfulGenerations,
            failed: failedGenerations,
            successRate: totalGenerations > 0 ? ((successfulGenerations / totalGenerations) * 100).toFixed(2) : "0.00",
          },
        },
      },
      daily: {
        keyIssuances: dailyKeyIssuances,
        generations: dailyGenerations,
      },
      emailList: emailList,
    });
  } catch (error: any) {
    console.error("통계 조회 오류:", error);
    
    // 더 자세한 에러 메시지 제공
    let errorMessage = "서버 오류가 발생했습니다.";
    if (error.message) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

