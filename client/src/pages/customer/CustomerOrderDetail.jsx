import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrder } from "../../services/order.service";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, formatDate } from "../../utils/format";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { OrderStatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Loading } from "../../components/ui/Loading";
import { Button } from "../../components/ui/Button";

export function CustomerOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getOrder(id);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loading label="Loading order…" />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!order) return <ErrorState message="Order not found." />;

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Orders</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium font-mono-data">#{order.id}</span></>}
        title={`Order #${order.id}`}
        badge={<OrderStatusBadge status={order.status} />}
        actions={<Button variant="outline" onClick={() => navigate("/customer/orders")}>Back to orders</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <Card className="lg:col-span-4 p-space-xl space-y-space-sm font-body-sm">
          <div className="flex justify-between"><span className="text-on-surface-variant">Placed</span><span>{formatDate(order.createdAt)}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">Updated</span><span>{formatDate(order.updatedAt)}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">Customer</span><span>{order.customer?.name || "You"}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">Total</span><span className="font-mono-data">{formatCurrency(order.totalAmount)}</span></div>
        </Card>
        <Card className="lg:col-span-8">
          <Table
            rows={order.orderItems || []}
            empty={<EmptyState title="No line items" />}
            columns={[
              { key: "sku", header: "SKU", render: (row) => <span className="font-mono-data">{row.product?.sku}</span> },
              { key: "name", header: "Product", render: (row) => row.product?.name },
              { key: "quantity", header: "Qty", align: "right" },
              { key: "price", header: "Unit", align: "right", render: (row) => formatCurrency(row.price) },
              { key: "line", header: "Line", align: "right", render: (row) => formatCurrency(row.price * row.quantity) },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
