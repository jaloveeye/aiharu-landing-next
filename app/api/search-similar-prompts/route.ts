import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const {
      query,
      category,
      limit = 5,
      threshold = 0.7,
    } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "검색 쿼리가 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. 쿼리 텍스트를 벡터로 변환
    const embeddingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-embedding`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      }
    );

    if (!embeddingResponse.ok) {
      throw new Error("Embedding 생성 실패");
    }

    const { embedding } = await embeddingResponse.json();

    // 2. 유사한 프롬프트 검색 (pgvector 사용)
    let queryBuilder = supabase
      .from("prompt_results")
      .select(
        "id, prompt_title, prompt_content, prompt_category, created_at, embedding"
      )
      .not("embedding", "is", null);

    if (category) {
      queryBuilder = queryBuilder.eq("prompt_category", category);
    }

    const { data, error } = await queryBuilder
      .order("created_at", { ascending: false })
      .limit(limit * 2); // 임계값 필터링을 위해 더 많은 데이터 가져오기

    if (error) {
      throw error;
    }

    // 3. 벡터 유사도 계산 및 필터링
    const results =
      data
        ?.map((item) => {
          const similarity = calculateCosineSimilarity(
            embedding,
            parseEmbedding(item.embedding)
          );
          console.log(`유사도 계산: ${item.id} -> ${similarity}`);
          return {
            ...item,
            similarity,
          };
        })
        .filter((item) => item.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit) || [];

    return NextResponse.json({
      results,
      query,
      total: results.length,
      threshold,
    });
  } catch (error) {
    console.error("유사도 검색 오류:", error);
    return NextResponse.json(
      { error: "검색에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 문자열로 저장된 벡터를 파싱하는 함수
function parseEmbedding(embeddingString: string | number[]): number[] {
  if (Array.isArray(embeddingString)) {
    return embeddingString;
  }

  if (typeof embeddingString === "string") {
    try {
      // "[0.1, 0.2, ...]" 형태의 문자열을 파싱
      return JSON.parse(embeddingString);
    } catch (error) {
      console.error("벡터 파싱 오류:", error);
      return [];
    }
  }

  return [];
}

// 코사인 유사도 계산 함수
function calculateCosineSimilarity(
  embedding1: number[],
  embedding2: number[]
): number {
  if (embedding1.length !== embedding2.length || embedding1.length === 0)
    return 0;

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));

  // OpenAI embedding은 이미 정규화되어 있으므로 -1 ~ 1 범위
  // 이를 0 ~ 1 범위로 변환 (0 = 무관, 1 = 매우 유사)
  // (similarity + 1) / 2 공식 사용
  const normalizedSimilarity = (similarity + 1) / 2;

  return normalizedSimilarity;
}
