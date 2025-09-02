import {
  ButtonOrAnchorProps,
  Variant,
  ButtonProps,
  AnchorProps,
  Size,
} from "./Button.types";
import React from "react";

const BASE_CLASS =
  "px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer !important";

const COLOR_CLASS: Record<Variant, string> = {
  primary: "btn-primary hover:shadow-strong focus:ring-primary",
  secondary: "btn-secondary hover:shadow-strong focus:ring-secondary",
  accent: "btn-accent hover:shadow-strong focus:ring-accent",
  outline: "btn-outline hover:shadow-strong focus:ring-primary",
  ghost: "btn-ghost hover:shadow-soft",
  destructive: "btn-destructive hover:bg-error/90 focus:ring-error",
};

const SIZE_CLASS = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl",
};

interface ButtonComponentProps {
  as?: "button" | "a";
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  "aria-label"?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button(props: ButtonComponentProps) {
  const {
    as = "button",
    children,
    className = "",
    variant = "primary",
    size = "md",
    "aria-label": ariaLabel,
    disabled,
    style,
    ...rest
  } = props;

  const base = BASE_CLASS;
  const color = COLOR_CLASS[variant];
  const sizeClass = SIZE_CLASS[size];

  const combinedClassName = `${base} ${color} ${sizeClass} ${className}`.trim();

  if (as === "a") {
    const { href, target, rel, ...anchorProps } = rest;
    return (
      <a
        className={combinedClassName}
        aria-label={ariaLabel}
        href={href}
        target={target}
        rel={rel}
        style={style}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const { type = "button", onClick, ...buttonProps } = rest;
  return (
    <button
      className={combinedClassName}
      aria-label={ariaLabel}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
