import React from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionOnClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionOnClick,
  icon: Icon,
  className,
}) => {
  return (
    <div
      className="
        text-center
        py-12
        color-slate-500
        {className ? ` ${className}` : ""}
      "
    >
      {Icon || (
        <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-slate-100 flex items-center justify-center">
          <svg
            className="h-6 w-6 text-slate-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M20 4H7.8l5.1 5.3L2 18l-1.4 1.5L20 4zm-8.4 6.6l1.4 1.5L7 13l-1.4 1.5L12 20l1.4 1.5L17 13l-1.4 1.5L12 7z"
            />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {actionLabel && (
        <button
          onClick={actionOnClick}
          className="
            mt-4
            rounded-md
            px-3
            py-2
            text-sm
            font-medium
            text-primary-600
            hover:bg-primary-50
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};