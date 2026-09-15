import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleRedirect } from "./components/RoleRedirect";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminProductFormPage } from "./pages/admin/AdminProductFormPage";
import { AdminInventory } from "./pages/admin/AdminInventory";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminCustomers } from "./pages/admin/AdminCustomers";
import { AdminSuppliers } from "./pages/admin/AdminSuppliers";
import { AdminStockTransactions } from "./pages/admin/AdminStockTransactions";
import { AdminAI } from "./pages/admin/AdminAI";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { SupplierDashboard } from "./pages/supplier/SupplierDashboard";
import { SupplierProducts } from "./pages/supplier/SupplierProducts";
import { SupplierProductFormPage } from "./pages/supplier/SupplierProductFormPage";
import { SupplierStock } from "./pages/supplier/SupplierStock";
import { SupplierOrders } from "./pages/supplier/SupplierOrders";
import { SupplierProfile } from "./pages/supplier/SupplierProfile";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { CustomerProducts } from "./pages/customer/CustomerProducts";
import { CustomerProductDetail } from "./pages/customer/CustomerProductDetail";
import { CustomerCart } from "./pages/customer/CustomerCart";
import { CustomerOrders } from "./pages/customer/CustomerOrders";
import { CustomerOrderDetail } from "./pages/customer/CustomerOrderDetail";
import { CustomerProfile } from "./pages/customer/CustomerProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<RoleRedirect />} />

      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route element={<AppShell />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductFormPage />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductFormPage />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/suppliers" element={<AdminSuppliers />} />
          <Route path="/admin/stock-transactions" element={<AdminStockTransactions />} />
          <Route path="/admin/ai" element={<AdminAI />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["SUPPLIER"]} />}>
        <Route element={<AppShell />}>
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/products" element={<SupplierProducts />} />
          <Route path="/supplier/products/new" element={<SupplierProductFormPage />} />
          <Route path="/supplier/products/:id/edit" element={<SupplierProductFormPage />} />
          <Route path="/supplier/stock" element={<SupplierStock />} />
          <Route path="/supplier/orders" element={<SupplierOrders />} />
          <Route path="/supplier/profile" element={<SupplierProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["CUSTOMER"]} />}>
        <Route element={<AppShell />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/products" element={<CustomerProducts />} />
          <Route path="/customer/products/:id" element={<CustomerProductDetail />} />
          <Route path="/customer/cart" element={<CustomerCart />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
          <Route path="/customer/orders/:id" element={<CustomerOrderDetail />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
