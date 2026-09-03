import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api${role === "admin" ? "/admin/dashboard" : role === "supplier" ? "/api/supplier/dashboard" : "/api/customer/dashboard"}`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Fetch products for customer
    if (role === "customer") {
      axios.get("http://localhost:3001/api/products").then((res: any) => {
        setProducts(res.data);
      });
    }
  }, [role]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-500 mb-4">Dashboard</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <p className="text-gray-500">Total Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalStock}</p>
              <p className="text-gray-500">Total Stock</p>
            </div>
          </div>
        </div>
      )}

      {role === "customer" && products.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-500 mb-4">Available Products</h3>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 6).map((product: any) => (
              <div key={product.id} className="p-4 border rounded">
                <h4>{product.name}</h4>
                <p>{product.sku}</p>
                <p>${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === "supplier" && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-500 mb-4">Supplier Dashboard</h3>
          <p>Your products and stock management</p>
        </div>
      )}

      {role === "admin" && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-medium text-gray-500 mb-4">Admin Dashboard</h3>
          <p>Manage the entire inventory</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;