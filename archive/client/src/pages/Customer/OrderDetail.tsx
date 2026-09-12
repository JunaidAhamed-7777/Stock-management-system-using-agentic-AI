import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrderById } from "../../services/order.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await getOrderById(Number(id));
        setOrder(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order");
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading || !order) {
    return <div className="p-8">Loading order...</div>;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-medium text-gray-500 mb-4">Order # {order.id}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-medium">{order.createdAt?.slice(0, 10) || "N/A"}</p>
            <p className="text-sm text-gray-500">Customer ID</p>
            <p className={order.customerId === user?.userId ? "font-medium" : "text-gray-500"}>
              {order.customerId === user?.userId ? "Your order" : `Customer ${order.customerId}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p>
              <span className="px-2 inline-flex text-xs font-medium rounded-full bg-green-100 text-green-800">
                {order.status}
              </span>
            </p>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium">${order.totalAmount}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">Items:</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Qty</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Price</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems?.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3">{item.productName || item.product?.name || "N/A"}</td>
                  <td className="py-3 px-3">{item.quantity}</td>
                  <td className="py-3 px-3">${item.price}</td>
                  <td className="py-3 px-3">{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;