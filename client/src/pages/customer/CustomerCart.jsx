import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/order.service";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency } from "../../utils/format";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";

export function CustomerCart() {
  const { items, updateQuantity, removeItem, clear, subtotal } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function checkout() {
    setSaving(true);
    setError("");
    try {
      const order = await createOrder(items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
      clear();
      navigate(`/customer/orders/${order.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Procurement</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">Wholesale checkout</span></>}
        title="Cart & Dispatch Checkout"
        description="Checkout submits POST /api/orders with the current cart lines. Success is only shown after the API accepts the order."
      />
      {error ? <ErrorState message={error} /> : null}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <Card className="lg:col-span-8">
          <Table
            rows={items}
            rowKey="productId"
            empty={<EmptyState icon="shopping_cart" title="Your cart is empty" description="Add products from the catalog to build an order." actionLabel="Browse catalog" onAction={() => navigate("/customer/products")} />}
            columns={[
              { key: "sku", header: "SKU", render: (row) => <span className="font-mono-data">{row.sku}</span> },
              { key: "name", header: "Product" },
              { key: "price", header: "Unit", align: "right", render: (row) => formatCurrency(row.price) },
              {
                key: "quantity",
                header: "Qty",
                render: (row) => (
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => updateQuantity(row.productId, Number(e.target.value))}
                    className="w-20 h-8 px-space-xs bg-surface-container-low rounded font-mono-data"
                  />
                ),
              },
              { key: "line", header: "Line", align: "right", render: (row) => formatCurrency(row.price * row.quantity) },
              { key: "actions", header: "", render: (row) => <Button variant="danger" onClick={() => removeItem(row.productId)}>Remove</Button> },
            ]}
          />
        </Card>
        <Card className="lg:col-span-4 p-space-xl space-y-space-md h-fit">
          <h2 className="font-headline-sm">Order summary</h2>
          <div className="flex justify-between font-body-sm"><span>Subtotal</span><span className="font-mono-data">{formatCurrency(subtotal)}</span></div>
          <p className="font-caption text-on-surface-variant">Tax and freight are not calculated by the backend. The submitted total is unit price × quantity.</p>
          <Button className="w-full" disabled={items.length === 0} loading={saving} onClick={checkout}>Place order</Button>
        </Card>
      </div>
    </>
  );
}
