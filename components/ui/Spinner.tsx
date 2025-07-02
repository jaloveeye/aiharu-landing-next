import React from "react";

/**
 * 공통 Spinner(로딩) 컴포넌트
 * @param size - 크기(px)
 * @param color - tailwind 색상 클래스
 * @param className - 추가 클래스
 */
export default function Spinner({
  size = 24,
  color = "text-green-500",
  className = "",
  label = "로딩 중...",
}: {
  size?: number;
  color?: string;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`inline-block animate-spin ${color} ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </span>
  );
}
