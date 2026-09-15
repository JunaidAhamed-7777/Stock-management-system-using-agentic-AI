import { Icon } from "./Icon";

export function StatCard({ label, value, hint, icon, tone }) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between space-y-space-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex flex-col min-w-0">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">{label}</span>
          <span className={`font-headline-lg text-[26px] tabular-nums mt-1 font-mono-data font-bold ${tone === "danger" ? "text-error" : "text-on-surface"}`}>
            {value}
          </span>
        </div>
        {icon ? (
          <span className="w-8 h-8 rounded bg-surface-container-low text-secondary flex items-center justify-center shrink-0">
            <Icon name={icon} size={18} />
          </span>
        ) : null}
      </div>
      {hint ? <p className="font-body-sm text-body-sm text-outline">{hint}</p> : null}
    </div>
  );
}
