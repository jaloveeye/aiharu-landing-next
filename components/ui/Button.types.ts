import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

export type Variant = "primary" | "secondary";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  as?: "button";
  variant?: Variant;
};
export type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  as: "a";
  variant?: Variant;
};

export type ButtonOrAnchorProps = ButtonProps | AnchorProps;
