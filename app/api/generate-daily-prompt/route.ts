import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  getTodayAllPromptResults,
  savePromptResult,
  getRecentContextForCategory,
  generateContextSummary,
  updatePromptEmbeddingById,
} from "@/app/utils/promptResults";
import {
  analyzePromptQuality,
  getQualityGrade,
  generateQualitySuggestions,
} from "@/app/utils/promptQualityAnalyzer";
import { promptTemplates } from "@/data/prompts";
import { createClient } from "@/app/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 프롬프트 생성 후 벡터 저장 함수
async function savePromptWithEmbedding(promptData: any, aiAnswer: string) {
  try {
    // 1. 프롬프트 저장
    const promptResultId = await savePromptResult(
      promptData,
      aiAnswer,
      "gpt-3.5-turbo",
      promptData.tokens_used
    );

    if (!promptResultId) {
      throw new Error("프롬프트 저장 실패");
    }

    // 2. 벡터 생성 및 저장
    const embeddingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-embedding`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `${promptData.title} ${promptData.prompt} ${aiAnswer}`,
        }),
      }
    );

    if (embeddingResponse.ok) {
      const { embedding } = await embeddingResponse.json();

      // 3. 벡터를 데이터베이스에 저장
      const updateSuccess = await updatePromptEmbeddingById(
        promptResultId,
        embedding
      );
      if (updateSuccess) {
        console.log(`벡터 저장 완료: ${promptResultId}`);
      } else {
        console.warn(`벡터 저장 실패: ${promptResultId}`);
      }
    } else {
      console.warn(`벡터 생성 실패: ${promptData.id}`);
    }

    return promptResultId;
  } catch (error) {
    console.error("프롬프트 및 벡터 저장 오류:", error);
    throw error;
  }
}

// 공통 프롬프트 생성 함수
export async function generateDailyPrompts() {
  // 품질 기준 설정
  const QUALITY_THRESHOLD = 50; // 최소 품질 점수 (75에서 50으로 낮춤)
  const MAX_RETRY = 3; // 최대 재시도 횟수

  // 오늘 이미 생성된 프롬프트가 있는지 확인
  const todayResults = await getTodayAllPromptResults();

  if (todayResults && todayResults.length >= 3) {
    return {
      message: "오늘의 프롬프트가 이미 생성되었습니다.",
      results: todayResults,
    };
  }

  // 다양한 카테고리에서 랜덤하게 선택 (육아 필수 + 나머지 2개 랜덤)
  const allCategories = [
    "육아", // 필수
    "육아창업",
    "비즈니스마케팅",
    "학습교육",
    "일상라이프",
  ];

  // 육아는 항상 포함하고, 나머지 2개는 랜덤 선택
  const nonParentingCategories = allCategories.filter((cat) => cat !== "육아");
  const shuffled = nonParentingCategories.sort(() => 0.5 - Math.random());
  const selectedCategories = ["육아", ...shuffled.slice(0, 2)];

  console.log("선택된 카테고리들:", selectedCategories);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  const generatedResults = [];

  // 3개의 프롬프트 생성
  for (const category of selectedCategories) {
    console.log(`\n🚀 === ${category} 카테고리 프롬프트 생성 시작 ===`);

    // 최근 프롬프트 결과 가져오기 (연속성 판단용)
    const recentContext = await getRecentContextForCategory(category, 5);
    const contextSummary = generateContextSummary(recentContext);

    // 연속성 카운터 계산 (최근 3개가 연관된 주제인지 확인)
    const CONTINUITY_LIMIT = 3;
    const isContinuityMode = recentContext.length < CONTINUITY_LIMIT;
    
    // 연속성 모드 결정
    const shouldUseContinuity = isContinuityMode && recentContext.length > 0;
    
    console.log(`[연속성 관리] ${category} 카테고리:`);
    console.log(`- 최근 결과 수: ${recentContext.length}`);
    console.log(`- 연속성 모드: ${shouldUseContinuity ? '활성' : '비활성'}`);
    console.log(`- 기존 주제: ${contextSummary || "없음"}`);

    // AI가 질문과 답변을 모두 생성하도록 시스템 프롬프트 설정
    const systemPrompt = `당신은 ${category} 분야의 전문가입니다. 성인 고학력자 수준의 깊이 있고 실용적인 질문과 답변을 생성해주세요.

${
  contextSummary
    ? `\n기존에 다룬 주제들:\n${contextSummary}\n\n`
    : ""
}

요구사항:
- **질문**: 구체적이고 복합적인 상황과 문제를 제시하는 전문가 수준의 질문
- **답변**: 실용적이고 실행 가능한 구체적인 해결 방법이나 조언
- 전문성: 해당 분야의 최신 트렌드와 전문 지식을 반영
- 실용성: 실제 상황에서 바로 적용할 수 있는 내용
- **주제 생성 방식**: ${
      shouldUseContinuity
        ? "기존 주제와 자연스럽게 연결되거나 발전된 내용을 제시하되, 반복하지 말 것. 연관성 있는 새로운 관점을 제시"
        : "기존 주제와는 완전히 다른 새로운 관점, 상황, 문제를 제시할 것. 연관성을 고려하지 말고 독립적인 주제로 생성"
    }
- **창의성**: 예상치 못한 각도나 혁신적인 접근 방식 제시

형식:
**질문:** [전문가 수준의 구체적이고 복합적인 상황과 문제]
**답변:** [실용적이고 구체적인 해결 방법이나 조언]`;

    console.log(
      `📝 시스템 프롬프트 구성 완료 (길이: ${systemPrompt.length}자)`
    );

    // 선택된 카테고리의 프롬프트 생성 가이드 가져오기
    const categoryPrompt = promptTemplates.find((p) => p.category === category);
    if (!categoryPrompt) {
      console.error(`카테고리 프롬프트를 찾을 수 없습니다: ${category}`);
      continue;
    }

    // 연속성 모드에 따른 다양성 강화 요소 선택
    const continuityPrompts = [
      "기존 주제와 자연스럽게 연결되는 새로운 관점을 제시해주세요.",
      "이전 주제를 발전시킨 더 깊이 있는 문제를 다뤄주세요.",
      "연관된 주제의 다른 측면을 탐구해주세요.",
      "기존 주제의 실무적 적용 사례를 제시해주세요.",
    ];

    const diversityPrompts = [
      "완전히 새로운 관점에서 접근해주세요.",
      "예상치 못한 각도로 문제를 제시해주세요.",
      "혁신적이고 창의적인 해결책을 제시해주세요.",
      "최신 트렌드와 기술을 활용한 접근을 해주세요.",
      "실무진이 실제로 마주하는 현실적인 문제를 다뤄주세요.",
    ];

    const selectedPrompts = shouldUseContinuity ? continuityPrompts : diversityPrompts;
    const randomPrompt = selectedPrompts[Math.floor(Math.random() * selectedPrompts.length)];
    const enhancedPrompt = `${categoryPrompt.prompt}\n\n추가 요구사항: ${randomPrompt}`;

    console.log(`🎲 ${shouldUseContinuity ? '연속성' : '다양성'} 강화: ${randomPrompt}`);

    let bestQuality = 0;
    let bestQuestion = "";
    let bestAnswer = "";
    let bestTokens = 0;

    // 품질 기준을 만족할 때까지 재생성
    for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
      console.log(`\n🔄 ${category} 카테고리 ${attempt}번째 시도 시작...`);
      console.log(`   - Temperature: ${0.7 + (attempt - 1) * 0.1}`);
      console.log(`   - 품질 기준: ${QUALITY_THRESHOLD}점 이상`);

      // OpenAI API 호출 - 질문과 답변을 각각 생성
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `카테고리: ${category}

이 카테고리에서 성인 고학력자 전문가 수준의 질문과 답변을 생성해주세요.

반드시 다음 형식으로 작성해주세요. 다른 형식은 절대 사용하지 마세요:

**질문:**
[전문가 수준의 구체적이고 실용적인 질문을 작성]

**답변:**
[전문적이고 깊이 있는 답변을 단계별로 작성]

위 형식을 정확히 지켜주세요.`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7 + (attempt - 1) * 0.1, // 재시도마다 창의성 증가
      });

      const generatedText = completion.choices[0]?.message?.content || "";
      const tokensUsed = completion.usage?.total_tokens || 0;

      console.log(
        `✅ ${category} 카테고리 프롬프트 생성 완료 (시도 ${attempt})`
      );
      console.log(`   - 생성된 텍스트 길이: ${generatedText.length}자`);
      console.log(`   - 사용된 토큰: ${tokensUsed}개`);

      // 생성된 텍스트에서 질문과 답변 분리
      const questionMatch = generatedText.match(
        /\*\*질문:\*\*\s*([\s\S]*?)(?=\*\*답변:\*\*)/
      );
      const answerMatch = generatedText.match(/\*\*답변:\*\*\s*([\s\S]*?)$/);

      let aiGeneratedQuestion = questionMatch ? questionMatch[1].trim() : "";
      let aiGeneratedAnswer = answerMatch ? answerMatch[1].trim() : "";

      // 백업 분리 로직: 만약 정규식으로 분리되지 않았다면
      if (!aiGeneratedQuestion || !aiGeneratedAnswer) {
        console.log(`⚠️ 정규식 분리 실패, 백업 분리 로직 실행...`);

        // 텍스트를 줄 단위로 분리
        const lines = generatedText.split("\n").filter((line) => line.trim());

        if (lines.length >= 2) {
          // 중간 지점을 기준으로 분리
          const midPoint = Math.floor(lines.length / 2);

          if (!aiGeneratedQuestion) {
            aiGeneratedQuestion = lines.slice(0, midPoint).join("\n").trim();
            console.log(
              `📝 백업 질문 생성: ${aiGeneratedQuestion.substring(0, 100)}...`
            );
          }

          if (!aiGeneratedAnswer) {
            aiGeneratedAnswer = lines.slice(midPoint).join("\n").trim();
            console.log(
              `📝 백업 답변 생성: ${aiGeneratedAnswer.substring(0, 100)}...`
            );
          }
        }
      }

      // 최종 검증 및 기본값 설정
      if (!aiGeneratedQuestion || aiGeneratedQuestion.length < 10) {
        aiGeneratedQuestion = generatedText
          .substring(0, Math.floor(generatedText.length / 2))
          .trim();
        console.log(`⚠️ 질문이 너무 짧음, 전체 텍스트의 절반을 질문으로 사용`);
      }

      if (!aiGeneratedAnswer || aiGeneratedAnswer.length < 10) {
        aiGeneratedAnswer = generatedText
          .substring(Math.floor(generatedText.length / 2))
          .trim();
        console.log(`⚠️ 답변이 너무 짧음, 전체 텍스트의 절반을 답변으로 사용`);
      }

      console.log(`📋 텍스트 분리 결과:`);
      console.log(`   - 질문 길이: ${aiGeneratedQuestion.length}자`);
      console.log(`   - 답변 길이: ${aiGeneratedAnswer.length}자`);
      console.log(`   - 질문: ${aiGeneratedQuestion.substring(0, 100)}...`);
      console.log(`   - 답변: ${aiGeneratedAnswer.substring(0, 100)}...`);

      // 품질 분석 수행
      console.log(`🔍 품질 분석 시작...`);
      const qualityMetrics = analyzePromptQuality(
        aiGeneratedQuestion,
        aiGeneratedAnswer,
        category,
        tokensUsed
      );
      const qualityGrade = getQualityGrade(qualityMetrics.overallScore);

      console.log(`📊 [품질 분석] ${category} 카테고리 (시도 ${attempt}):`);
      console.log(`   - 전체 점수: ${qualityMetrics.overallScore}/100`);
      console.log(`   - 등급: ${qualityGrade}`);
      console.log(`   - 구조화: ${qualityMetrics.structureScore}/100`);
      console.log(`   - 전문성: ${qualityMetrics.expertiseScore}/100`);
      console.log(`   - 맥락 연관성: ${qualityMetrics.contextScore}/100`);
      console.log(`   - 실용성: ${qualityMetrics.practicalityScore}/100`);
      console.log(
        `   - 질문 명확성: ${qualityMetrics.questionClarityScore}/100`
      );
      console.log(
        `   - 질문 전문성: ${qualityMetrics.questionExpertiseScore}/100`
      );
      console.log(
        `   - 질문 복잡성: ${qualityMetrics.questionComplexityScore}/100`
      );

      // 품질 점수 확인 및 로깅
      console.log(
        `🔍 ${category} 카테고리 ${attempt}번째 시도 품질 점수: ${qualityMetrics.overallScore}/100`
      );
      console.log(`   - 품질 기준: ${QUALITY_THRESHOLD}점`);
      console.log(`   - 현재 최고 점수: ${bestQuality}점`);

      // 품질 점수가 기준을 넘으면 즉시 저장하고 다음 카테고리로
      if (qualityMetrics.overallScore >= QUALITY_THRESHOLD) {
        console.log(
          `🎯 ${category} 카테고리 품질 기준 달성 (${attempt}번째 시도)`
        );
        console.log(`   - 기준: ${QUALITY_THRESHOLD}점 이상`);
        console.log(`   - 달성: ${qualityMetrics.overallScore}점`);
        bestQuality = qualityMetrics.overallScore;
        bestQuestion = aiGeneratedQuestion;
        bestAnswer = aiGeneratedAnswer;
        bestTokens = tokensUsed;
        break; // 즉시 중단하고 저장 프로세스로
      }

      // 품질이 낮으면 더 나은 결과를 위해 저장
      if (qualityMetrics.overallScore > bestQuality) {
        console.log(
          `📈 더 나은 품질 결과 발견 (이전: ${bestQuality}점 → 현재: ${qualityMetrics.overallScore}점)`
        );
        bestQuality = qualityMetrics.overallScore;
        bestQuestion = aiGeneratedQuestion;
        bestAnswer = aiGeneratedAnswer;
        bestTokens = tokensUsed;
      }

      // 첫 번째 시도라면 기본값으로 설정
      if (attempt === 1 && bestQuality === 0) {
        console.log(`📝 첫 번째 시도 결과를 기본값으로 설정`);
        bestQuality = qualityMetrics.overallScore;
        bestQuestion = aiGeneratedQuestion;
        bestAnswer = aiGeneratedAnswer;
        bestTokens = tokensUsed;
      }

      // 품질이 낮은 경우에만 재시도
      if (attempt < MAX_RETRY) {
        console.log(
          `⚠️ ${category} 카테고리 품질 미달 (${qualityMetrics.overallScore}/100), 재시도...`
        );
        console.log(`   - 남은 시도 횟수: ${MAX_RETRY - attempt}회`);
        // 잠시 대기 후 재시도
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        console.log(
          `⚠️ ${category} 카테고리 최대 시도 횟수 도달, 최고 품질 결과 사용 (${bestQuality}/100)`
        );
        break; // 저장 프로세스로 진행
      }
    }

    console.log(`\n💾💾💾 ${category} 카테고리 DB 저장 프로세스 시작 💾💾💾`);
    console.log(`[DEBUG-1] bestQuestion 길이: ${bestQuestion.length}`);
    console.log(`[DEBUG-2] bestAnswer 길이: ${bestAnswer.length}`);
    console.log(`[DEBUG-3] bestQuality: ${bestQuality}`);
    console.log(`[DEBUG-4] bestTokens: ${bestTokens}`);
    console.log(`   - 최종 질문: ${bestQuestion.substring(0, 100)}...`);
    console.log(`   - 최종 답변: ${bestAnswer.substring(0, 100)}...`);
    console.log(`   - 최종 품질: ${bestQuality}/100`);
    console.log(`   - 최종 토큰: ${bestTokens}개`);

    // 품질 측정을 먼저 수행
    console.log(`[DEBUG-5] 품질 분석 함수 호출 시작`);
    console.log(`🔍 ${category} 카테고리 품질 분석 시작...`);
    const finalQualityMetrics = analyzePromptQuality(
      bestQuestion,
      bestAnswer,
      category,
      bestTokens
    );
    console.log(`[DEBUG-6] 품질 분석 완료`);
    const finalQualityGrade = getQualityGrade(finalQualityMetrics.overallScore);
    console.log(`[DEBUG-7] 품질 등급 계산 완료`);
    const finalQualitySuggestions = generateQualitySuggestions(
      finalQualityMetrics,
      category
    );
    console.log(`[DEBUG-8] 품질 제안 생성 완료`);

    console.log(`📊 ${category} 카테고리 품질 분석 결과:`);
    console.log(`   - 전체 점수: ${finalQualityMetrics.overallScore}/100`);
    console.log(`   - 등급: ${finalQualityGrade}`);
    console.log(`   - 구조화: ${finalQualityMetrics.structureScore}/100`);
    console.log(`   - 전문성: ${finalQualityMetrics.expertiseScore}/100`);
    console.log(`   - 맥락 연관성: ${finalQualityMetrics.contextScore}/100`);
    console.log(`   - 실용성: ${finalQualityMetrics.practicalityScore}/100`);
    console.log(
      `   - 질문 명확성: ${finalQualityMetrics.questionClarityScore}/100`
    );
    console.log(
      `   - 질문 전문성: ${finalQualityMetrics.questionExpertiseScore}/100`
    );
    console.log(
      `   - 질문 복잡성: ${finalQualityMetrics.questionComplexityScore}/100`
    );
    console.log(`   - 개선 제안: ${finalQualitySuggestions.length}개`);

    // 최종 결과 저장 (품질 측정 결과 포함)
    const promptData = {
      id: `generated-${Date.now()}-${category}`,
      title: `${category} 전문가 질문`,
      category: category as any,
      prompt: bestQuestion,
      tags: [category, "AI생성", "전문가수준"],
      difficulty: "고급" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tokens_used: bestTokens,
    };

    // 프롬프트 결과를 데이터베이스에 직접 저장 (품질 측정 결과 포함)
    console.log(`[DEBUG-9] DB 저장 시작`);
    console.log(`💾 ${category} 카테고리 데이터베이스 저장 시작...`);

    try {
      console.log(`[DEBUG-10] Supabase 클라이언트 생성 시작`);
      const supabase = await createClient();
      console.log(`[DEBUG-11] Supabase 클라이언트 생성 완료`);
      console.log(`✅ Supabase 클라이언트 생성 성공`);

      console.log(`[DEBUG-12] insertData 객체 생성 시작`);
      const insertData: any = {
        prompt_id: promptData.id,
        prompt_title: promptData.title,
        prompt_content: promptData.prompt,
        prompt_category: promptData.category,
        prompt_difficulty: promptData.difficulty,
        prompt_tags: promptData.tags,
        ai_result: bestAnswer,
        ai_model: "gpt-3.5-turbo",
        tokens_used: promptData.tokens_used,
        created_at: promptData.createdAt,
        updated_at: promptData.updatedAt,
        // 품질 측정 결과를 함께 저장
        quality_metrics: {
          structure_score: finalQualityMetrics.structureScore,
          expertise_score: finalQualityMetrics.expertiseScore,
          context_score: finalQualityMetrics.contextScore,
          practicality_score: finalQualityMetrics.practicalityScore,
          question_clarity_score: finalQualityMetrics.questionClarityScore,
          question_expertise_score: finalQualityMetrics.questionExpertiseScore,
          question_complexity_score:
            finalQualityMetrics.questionComplexityScore,
          overall_score: finalQualityMetrics.overallScore,
          details: finalQualityMetrics.details,
        },
        quality_grade: finalQualityGrade,
        quality_suggestions: finalQualitySuggestions,
      };
      console.log(`[DEBUG-13] insertData 객체 생성 완료`);

      console.log(`[DEBUG-14] insertData 로깅 시작`);
      console.log(
        `📝 저장할 데이터 구조:`,
        JSON.stringify(insertData, null, 2)
      );

      // 각 컬럼별 데이터 상세 출력
      console.log(`🔍 [컬럼별 데이터 상세]`);
      console.log(
        `   - prompt_id: "${
          insertData.prompt_id
        }" (타입: ${typeof insertData.prompt_id})`
      );
      console.log(
        `   - prompt_title: "${
          insertData.prompt_title
        }" (타입: ${typeof insertData.prompt_title})`
      );
      console.log(
        `   - prompt_content: "${insertData.prompt_content.substring(
          0,
          100
        )}..." (타입: ${typeof insertData.prompt_content}, 길이: ${
          insertData.prompt_content.length
        })`
      );
      console.log(
        `   - prompt_category: "${
          insertData.prompt_category
        }" (타입: ${typeof insertData.prompt_category})`
      );
      console.log(
        `   - prompt_difficulty: "${
          insertData.prompt_difficulty
        }" (타입: ${typeof insertData.prompt_difficulty})`
      );
      console.log(
        `   - prompt_tags: [${insertData.prompt_tags.join(
          ", "
        )}] (타입: ${typeof insertData.prompt_tags})`
      );
      console.log(
        `   - ai_result: "${insertData.ai_result.substring(
          0,
          100
        )}..." (타입: ${typeof insertData.ai_result}, 길이: ${
          insertData.ai_result.length
        })`
      );
      console.log(
        `   - ai_model: "${
          insertData.ai_model
        }" (타입: ${typeof insertData.ai_model})`
      );
      console.log(
        `   - tokens_used: ${
          insertData.tokens_used
        } (타입: ${typeof insertData.tokens_used})`
      );
      console.log(
        `   - created_at: "${
          insertData.created_at
        }" (타입: ${typeof insertData.created_at})`
      );
      console.log(
        `   - updated_at: "${
          insertData.updated_at
        }" (타입: ${typeof insertData.updated_at})`
      );

      // 품질 관련 컬럼 상세 출력
      console.log(`🔍 [품질 관련 컬럼 상세]`);
      console.log(
        `   - quality_metrics:`,
        JSON.stringify(insertData.quality_metrics, null, 2)
      );
      console.log(
        `   - quality_grade: "${
          insertData.quality_grade
        }" (타입: ${typeof insertData.quality_grade})`
      );
      console.log(
        `   - quality_suggestions: [${insertData.quality_suggestions.join(
          ", "
        )}] (타입: ${typeof insertData.quality_suggestions})`
      );

      console.log(`[DEBUG-15] insertData 로깅 완료`);

      console.log(`[DEBUG-16] Supabase insert 실행 시작`);
      const { data: promptResult, error: insertError } = await supabase
        .from("prompt_results")
        .insert(insertData)
        .select()
        .single();
      console.log(`[DEBUG-17] Supabase insert 실행 완료`);

      if (insertError) {
        console.error(
          `❌ ${category} 카테고리 프롬프트 저장 실패:`,
          insertError
        );
        console.log(`   - 에러 코드: ${insertError.code}`);
        console.log(`   - 에러 메시지: ${insertError.message}`);
        console.log(`   - 에러 상세: ${insertError.details}`);
        console.log(
          `   - 저장하려던 데이터:`,
          JSON.stringify(
            {
              prompt_id: promptData.id,
              prompt_title: promptData.title,
              prompt_category: promptData.category,
              prompt_difficulty: promptData.difficulty,
              tokens_used: promptData.tokens_used,
            },
            null,
            2
          )
        );
        console.log(`⚠️ ${category} 카테고리 저장 실패로 다음 카테고리로 진행`);
        continue;
      }

      const promptResultId = promptResult.id;
      console.log(
        `✅ ${category} 카테고리 프롬프트 저장 완료 (ID: ${promptResultId})`
      );
      console.log(
        `🔍 promptResultId 확인: ${promptResultId} (타입: ${typeof promptResultId})`
      );
      console.log(`   - 품질 측정 결과도 함께 저장됨`);
      console.log(
        `   - promptResult 객체:`,
        JSON.stringify(promptResult, null, 2)
      );

      // 임베딩 생성 및 저장
      try {
        const embeddingResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-embedding`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: bestAnswer,
            }),
          }
        );

        if (embeddingResponse.ok) {
          const { embedding } = await embeddingResponse.json();
          const { error: embeddingError } = await supabase
            .from("prompt_results")
            .update({ embedding })
            .eq("id", promptResultId);

          if (embeddingError) {
            console.warn(
              `⚠️ ${category} 카테고리 임베딩 저장 실패:`,
              embeddingError
            );
          } else {
            console.log(`✅ ${category} 카테고리 임베딩 저장 완료`);
          }
        } else {
          console.warn(
            `⚠️ ${category} 카테고리 임베딩 생성 실패:`,
            embeddingResponse.status
          );
        }
      } catch (error) {
        console.warn(`⚠️ ${category} 카테고리 임베딩 생성 실패:`, error);
      }

      // generatedResults에 추가
      generatedResults.push({
        id: promptResultId,
        category,
        question: bestQuestion,
        answer: bestAnswer,
        quality: finalQualityMetrics.overallScore,
        grade: finalQualityGrade,
      });
    } catch (error) {
      console.error(
        `❌ ${category} 카테고리 데이터베이스 저장 중 예외 발생:`,
        error
      );
      console.log(`   - 에러 타입:`, typeof error);
      console.log(
        `   - 에러 메시지:`,
        error instanceof Error ? error.message : String(error)
      );
      continue;
    }
  } // for 루프 닫기

  return {
    message: `${generatedResults.length}개의 프롬프트가 생성되었습니다.`,
    results: generatedResults,
  };
} // generateDailyPrompts 함수 닫기

export async function GET() {
  try {
    const result = await generateDailyPrompts();
    return NextResponse.json(result);
  } catch (error) {
    console.error("프롬프트 생성 오류:", error);
    return NextResponse.json(
      { error: "프롬프트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await generateDailyPrompts();
    return NextResponse.json(result);
  } catch (error) {
    console.error("프롬프트 생성 오류:", error);
    return NextResponse.json(
      { error: "프롬프트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
