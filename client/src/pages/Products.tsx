import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "../components/Form";

const ProductsPage: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { search, category } = useSearchParams() as any;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:3001/api/products";
        
        if (category) {
          url += `?category=${category}`;
        }

        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const navigate = useNavigate();

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Products</h2>
        
        <div className="grid grid-cols-1 gap-3 mb-4">
          <Button onClick={() => navigate("/customer/products/new")} className="bg-primary-600 hover:bg-primary-700">
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="animate-pulse rounded bg-gray-200 h-64 w-full mx-auto"></div>
          ) : (
            products.map((product: any) => (
              <div key={product.id} className="p-4 border rounded hover:bg-gray-50 transition-colors">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.sku}</p>
                <p className="text-primary-600 font-medium">${product.price}</p>
                <p className="text-sm text-gray-500">{product.quantity} in stock</p>
                <Button
                  onClick={() => navigate(`/customer/products/${product.id}`)}
                  className="mt-2 text-sm text-primary-600 hover:underline"
                >
                  View Details
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;