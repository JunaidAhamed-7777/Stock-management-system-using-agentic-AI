import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../services/order.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders();
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
      description="You haven't placed any orders yet."
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
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Order #</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Total</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3">{order.id}</td>
                  <td className="py-3 px-3">{order.createdAt?.slice(0, 10) || "N/A"}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 inline-flex text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">${order.totalAmount}</td>
                  <td className="py-3 px-3">{order.orderItems?.length || 0} items</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && orders.length === 0 ? (
          <p className="text-gray-500 mt-4">No orders found</p>
        ) : null}
      </div>
    </div>
  );
};

export default OrdersPage;