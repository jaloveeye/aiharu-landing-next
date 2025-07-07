import { ReactNode } from "react";

export function Body({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-lg sm:text-2xl text-gray-800 text-center max-w-xl mt-2 ${className}`}
    >
      {children}
    </p>
  );
}
