import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Form";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        navigate("/customer/products");
      }
    };

    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return <div className="p-8">Loading product...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-medium text-gray-500 mb-4">{product.name}</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">SKU</p>
            <p className="font-medium">{product.sku}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p>{product.category?.name || "Uncategorized"}</p>
          </div>
        </div>
        <p className="text-lg font-medium mb-4">${product.price}</p>
        <p className="text-gray-500 mb-4">Description: {product.description || "No description"}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p className="font-medium">Quantity in Stock:</p>
          <p className="text-primary-600 font-medium">{product.quantity}</p>
          <p className="font-medium">Low Stock Threshold:</p>
          <p className="text-warning-600">{product.lowStockThreshold}</p>
        </div>

        <Button
          onClick={() => navigate("/customer/products")}
          className="w-full mt-4 bg-primary-600 hover:bg-primary-700"
        >
          Back to Products
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailPage;