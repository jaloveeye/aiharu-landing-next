"use client";

import { Title, Body } from "@/components/ui/Typography";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/iharu"
            className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
          >
            ← 아이하루로 돌아가기
          </Link>
        </div>

        <div className="text-center mb-8">
          <Title>성장 리포트</Title>
          <Body>최근 활동과 성과를 한눈에 확인해요</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">주간 요약</h3>
            <p className="text-gray-700 text-sm">
              이번 주 완료한 습관, 최고 스트릭, 포인트 변동을 요약해 보여줄
              예정이에요.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              카테고리별 분포
            </h3>
            <p className="text-gray-700 text-sm">
              습관 카테고리, 활동 비중 등의 시각화가 들어갈 예정이에요.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-3">타임라인</h3>
            <p className="text-gray-700 text-sm">
              최근 30일 동안의 활동 타임라인을 표시할 예정이에요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
