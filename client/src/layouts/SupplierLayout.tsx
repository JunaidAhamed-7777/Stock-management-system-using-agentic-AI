import React from "react";
import { Container } from "./styles";
import { Outlet } from "react-router-dom";

const SupplierLayout: React.FC = () => {
  return (
    <Container>
      <h2>Supplier Portal</h2>
      <nav>
        <a href="#/supplier/dashboard">Dashboard</a>
        <a href="#/supplier/products">Products</a>
        <a href="#/supplier/orders">Orders</a>
      </nav>
      <Outlet />
    </Container>
  );
};

export default SupplierLayout;