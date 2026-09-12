import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStockTransactions } from "../../services/stock.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const AdminStockTransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await getStockTransactions();
        setTransactions(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch stock transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading stock transactions...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (transactions.length === 0) {
    return <EmptyState
      title="No Stock Transactions"
      description="No stock transactions found in the system."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
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
              {transactions.map((transaction: any) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="info" size="sm">
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">
                    {transaction.product?.name || "N/A"}
                  </td>
                  <td className="py-3 px-3 text-center text-primary-600 font-medium">
                    {transaction.quantity}
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-500">
                    {transaction.reason || "N/A"}
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

export default AdminStockTransactionsPage;