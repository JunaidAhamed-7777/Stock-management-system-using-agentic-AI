import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input, Textarea } from "./ui/Input";
import { adjustStock } from "../services/stock.service";
import { getErrorMessage } from "../utils/errors";

export function StockAdjustModal({ product, open, onClose, onAdjusted }) {
  const [quantityChange, setQuantityChange] = useState("0");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!product) return null;

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await adjustStock({
        productId: product.id,
        quantityChange: Number(quantityChange),
        reason: reason.trim() || undefined,
      });
      onAdjusted?.(result);
      onClose();
      setQuantityChange("0");
      setReason("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={`Adjust stock · ${product.sku}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={onSubmit}>Apply adjustment</Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-space-md">
        <p className="font-body-sm text-on-surface-variant">
          Current on-hand quantity for {product.name}: <span className="font-mono-data text-on-surface">{product.quantity}</span>
        </p>
        <Input
          id="quantityChange"
          label="Quantity change"
          hint="Use a positive number to receive stock, or a negative number to issue stock."
          type="number"
          step="1"
          value={quantityChange}
          onChange={(e) => setQuantityChange(e.target.value)}
          required
        />
        <Textarea id="reason" label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        {error ? <p className="font-caption text-caption text-error">{error}</p> : null}
      </form>
    </Modal>
  );
}
