import { ReactNode } from "react";

export function Caption({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`text-xs text-yellow-700 ${className}`}>{children}</span>
  );
}
