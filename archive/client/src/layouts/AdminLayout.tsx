import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2>Admin Portal</h2>
      <nav className="mt-6 space-y-2">
        <a href="#" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Dashboard
        </a>
        <a href="/admin/products" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Products
        </a>
        <a href="/admin/suppliers" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Suppliers
        </a>
        <a href="/admin/customers" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Customers
        </a>
        <a href="/admin/orders" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Orders
        </a>
        <a href="/admin/low-stock" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Low Stock
        </a>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminLayout;