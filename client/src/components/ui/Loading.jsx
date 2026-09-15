export function Loading({ label = "Loading telemetry…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-space-3xl gap-space-sm text-on-surface-variant">
      <span className="material-symbols-outlined animate-spin text-secondary text-[28px]">progress_activity</span>
      <p className="font-label-sm text-label-sm uppercase tracking-wider">{label}</p>
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-surface-container rounded ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-space-lg">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-base">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
