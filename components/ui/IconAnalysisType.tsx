import React from "react";

export function ImageIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="12"
        rx="2"
        strokeWidth="2"
        stroke="currentColor"
      />
      <circle cx="8.5" cy="12.5" r="1.5" fill="currentColor" />
      <path
        d="M21 19l-5.5-7-4.5 6-3-4-4 5"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
}

export function TextIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        strokeWidth="2"
        stroke="currentColor"
      />
      <line
        x1="8"
        y1="8"
        x2="16"
        y2="8"
        strokeWidth="2"
        stroke="currentColor"
      />
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="12"
        strokeWidth="2"
        stroke="currentColor"
      />
      <line
        x1="8"
        y1="16"
        x2="12"
        y2="16"
        strokeWidth="2"
        stroke="currentColor"
      />
    </svg>
  );
}
