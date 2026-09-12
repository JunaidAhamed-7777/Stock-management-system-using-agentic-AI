import React from "react";

export const Loading: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        min-h-[200px]
        bg-white
        rounded-lg
        shadow-sm
        {className ? ` ${className}` : ""}
      "
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  );
};