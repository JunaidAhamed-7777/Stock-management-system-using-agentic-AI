import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizedRole = role?.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const endpoint =
          normalizedRole === "admin"
            ? "/admin/dashboard"
            : normalizedRole === "supplier"
              ? "/supplier/dashboard"
              : "/customer/dashboard";

        const response = await axios.get(
          `http://localhost:3001/api${endpoint}`
        );

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (normalizedRole === "customer") {
      axios
        .get("http://localhost:3001/api/products")
        .then((res) => {
          setProducts(res.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [normalizedRole]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-500">
            Dashboard
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">
                {stats.totalProducts ?? 0}
              </p>
              <p className="text-gray-500">Total Products</p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                {stats.totalStock ?? 0}
              </p>
              <p className="text-gray-500">Total Stock</p>
            </div>
          </div>
        </div>
      )}

      {normalizedRole === "customer" && products.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-500">
            Available Products
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 6).map((product: any) => (
              <div key={product.id} className="rounded border p-4">
                <h4>{product.name}</h4>
                <p>{product.sku}</p>
                <p>${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {normalizedRole === "supplier" && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-500">
            Supplier Dashboard
          </h3>
          <p>Your products and stock management</p>
        </div>
      )}

      {normalizedRole === "admin" && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-500">
            Admin Dashboard
          </h3>
          <p>Manage the entire inventory</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;