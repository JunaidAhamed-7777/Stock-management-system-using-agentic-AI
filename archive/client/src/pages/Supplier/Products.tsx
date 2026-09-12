import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProducts } from "../../services/product.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";
import { Button } from "../../components/ui/Form";

const SupplierProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Supplier can only see their own products
        const response = await getProducts({});
        setProducts(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  if (loading) {
    return <Loading className="p-8" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (products.length === 0) {
    return <EmptyState
      title="No Products Found"
      description="You haven't added any products yet. Add your first product to get started."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">My Products</h2>
        
        <div className="grid grid-cols-1 gap-3 mb-4">
          <Button
            onClick={() => window.dispatcher
              ? window.dispatcher.dispatch(
                  new CustomEvent("navigate", { detail: "/supplier/products/new" })
                )
              : alert("Add Product")}
            className="bg-primary-600 hover:bg-primary-700"
          >
            + Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <div key={product.id} className="p-4 border rounded hover:bg-gray-50 transition-colors">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.sku}</p>
              <p className="text-primary-600 font-medium">${product.price}</p>
              <p className="text-sm text-gray-500">{product.quantity} in stock</p>
              <Button
                onClick={() => window.dispatcher
                  ? window.dispatcher.dispatch(
                      new CustomEvent("navigate", { detail: `/supplier/products/${product.id}/edit` })
                    )
                  : alert(`Edit product ${product.name}`)}
                className="mt-2 text-sm text-primary-600 hover:underline"
              >
                Edit
              </Button>
              <Button
                onClick={() => alert(`View details for ${product.name}`)}
                className="ml-2 mt-2 text-sm text-gray-500 hover:underline"
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierProductsPage;