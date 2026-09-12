import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getLowStockProducts, getStockTransactions } from "../../services/stock.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";
import { Table, TableHeadCell, TableRow } from "../../components/ui/Table";

const SupplierStockPage: React.FC = () => {
  const { user } = useAuth();
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [stockTransactions, setStockTransactions] = useState<any[]>([]);
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
        setStockTransactions(transactionsRes);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch stock data");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading stock data...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (lowStockProducts.length === 0 && stockTransactions.length === 0) {
    return <EmptyState
      title="No Stock Data"
      description="No low-stock products or stock transactions found."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Stock Management</h2>

        {/* Low Stock Products */}
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">
            Low Stock Alerts
          </h3>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500">No low-stock products</p>
          ) : (
            <TableHeadCell label="Product" /> // simplified placeholder
          )}
          {lowStockProducts.map((product: any) => (
            <div key={product.id} className="p-3 border rounded">
              <h4 className="font-sm text-gray-500">{product.name}</h4>
              <p className="text-xs text-gray-400">{product.sku}</p>
              <p className="text-xs">
                {product.quantity} in stock • Threshold: {product.lowStockThreshold}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Transactions */}
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">
          Stock Transaction History
        </h2>
        {stockTransactions.length === 0 ? (
          <p className="text-gray-500">No stock transactions</p>
        ) : (
          <TableHeadCell label="Date" /> // placeholder
        )}
        {stockTransactions.map((transaction: any) => (
          <div key={transaction.id} className="p-3 border-b border-gray-200">
            <p className="text-xs text-gray-400">
              {transaction.type}: {transaction.quantity} units - {transaction.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierStockPage;