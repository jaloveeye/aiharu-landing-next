import { ReactNode, CSSProperties } from "react";

export function Subtitle({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <h2
      className={`text-lg font-semibold text-secondary ${className}`}
      style={style}
    >
      {children}
    </h2>
  );
}
