import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/app/utils/supabase/server";
import { promptTemplates } from "@/data/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 각 카테고리별로 하나씩 프롬프트 생성
    const categories = [
      "육아",
      "육아창업",
      "비즈니스마케팅",
      "학습교육",
      "일상라이프",
    ] as const;

    const results = [];

    for (const category of categories) {
      try {
        // 해당 카테고리의 템플릿 프롬프트 가져오기
        const template = promptTemplates.find((p) => p.category === category);
        if (!template) {
          console.error(`Template not found for category: ${category}`);
          continue;
        }

        // OpenAI API로 프롬프트 생성
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "당신은 육아, 창업, 비즈니스, 학습, 일상 등 다양한 주제의 실용적인 프롬프트를 생성하는 전문가입니다. 각 카테고리에 맞는 구체적이고 실용적인 프롬프트를 생성해주세요.",
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
          console.error(`No content generated for category: ${category}`);
          continue;
        }

        // Supabase에 저장할 데이터 준비
        const promptData = {
          prompt_id: template.id,
          prompt_title: `${category} - ${
            new Date().toISOString().split("T")[0]
          }`,
          prompt_content: template.prompt,
          prompt_category: category,
          prompt_difficulty: template.difficulty,
          prompt_tags: template.tags,
          ai_result: generatedContent,
          ai_model: "gpt-4",
          tokens_used: completion.usage?.total_tokens || 0,
        };

        // Supabase에 저장
        const { data, error } = await supabase
          .from("prompt_results")
          .insert([promptData])
          .select();

        if (error) {
          console.error(
            `Error saving to Supabase for category ${category}:`,
            error
          );
          results.push({
            category,
            success: false,
            error: error.message,
          });
        } else {
          console.log(
            `Successfully generated and saved prompt for category: ${category}`
          );
          results.push({
            category,
            success: true,
            data: data[0],
          });
        }

        // API 호출 간격 조절 (rate limiting 방지)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing category ${category}:`, error);
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
    console.error("Error in generate-prompts API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
