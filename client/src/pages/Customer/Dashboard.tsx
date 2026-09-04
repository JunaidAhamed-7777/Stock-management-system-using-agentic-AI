import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../services/order.service";
import { getLowStockProducts } from "../../services/stock.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";
import { Table, TableHeadCell, TableRow } from "../../components/ui/Table";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, lowStockRes] = await Promise.all([
          getOrders(),
          getLowStockProducts(),
        ]);
        setOrders(ordersRes);
        setLowStock(lowStockRes);
        // Build simple stats
        setStats({
          totalProducts: lowStockRes.length + 100, // placeholder
          totalStock: 50000, // placeholder
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Loading className="p-8" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!orders.length && !lowStock.length) {
    return <EmptyState
      title="No Data"
      description="No orders or low-stock products found."
    />;
  }

  return (
    <div className="p-space-lg">
      <div className="bg-white rounded-lg p-space-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-500 mb-4 space-y-1">Dashboard</h3>
        <div className="grid grid-cols-1 gap-space-base md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold tabular-nums">{stats?.totalProducts}</p>
            <p className="text-text-subtle">Total Products</p>
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums">{stats?.totalStock}</p>
            <p className="text-text-subtle">Total Stock</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-space-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-500 mb-4 space-y-1">Recent Orders</h3>
        <TableHeadCell label="Order #" />
        <TableHeadCell label="Date" />
        <TableHeadCell label="Status" />
        <TableHeadCell label="Total" />
        <TableHeadCell label="Items" />
        {orders.map((order: any) => (
          <TableRow
            key={order.id}
            cells={[
              order.id,
              order.createdAt?.slice(0, 10) || "N/A",
              <span className="px-2 inline-flex text-xs font-medium rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                {order.status}
              </span>,
              `$${order.totalAmount}`,
              `${order.orderItems?.length || 0} items`,
            ]}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg p-space-lg shadow">
        <h3 className="text-lg font-medium text-gray-500 mb-4 space-y-1">Low Stock Alerts</h3>
        {lowStock.length === 0 ? (
          <p className="text-text-subtle">No low-stock products</p>
        ) : (
          <TableHeadCell label="Product" />
        )}
        {lowStock.map((product: any) => (
          <div key={product.id} className="p-space-base border rounded">
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-text-subtle">{product.sku}</p>
            <p className="text-text-subtle">{product.quantity} in stock</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;