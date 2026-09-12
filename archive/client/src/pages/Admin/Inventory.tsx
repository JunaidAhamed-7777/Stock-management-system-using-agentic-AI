import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getLowStockProducts, getStockTransactions } from "../../services/stock.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const AdminInventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lowStockRes, transactionsRes] = await Promise.all([
          getLowStockProducts(),
          getStockTransactions(),
        ]);
        setLowStockProducts(lowStockRes);
        setLowStockProducts(lowStockRes);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch inventory data");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading inventory data...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (lowStockProducts.length === 0) {
    return <EmptyState
      title="No Inventory Data"
      description="No inventory data found."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Low Stock Products</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {lowStockProducts.map((product: any) => (
            <div key={product.id} className="p-4 border rounded">
              <h4 className="font-medium text-sm text-gray-500">{product.name}</h4>
              <p className="text-xs text-gray-500">{product.sku}</p>
              <p className="text-primary-600 font-medium text-sm">
                {product.quantity} in stock • Threshold: {product.lowStockThreshold}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow mt-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Stock Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Quantity</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Reason</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder - would use actual transaction data from backend */}
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 5).map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 text-xs text-gray-500">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="info">IN</Badge>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {product.name}
                    </td>
                    <td className="py-3 px-3 text-center text-primary-600 font-medium">
                      {product.quantity}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">
                      Manual adjustment
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-3" colSpan={5}>
                    <p className="text-gray-500 text-center">No stock transactions</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryPage;