import { ReactNode, CSSProperties } from "react";

export function Body({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      className={`text-lg sm:text-2xl text-gray-800 text-center max-w-xl mt-2 ${className}`}
      style={style}
    >
      {children}
    </p>
  );
}
