import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Form";
import { useForm } from "../../components/ui/Form";

const SupplierProductFormPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [form, formHelpers] = useForm({
    name: "",
    description: "",
    sku: "",
    price: "",
    quantity: "0",
    lowStockThreshold: "10",
    categoryId: "",
    supplierId: "",
  });

  // Parse product ID from route
  const params = new URLSearchParams(window.location.search);
  const routeId = params.get("id");

  useEffect(() => {
    if (routeId) {
      setIsEdit(true);
      setProductId(routeId);
      // In a real app, we'd fetch the existing product data
      // For now, keep form as-is for editing
    }
  }, [routeId]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      if (isEdit && productId) {
        await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
        alert("Product updated successfully");
        navigate("/supplier/products");
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
        alert("Product created successfully");
        navigate("/supplier/products");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    }
  };

  return (
    <div className="py-8">
      <Card>
        <h2 className="text-xl font-medium text-gray-500 mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        {isEdit && productId && (
          <p className="text-sm text-gray-500 mb-4">
            Editing product ID: {productId}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              type="text"
              placeholder="Enter product name"
              required
              {...form.getFieldProps("name")}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Input
              type="text"
              placeholder="Enter product description"
              {...form.getFieldProps("description")}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <Input
                type="text"
                placeholder="Enter SKU"
                required
                {...form.getFieldProps("sku")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <Input
                type="number"
                placeholder="Enter price"
                required
                {...form.getFieldProps("price")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <Input
                type="number"
                placeholder="Enter quantity"
                required
                {...form.getFieldProps("quantity")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
              <Input
                type="number"
                placeholder="Enter threshold (default 10)"
                {...form.getFieldProps("lowStockThreshold")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
            <Input
              type="text"
              placeholder="Enter category ID"
              {...form.getFieldProps("categoryId")}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier ID</label>
              <Input
                type="text"
                placeholder="Enter supplier ID"
                {...form.getFieldProps("supplierId")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/supplier/products")}
              className="mt-2 w-full rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SupplierProductFormPage;