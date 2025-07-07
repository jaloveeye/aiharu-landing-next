import { ReactNode } from "react";

export function Title({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`text-4xl sm:text-6xl font-bold text-gray-800 text-center ${className}`}
    >
      {children}
    </h1>
  );
}
