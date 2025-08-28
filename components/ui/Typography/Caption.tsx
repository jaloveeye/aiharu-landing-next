import { ReactNode, CSSProperties } from "react";

export function Caption({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`text-xs text-yellow-700 ${className}`} style={style}>{children}</span>
  );
}
