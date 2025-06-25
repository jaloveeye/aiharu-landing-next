import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  as?: "button";
  variant?: Variant;
};
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  as: "a";
  variant?: Variant;
};

type Props = ButtonProps | AnchorProps;

export default function Button(props: Props) {
  const {
    as = "button",
    children,
    className = "",
    variant = "primary",
    ...rest
  } = props as any;
  const base =
    "px-8 py-3 rounded-full text-white text-lg font-semibold shadow-sm transition-colors";
  const color =
    variant === "primary"
      ? "bg-green-500 hover:bg-green-400"
      : "bg-yellow-400 hover:bg-yellow-300";
  if (as === "a") {
    return (
      <a className={`${base} ${color} !text-white ${className}`} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={`${base} ${color} ${className}`} {...rest}>
      {children}
    </button>
  );
}
