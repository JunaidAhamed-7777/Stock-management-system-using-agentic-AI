import React from "react";

export interface BadgeProps {
  variant:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "draft"
    | "neutral";
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  className,
  children,
}) => {
  const badgeClasses = `
    inline-flex
    align-middle
    rounded-full
    px-2.5
    py-0.5
    text-xs
    font-medium
    gap-1.5
    border
  `;

  const variantStyles = {
    success: {
      bg: "success-bg",
      border: "success-border",
      text: "success-text",
    },
    warning: {
      bg: "warning-bg",
      border: "warning-border",
      text: "warning-text",
    },
    danger: {
      bg: "danger-bg",
      border: "danger-border",
      text: "danger-text",
    },
    info: {
      bg: "info-bg",
      border: "info-border",
      text: "info-text",
    },
    draft: {
      bg: "draft-bg",
      border: "draft-border",
      text: "draft-text",
    },
    neutral: {
      bg: "surface-subtle",
      border: "border-subtle",
      text: "text-slate-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <span
      className="
        {badgeClasses}
        bg-{styles.bg}
        border-{styles.border}
        text-{styles.text}
      "
      {...(className ? { className } : {})}
    >
      {children}
    </span>
  );
};