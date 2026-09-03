import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/api/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Orders</h2>
        
        {loading ? (
          <div className="animate-pulse rounded bg-gray-200 h-64 w-full mx-auto"></div>
        ) : (
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
        )}

        {!loading && orders.length === 0 ? (
          <p className="text-gray-500 mt-4">No orders found</p>
        ) : null}
      </div>
    </div>
  );
};

export default OrdersPage;