import React from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  children,
  type = "button",
}) => {
  const baseClasses = `
    rounded-md
    px-3
    py-2
    text-sm
    font-medium
    transition-colors
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    disabled:opacity-50
    disabled:cursor-not-allowed
 `;

  const variantClasses = {
    primary: `
      bg-primary-600
      hover:bg-primary-700
      text-white
      focus:ring-primary-500
      focus:ring-offset-primary-500
    `,
    secondary: `
      bg-white
      hover:bg-slate-50
      border
      border-slate-300
      text-slate-900
      focus:border-primary-600
      focus:ring-primary-500
      focus:ring-offset-primary-500
    `,
    danger: `
      bg-red-600
      hover:bg-red-700
      text-white
      focus:ring-red-500
      focus:ring-offset-red-500
    `,
    info: `
      bg-blue-600
      hover:bg-blue-700
      text-white
      focus:ring-blue-500
      focus:ring-offset-blue-500
    `,
  };

  const sizeClasses = {
    sm: "py-1.5 px-2 text-sm",
    md: "py-2 px-4 text-sm",
    lg: "py-3 px-6 text-base",
  };

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className ? className : ""}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};