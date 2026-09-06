import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import DashboardPage from "./pages/Dashboard";
import ProductsPage from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import OrdersPage from "./pages/Orders";
import RegisterPage from "./pages/Auth/RegisterPage";

function App() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<AuthLayout />} />
      </Routes>
    );
  }

  const role = user.role;

  return (
    <div className="min-h-screen">
      <nav className="navbar bg-white shadow">
        <div className="navbar-logo max-w-xs">
          Stock Management
        </div>

        <div className="navbar-menu flex space-x-8">
          {role === "admin" && (
            <a
              href="/admin/dashboard"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/dashboard");
              }}
            >
              Admin Dashboard
            </a>
          )}

          {role === "supplier" && (
            <a
              href="/supplier/dashboard"
              onClick={(e) => {
                e.preventDefault();
                navigate("/supplier/dashboard");
              }}
            >
              Supplier Dashboard
            </a>
          )}

          {role === "customer" && (
            <a
              href="/customer/dashboard"
              onClick={(e) => {
                e.preventDefault();
                navigate("/customer/dashboard");
              }}
            >
              Customer Dashboard
            </a>
          )}

          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            Logout
          </a>
        </div>
      </nav>

      <main className="container pt-8">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer routes */}
          <Route
            path="/customer/dashboard"
            element={<DashboardPage role={role} />}
          />
          <Route
            path="/customer/products"
            element={<ProductsPage role={role} />}
          />
          <Route
            path="/customer/products/:id"
            element={<ProductDetailPage />}
          />
          <Route path="/customer/cart" element={<CartPage />} />
          <Route path="/customer/orders" element={<OrdersPage />} />
          <Route
            path="/customer/orders/:id"
            element={<div>Order detail</div>}
          />

          {/* Supplier routes */}
          <Route
            path="/supplier/dashboard"
            element={<DashboardPage role={role} />}
          />
          <Route
            path="/supplier/products"
            element={<div>Supplier Products</div>}
          />
          <Route path="/supplier/orders" element={<OrdersPage />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={<DashboardPage role={role} />}
          />
          <Route
            path="/admin/products"
            element={<div>Admin Products</div>}
          />
          <Route
            path="/admin/low-stock"
            element={<div>Low Stock</div>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;