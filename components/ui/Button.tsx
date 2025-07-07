import {
  ButtonOrAnchorProps,
  Variant,
  ButtonProps,
  AnchorProps,
} from "./Button.types";
import React from "react";

const BASE_CLASS =
  "px-8 py-3 rounded-full text-white text-lg font-semibold shadow-sm transition-colors";
const COLOR_CLASS: Record<Variant, string> = {
  primary: "bg-green-500 hover:bg-green-400",
  secondary: "bg-yellow-400 hover:bg-yellow-300",
};

export default function Button(props: ButtonOrAnchorProps) {
  const {
    as = "button",
    children,
    className = "",
    variant = "primary",
    "aria-label": ariaLabel,
    ...rest
  } = props;
  const base = BASE_CLASS;
  const color = COLOR_CLASS[variant];
  if (as === "a") {
    const anchorProps = rest as AnchorProps;
    return (
      <a
        className={`${base} ${color} !text-white ${className}`}
        aria-label={ariaLabel}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }
  const buttonProps = rest as ButtonProps;
  return (
    <button
      className={`${base} ${color} ${className}`}
      aria-label={ariaLabel}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
