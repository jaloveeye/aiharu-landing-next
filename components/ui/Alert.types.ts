import { ReactNode } from "react";

export type AlertVariant = "error" | "success" | "info";

export type AlertProps = {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
};
