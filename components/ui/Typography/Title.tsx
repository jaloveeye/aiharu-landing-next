import { ReactNode, CSSProperties } from "react";

export function Title({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <h1
      className={`text-4xl sm:text-6xl font-bold text-gray-800 text-center ${className}`}
      style={style}
    >
      {children}
    </h1>
  );
}
