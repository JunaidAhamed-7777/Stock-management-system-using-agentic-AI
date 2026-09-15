export function Input({ label, hint, error, className = "", id, ...props }) {
  return (
    <div className="flex flex-col gap-space-2xs">
      {label ? (
        <label htmlFor={id} className="font-label-sm text-label-sm text-on-surface">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`w-full h-9 px-space-sm bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg outline-none transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 ${error ? "ring-2 ring-error" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="font-caption text-caption text-error">{error}</p> : null}
      {hint && !error ? <p className="font-caption text-caption text-on-surface-variant">{hint}</p> : null}
    </div>
  );
}

export function Textarea({ label, className = "", id, ...props }) {
  return (
    <div className="flex flex-col gap-space-2xs">
      {label ? (
        <label htmlFor={id} className="font-label-sm text-label-sm text-on-surface">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        className={`w-full min-h-[88px] px-space-sm py-space-sm bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg outline-none transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, className = "", id, ...props }) {
  return (
    <div className="flex flex-col gap-space-2xs">
      {label ? (
        <label htmlFor={id} className="font-label-sm text-label-sm text-on-surface">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        className={`w-full h-9 px-space-sm bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg outline-none appearance-none cursor-pointer focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
