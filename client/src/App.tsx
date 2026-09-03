import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./index.css";
import CustomerLayout from "../layouts/CustomerLayout";
import SupplierLayout from "../layouts/SupplierLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard";
import ProductsPage from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import OrdersPage from "./pages/Orders";

function App() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(localStorage.getItem("role"));
      navigate(`/${userRole?.toLowerCase() || "customer"}`);
    }
  }, [navigate, userRole]);

  const handleLogin = (role: string) => {
    localStorage.setItem("token", "mock-token");
    localStorage.setItem("role", role);
    setUserRole(role);
    setIsLoggedIn(true);
    navigate(`/${role}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
  };

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <nav className="navbar bg-white shadow">
          <div className="navbar-logo max-w-xs">Stock Management</div>
          <div className="navbar-menu flex space-x-8">
            {userRole === "admin" && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate("/admin/dashboard");
              }}>Admin Dashboard</a>
            )}
            {userRole === "supplier" && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate("/supplier/dashboard");
              }}>Supplier Dashboard</a>
            )}
            {userRole === "customer" && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate("/customer/dashboard");
              }}>Customer Dashboard</a>
            )}
            <a href="#" onClick={handleLogout}>Logout</a>
          </div>
        </nav>

        <main className="container pt-8">
          <Routes>
            {/* Customer routes */}
            <Route path="/customer/dashboard" element={<DashboardPage role={userRole} />} />
            <Route path="/customer/products" element={<ProductsPage role={userRole} />} />
            <Route path="/customer/products/:id" element={<ProductDetailPage />} />
            <Route path="/customer/cart" element={<CartPage />} />
            <Route path="/customer/orders" element={<OrdersPage />} />
            <Route path="/customer/orders/:id" element={<div>Order detail</div>} />

            {/* Supplier routes */}
            <Route path="/supplier/dashboard" element={<DashboardPage role={userRole} />} />
            <Route path="/supplier/products" element={<div>Supplier Products</div>} />
            <Route path="/supplier/orders" element={<OrdersPage />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<DashboardPage role={userRole} />} />
            <Route path="/admin/products" element={<div>Admin Products</div>} />
            <Route path="/admin/low-stock" element={<div>Low Stock</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
