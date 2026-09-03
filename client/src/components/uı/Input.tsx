import React from "react";

export interface InputProps {
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  required,
  disabled,
  className,
  value,
  onChange,
}) => {
  const baseClasses = `
    block
    w-full
    rounded-md
    border-border-default
    shadow-sm
    focus:border-primary-600
    focus:ring-1
    focus:ring-primary-500
    bg-white
    py-2
    px-3
    text-sm
    text-slate-700
    outline-none
    transition-colors
    ${required ? "required" : ""}
  `;

  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={className}
      value={value}
      onChange={onChange}
    />
  );
};