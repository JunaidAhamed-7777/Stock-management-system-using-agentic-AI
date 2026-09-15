import { useEffect, useMemo, useState } from "react";
import { listOrders } from "../../services/order.service";
import { getDashboard } from "../../services/dashboard.service";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, formatDate } from "../../utils/format";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageSkeleton } from "../../components/ui/Loading";
import { StatCard } from "../../components/ui/StatCard";

export function AdminCustomers() {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [dash, rows] = await Promise.all([getDashboard(), listOrders()]);
      setMetrics(dash.metrics);
      setOrders(rows || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const customers = useMemo(() => {
    const map = new Map();
    for (const order of orders) {
      const customer = order.customer;
      if (!customer?.id) continue;
      const current = map.get(customer.id) || {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        orderCount: 0,
        spend: 0,
        lastOrderAt: null,
      };
      current.orderCount += 1;
      current.spend += Number(order.totalAmount || 0);
      if (!current.lastOrderAt || new Date(order.createdAt) > new Date(current.lastOrderAt)) {
        current.lastOrderAt = order.createdAt;
      }
      map.set(customer.id, current);
    }
    return Array.from(map.values());
  }, [orders]);

  if (loading) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        breadcrumb={<><span>Sales</span><span className="text-outline-variant">/</span><span className="text-secondary font-medium">Customers</span></>}
        title="Customer Directory"
        description="There is no dedicated customer-list endpoint. This directory is assembled from customers attached to orders, while the dashboard reports the full customer count."
      />
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-space-base">
        <StatCard label="Registered customers" value={metrics?.totalCustomers ?? 0} hint="From dashboard metrics" icon="groups" />
        <StatCard label="Customers with orders" value={customers.length} hint="Derived from the orders API" icon="receipt_long" />
      </section>
      <Card>
        <Table
          rows={customers}
          empty={<EmptyState icon="groups" title="No customers with recorded orders" description="Registered customers appear in the metric above once they place an order." />}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "orderCount", header: "Orders", align: "right" },
            { key: "spend", header: "Spend", align: "right", render: (row) => formatCurrency(row.spend) },
            { key: "lastOrderAt", header: "Last order", render: (row) => formatDate(row.lastOrderAt) },
          ]}
        />
      </Card>
    </>
  );
}
