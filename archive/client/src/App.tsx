import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import { roleOf, useAuth, type Role } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Portal from "./pages/Portal";

function Guard({ role }: { role: Role }) { const { user, isLoading } = useAuth(); if (isLoading) return <div className="grid min-h-screen place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" /></div>; if (!user) return <Navigate to="/login" replace />; return roleOf(user.role) === role ? <Outlet /> : <Navigate to={`/${roleOf(user.role)}/dashboard`} replace />; }
function Home() { const { user, isLoading } = useAuth(); return isLoading ? null : <Navigate to={user ? `/${roleOf(user.role)}/dashboard` : "/login"} replace />; }
export default function App() { return <Routes><Route path="/" element={<Home />} /><Route element={<AuthLayout />}><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /></Route>{(["admin", "supplier", "customer"] as Role[]).map(role => <Route key={role} element={<Guard role={role} />}><Route path={`/${role}/*`} element={<Portal role={role} />} /></Route>)}<Route path="*" element={<Home />} /></Routes>; }
