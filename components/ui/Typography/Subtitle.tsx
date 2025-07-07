import { ReactNode } from "react";

export function Subtitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-lg font-semibold text-secondary ${className}`}>
      {children}
    </h2>
  );
}
