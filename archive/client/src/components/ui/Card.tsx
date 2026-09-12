import React from "react";

export interface CardProps {
  className?: string;
  shadow?: "none" | "hover" | "md" | "xl";
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  shadow = "none",
  children,
}) => {
  const shadowClasses = {
    none: "shadow-none",
    hover: "shadow-sm",
    md: "shadow-md",
    xl: "shadow-xl",
  };

  return (
    <div
      className="
        bg-white
        rounded-lg
        p-4
        shadow-{shadowClasses[shadow]}
        border
        border-slate-200
        transition-shadow
        {className ? ` ${className}` : ""}
      "
    >
      {children}
    </div>
  );
};