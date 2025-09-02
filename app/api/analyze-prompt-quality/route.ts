import { NextRequest, NextResponse } from "next/server";
import { analyzePromptQuality, getQualityGrade, generateQualitySuggestions } from "@/app/utils/promptQualityAnalyzer";

export async function POST(request: NextRequest) {
  try {
    const { promptContent, aiResult, category, tokensUsed } = await request.json();

    if (!promptContent || !aiResult || !category) {
      return NextResponse.json(
        { error: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 품질 분석 수행
    const qualityMetrics = analyzePromptQuality(
      promptContent,
      aiResult,
      category,
      tokensUsed || 0
    );

    const qualityGrade = getQualityGrade(qualityMetrics.overallScore);
    const qualitySuggestions = generateQualitySuggestions(qualityMetrics, category);

    return NextResponse.json({
      success: true,
      quality_metrics: qualityMetrics,
      quality_grade: qualityGrade,
      quality_suggestions: qualitySuggestions,
      analysis_summary: {
        overall_score: qualityMetrics.overallScore,
        grade: qualityGrade,
        strengths: getStrengths(qualityMetrics),
        areas_for_improvement: qualitySuggestions,
        category_performance: {
          structure: `${qualityMetrics.structureScore}/100`,
          expertise: `${qualityMetrics.expertiseScore}/100`,
          context: `${qualityMetrics.contextScore}/100`,
          practicality: `${qualityMetrics.practicalityScore}/100`
        }
      }
    });

  } catch (error) {
    console.error("품질 분석 오류:", error);
    return NextResponse.json(
      { error: "품질 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 강점 분석
function getStrengths(metrics: any): string[] {
  const strengths: string[] = [];
  
  if (metrics.structureScore >= 80) {
    strengths.push("체계적이고 구조화된 답변 구성");
  }
  
  if (metrics.expertiseScore >= 80) {
    strengths.push("높은 수준의 전문성과 깊이");
  }
  
  if (metrics.contextScore >= 80) {
    strengths.push("질문과 답변의 높은 연관성");
  }
  
  if (metrics.practicalityScore >= 80) {
    strengths.push("실용적이고 실행 가능한 구체적 방법 제시");
  }
  
  if (metrics.details.hasStepByStep) {
    strengths.push("단계별 가이드 제공");
  }
  
  if (metrics.details.hasWarnings) {
    strengths.push("주의사항 및 경고 포함");
  }
  
  if (metrics.details.hasAlternatives) {
    strengths.push("대안 및 추가 고려사항 제시");
  }
  
  if (strengths.length === 0) {
    strengths.push("기본적인 답변 구조 유지");
  }
  
  return strengths;
}
