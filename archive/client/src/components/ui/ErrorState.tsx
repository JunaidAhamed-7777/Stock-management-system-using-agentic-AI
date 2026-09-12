import React from "react";

export interface ErrorStateProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  retryLabel = "Retry",
  onRetry,
  className,
}) => {
  return (
    <div
      className="
        bg-red-50
        border
        border-red-200
        rounded-lg
        p-6
        color-red-800
        {className ? ` ${className}` : ""}
      "
    >
      <p className="text-sm font-medium mb-2">{message}</p>
      {retryLabel && onRetry && (
        <button
          onClick={onRetry}
          className="
            mt-4
            w-full
            rounded-md
            px-3
            py-2
            text-sm
            font-medium
            text-primary-600
            hover:bg-primary-50
          "
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};