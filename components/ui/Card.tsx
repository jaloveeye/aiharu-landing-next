import { ReactNode } from "react";
import { CardProps } from "./Card.types";

const BASE_CLASS = "bg-white rounded-lg shadow p-4";

export default function Card({
  children,
  className = "",
  "aria-label": ariaLabel,
}: CardProps) {
  return (
    <div
      className={`${BASE_CLASS} ${className}`}
      role="region"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
