import { useEffect, useState } from "react";
import { getOrder, listOrders, updateOrderStatus } from "../../services/order.service";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, formatDate } from "../../utils/format";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { OrderStatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageSkeleton } from "../../components/ui/Loading";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrdersPage({ title, description, canUpdateStatus }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setOrders(await listOrders());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function openOrder(row) {
    setSelected(row);
    setDetail(null);
    try {
      const full = await getOrder(row.id);
      setDetail(full);
      setStatus(full.status);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function saveStatus() {
    setSaving(true);
    try {
      const updated = await updateOrderStatus(detail.id, status);
      setDetail(updated);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Fulfillment</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">Orders</span></>}
        title={title}
        description={description}
      />
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      <Card>
        <Table
          rows={orders}
          onRowClick={openOrder}
          empty={<EmptyState icon="receipt_long" title="No orders yet" />}
          columns={[
            { key: "id", header: "Order", render: (row) => <span className="font-mono-data">#{row.id}</span> },
            { key: "customer", header: "Customer", render: (row) => row.customer?.name || row.customer?.email || "—" },
            { key: "createdAt", header: "Created", render: (row) => formatDate(row.createdAt) },
            { key: "totalAmount", header: "Total", align: "right", render: (row) => formatCurrency(row.totalAmount) },
            { key: "status", header: "Status", render: (row) => <OrderStatusBadge status={row.status} /> },
            { key: "actions", header: "", render: (row) => <Button variant="outline" onClick={() => openOrder(row)}>View</Button> },
          ]}
        />
      </Card>
      <Modal
        open={Boolean(selected)}
        title={detail ? `Order #${detail.id}` : "Order detail"}
        onClose={() => { setSelected(null); setDetail(null); }}
        wide
        footer={
          canUpdateStatus && detail ? (
            <>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
              <Button loading={saving} onClick={saveStatus}>Update status</Button>
            </>
          ) : null
        }
      >
        {!detail ? <p className="font-body-sm">Loading order…</p> : (
          <div className="space-y-space-md">
            <div className="grid grid-cols-2 gap-space-sm font-body-sm">
              <div>Status: <OrderStatusBadge status={detail.status} /></div>
              <div>Total: {formatCurrency(detail.totalAmount)}</div>
              <div>Customer: {detail.customer?.name} ({detail.customer?.email})</div>
              <div>Created: {formatDate(detail.createdAt)}</div>
            </div>
            <Table
              rows={detail.orderItems || []}
              rowKey="id"
              empty={<EmptyState title="No line items" />}
              columns={[
                { key: "sku", header: "SKU", render: (row) => <span className="font-mono-data">{row.product?.sku}</span> },
                { key: "name", header: "Product", render: (row) => row.product?.name },
                { key: "quantity", header: "Qty", align: "right" },
                { key: "price", header: "Unit", align: "right", render: (row) => formatCurrency(row.price) },
                { key: "line", header: "Line", align: "right", render: (row) => formatCurrency(row.price * row.quantity) },
              ]}
            />
          </div>
        )}
      </Modal>
    </>
  );
}

export function AdminOrders() {
  return (
    <OrdersPage
      title="Sales Orders & Dispatch"
      description="All customer orders. Status updates are written through PATCH /api/orders/:id/status."
      canUpdateStatus
    />
  );
}
