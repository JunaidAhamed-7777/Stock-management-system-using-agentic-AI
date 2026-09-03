import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CustomerLayout from "./layouts/CustomerLayout";
import SupplierLayout from "./layouts/SupplierLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardPage from "./pages/Dashboard";
import ProductsPage from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import OrdersPage from "./pages/Orders";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // AuthContext loads user state on mount via /api/auth/me
  }, [user]);

  const handleLogin = (role: string) => {
    navigate(`/${role}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    );
  }

  const role = user.role;

  // Role-based redirect
  useEffect(() => {
    if (role) {
      navigate(`/${role}`);
    }
  }, [role]);

  return (
    <Router>
      <div className="min-h-screen">
        <nav className="navbar bg-white shadow">
          <div className="navbar-logo max-w-xs">Stock Management</div>
          <div className="navbar-menu flex space-x-8">
            {role === "admin" && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate("/admin/dashboard");
              }}>Admin Dashboard</a>
            )}
            {role === "supplier" && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate("/supplier/dashboard");
              }}>Supplier Dashboard</a>
            )}
            {role === "customer" && (
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
            {/* Public routes - auth pages */}
            <Route path="/login" element={<AuthLayout />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer routes */}
            <Route path="/customer/dashboard" element={<DashboardPage role={role} />} />
            <Route path="/customer/products" element={<ProductsPage role={role} />} />
            <Route path="/customer/products/:id" element={<ProductDetailPage />} />
            <Route path="/customer/cart" element={<CartPage />} />
            <Route path="/customer/orders" element={<OrdersPage />} />
            <Route path="/customer/orders/:id" element={<div>Order detail</div>} />

            {/* Supplier routes */}
            <Route path="/supplier/dashboard" element={<DashboardPage role={role} />} />
            <Route path="/supplier/products" element={<div>Supplier Products</div>} />
            <Route path="/supplier/orders" element={<OrdersPage />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<DashboardPage role={role} />} />
            <Route path="/admin/products" element={<div>Admin Products</div>} />
            <Route path="/admin/low-stock" element={<div>Low Stock</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;