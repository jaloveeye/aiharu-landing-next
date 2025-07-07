import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import sharp from "sharp";
import { requireEnv } from "@/app/utils/checkEnv";
import { apiError } from "@/app/utils/apiError";

const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });

export async function POST(req: NextRequest) {
  try {
    let imageBase64 = "";
    // 1. Try to get image from multipart/form-data (file upload)
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: "파일이 없습니다." },
          { status: 400 }
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      const originalBuffer = Buffer.from(arrayBuffer);
      const resizedImageBuffer = await sharp(originalBuffer)
        .resize({ width: 512 })
        .jpeg({ quality: 80 })
        .toBuffer();
      imageBase64 = resizedImageBuffer.toString("base64");
    } else {
      // 2. Fallback: 기존 JSON 방식 지원
      const body = await req.json();
      imageBase64 = body.imageBase64;
      if (!imageBase64) {
        return NextResponse.json(
          { error: "imageBase64 is required" },
          { status: 400 }
        );
      }
    }
    const systemPrompt = "당신은 식사 영양사입니다.";
    const userPrompt = `이미지 속 음식 구성을 간단히 분석해 주세요. 사람은 없거나 무시해주세요.`;
    // Step 1: 음식 구성 추출
    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
      temperature: 0.7,
    });
    const foodSummary = chat.choices[0].message.content || "";
    // Step 2: 초등학교 1학년 식단 평가
    const systemPrompt2 =
      "당신은 아동 식사 영양사입니다. 아래 식단이 초등학교 1학년 아동의 아침 식사로 충분한지 평가하고, 부족하다면 보완할 점을 알려주세요.";
    const userPrompt2 = `식단: ${foodSummary}\n1. 각 항목별 예상 영양소(열량, 단백질, 탄수화물, 지방 등)를 표로 정리\n2. 전체 식단의 영양 균형 평가 및 2~3줄 보완/추천`;
    const chat2 = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt2 },
        { role: "user", content: userPrompt2 },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({
      result: chat2.choices[0].message.content || "",
    });
  } catch (error: any) {
    return apiError({
      error,
      userMessage:
        "이미지 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}
