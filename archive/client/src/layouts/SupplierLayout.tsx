import React from "react";
import { Outlet } from "react-router-dom";

const SupplierLayout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2>Supplier Portal</h2>
      <nav className="mt-6 space-y-2">
        <a href="#" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Dashboard
        </a>
        <a href="/supplier/products" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Products
        </a>
        <a href="/supplier/orders" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Orders
        </a>
      </nav>
      <Outlet />
    </div>
  );
};

export default SupplierLayout;