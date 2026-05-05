import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/app/utils/supabase/server";
import { apiError } from "@/app/utils/apiError";
import { requireEnv } from "@/app/utils/checkEnv";
import { promptTemplates } from "@/data/prompts";

type PromptCategory = "육아" | "육아창업" | "비즈니스마케팅" | "학습교육" | "일상라이프";

const categoryPromptContent: Record<PromptCategory, string> = {
  육아: "당신은 육아 전문가입니다.",
  육아창업: "당신은 육아창업 전문가입니다.",
  비즈니스마케팅: "당신은 비즈니스 마케팅 전문가입니다.",
  학습교육: "당신은 학습교육 전문가입니다.",
  일상라이프: "당신은 일상라이프 전문가입니다.",
};

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
    const supabase = await createClient();

    const results: Array<{
      category: PromptCategory;
      success: boolean;
      data?: unknown;
      error?: string;
    }> = [];

    for (const category of [
      "육아",
      "육아창업",
      "비즈니스마케팅",
      "학습교육",
      "일상라이프",
    ] as const) {
      try {
        const template = promptTemplates.find((item) => item.category === category);
        if (!template) {
          continue;
        }

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `${categoryPromptContent[category]} 아래 형식에 맞는 실용적인 프롬프트를 생성해주세요.`,
            },
            {
              role: "user",
              content: template.prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        });

        const generatedContent = completion.choices[0]?.message?.content;
        if (!generatedContent) {
          results.push({ category, success: false, error: "OpenAI 응답이 비어있습니다." });
          continue;
        }

        const promptData = {
          prompt_id: template.id,
          prompt_title: `${category} - ${new Date().toISOString().split("T")[0]}`,
          prompt_content: template.prompt,
          prompt_category: category,
          prompt_difficulty: template.difficulty,
          prompt_tags: template.tags,
          ai_result: generatedContent,
          ai_model: "gpt-4",
          tokens_used: completion.usage?.total_tokens || 0,
        };

        const { data, error } = await supabase
          .from("prompt_results")
          .insert([promptData])
          .select();

        if (error) {
          results.push({
            category,
            success: false,
            error: error.message,
          });
          continue;
        }

        results.push({
          category,
          success: true,
          data: data[0],
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          category,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "프롬프트 생성 완료",
      results,
    });
  } catch (error) {
    return apiError({
      error,
      userMessage: "프롬프트 생성에 실패했습니다.",
    });
  }
}
