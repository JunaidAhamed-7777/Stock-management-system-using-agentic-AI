import { useEffect } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";

export function Modal({ open, title, children, onClose, footer, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-space-lg">
      <button className="absolute inset-0 bg-on-surface/40" aria-label="Close dialog" onClick={onClose} type="button" />
      <div className={`relative w-full ${wide ? "max-w-3xl" : "max-w-lg"} bg-surface-container-lowest rounded-xl shadow-xl max-h-[90vh] overflow-auto`}>
        <div className="flex items-center justify-between px-space-lg py-space-base border-b border-outline-variant">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <Icon name="close" />
          </button>
        </div>
        <div className="p-space-lg">{children}</div>
        {footer ? <div className="px-space-lg py-space-base border-t border-outline-variant flex justify-end gap-space-sm">{footer}</div> : null}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title, message, confirmLabel = "Confirm", danger, loading, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="font-body-sm text-body-sm text-on-surface-variant">{message}</p>
    </Modal>
  );
}
