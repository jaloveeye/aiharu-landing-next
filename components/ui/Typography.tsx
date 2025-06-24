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
