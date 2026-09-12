import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../services/order.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const SupplierOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders();
        // Supplier sees all orders
        setOrders(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (orders.length === 0) {
    return <EmptyState
      title="No Orders Found"
      description="No orders found. Begin by adding products and receiving purchase orders."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Orders</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">PO #</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Order Date</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Destination Hub</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Total Value</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Items</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono-data text-on-surface font-semibold">
                    #PO-{order.id}
                  </td>
                  <td className="py-3 px-3">
                    {order.createdAt?.slice(0, 10) || "N/A"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 inline-flex text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {order.destinationHub || "N/A"}
                  </td>
                  <td className="py-3 px-3 font-mono-data tabular-nums">
                    ${order.total}
                  </td>
                  <td className="py-3 px-3">
                    {order.orderItems?.length || 0} items
                  </td>
                  <td className="py-3 px-3">
                    <Button
                      size="sm"
                      className="rounded-md px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                      type="button"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierOrdersPage;