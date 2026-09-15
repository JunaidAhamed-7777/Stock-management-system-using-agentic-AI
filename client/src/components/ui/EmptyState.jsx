import { Icon } from "./Icon";
import { Button } from "./Button";

export function EmptyState({ icon = "inbox", title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-space-3xl px-space-lg gap-space-sm">
      <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
      {description ? <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">{description}</p> : null}
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
