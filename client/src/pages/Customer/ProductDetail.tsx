import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProductById } from "../../services/product.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";
import { Button } from "../../components/ui/Form";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(Number(id));
        setProduct(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch product");
        setLoading(false);
        // Navigate back if product not found
        // window.history.back();
      }
    };

    if (id) {
      fetchProduct();
    }
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          <p className="font-medium">Category:</p>
          <p>{product.category?.name || "Uncategorized"}</p>
          <p className="font-medium">Supplier:</p>
          <p>{product.supplier?.companyName || "N/A"}</p>
        </div>

        <Button
          onClick={() => window.history.back()}
          className="w-full mt-4 bg-primary-600 hover:bg-primary-700"
        >
          Back to Products
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailPage;