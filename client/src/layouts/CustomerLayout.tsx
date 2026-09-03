import React from "react";
import { Container } from "../components/styles";
import { Outlet } from "react-router-dom";

const CustomerLayout: React.FC = () => {
  return (
    <Container>
      <h2>Customer Portal</h2>
      <nav className="mt-6 space-y-2">
        <a href="#" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Dashboard
        </a>
        <a href="/customer/products" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Products
        </a>
        <a href="/customer/cart" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Cart
        </a>
        <a href="/customer/orders" className="block px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50">
          Orders
        </a>
      </nav>
      <Outlet />
    </Container>
  );
};

export default CustomerLayout;