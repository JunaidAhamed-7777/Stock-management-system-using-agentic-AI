import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "./ui/Loading";
import { portalHome } from "../utils/roles";

export function RoleRedirect() {
  const { isAuthenticated, loading, role } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loading />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={portalHome(role)} replace />;
}
