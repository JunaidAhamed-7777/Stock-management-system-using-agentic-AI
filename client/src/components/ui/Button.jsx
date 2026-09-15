const variants = {
  primary:
    "bg-secondary hover:bg-secondary/90 text-on-secondary shadow-sm",
  dark: "bg-primary hover:bg-primary-container text-on-primary shadow-sm",
  ghost:
    "bg-surface-container hover:bg-surface-container-high text-on-surface",
  outline:
    "bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant",
  danger: "bg-error hover:bg-error/90 text-on-error shadow-sm",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  loading,
  icon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`h-8 px-space-base rounded font-label-md text-label-md inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading ? <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> : icon}
      {children}
    </button>
  );
}
