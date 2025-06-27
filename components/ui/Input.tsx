import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`border rounded p-2 text-gray-800 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

export default Input;
