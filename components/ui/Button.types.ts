import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

export type Variant = 
  | "primary" 
  | "secondary" 
  | "accent"
  | "outline"
  | "ghost"
  | "destructive";

export type Size = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  "aria-label"?: string;
}

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  "aria-label"?: string;
}

export type ButtonOrAnchorProps = ButtonProps | AnchorProps;
