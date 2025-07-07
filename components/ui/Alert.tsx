import React from "react";
import clsx from "clsx";
import { AlertProps, AlertVariant } from "./Alert.types";

const BASE_CLASS =
  "rounded px-4 py-2 text-center text-sm font-medium border mt-2";
const COLOR_CLASS: Record<AlertVariant, string> = {
  error: "bg-red-50 text-red-600 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

/**
 * 공통 Alert 컴포넌트
 * @param variant - 'error' | 'success' | 'info'
 * @param children - 표시할 메시지
 * @param className - 추가 클래스
 */
export default function Alert({
  variant = "info",
  children,
  className = "",
}: AlertProps) {
  const base = BASE_CLASS;
  const color = COLOR_CLASS[variant];
  return (
    <div
      className={clsx(base, color, className)}
      role="alert"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
