import { forwardRef } from "react";
import { InputProps } from "./Input.types";

const BASE_CLASS = "border rounded p-2 text-gray-800";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`${BASE_CLASS} ${className}`} {...props} />
  )
);
Input.displayName = "Input";

export default Input;
