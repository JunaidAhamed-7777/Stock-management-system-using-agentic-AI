import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    const role = localStorage.getItem("role");
    if (role) {
      navigate(`/${role}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2>Stock Management System</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="enter your email"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            placeholder="enter your password"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus-ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed">
          Sign In
        </button>
        <p className="mt-4 text-sm">
          <a href="#" className="underline text-primary-600 hover:underline" onClick={() => navigate("/register")}>
            Don't have an account? Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default AuthLayout;