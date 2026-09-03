import React from "react";
import { Container } from "./styles";
import { Outlet } from "react-router-dom";

const CustomerLayout: React.FC = () => {
  return (
    <Container>
      <h2>Customer Portal</h2>
      <nav>
        <a href="#">Dashboard</a>
        <a href="#/customer/products">Products</a>
        <a href="#/customer/cart">Cart</a>
        <a href="#/customer/orders">Orders</a>
      </nav>
      <Outlet />
    </Container>
  );
};

export default CustomerLayout;