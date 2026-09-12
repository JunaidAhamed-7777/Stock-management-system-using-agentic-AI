import React from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  className,
}) => {
  return (
    <header className="
      border-b
      border-border-subtle
      pb-4
      mb-6
    ">
      <h2 className="
        text-2xl
        font-bold
        text-slate-900
        mb-1
      ">
        {title}
      </h2>
      {subtitle && (
        <p className="
          text-sm
          text-slate-500
        ">
          {subtitle}
        </p>
      )}
    </header>
  );
};