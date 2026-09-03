import React from "react";
import { Container } from "./styles";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <Container>
      <h2>Admin Portal</h2>
      <nav>
        <a href="#/admin/dashboard">Dashboard</a>
        <a href="#/admin/products">Products</a>
        <a href="#/admin/suppliers">Suppliers</a>
        <a href="#/admin/customers">Customers</a>
        <a href="#/admin/orders">Orders</a>
        <a href="#/admin/stock">Stock</a>
      </nav>
      <Outlet />
    </Container>
  );
};

export default AdminLayout;