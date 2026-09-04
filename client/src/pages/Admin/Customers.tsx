import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const AdminCustomersPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // In a real app, we'd fetch from /api/customers
        // For now, use mock data based on Stitch design
        setCustomers([
          {
            id: 1,
            name: "Apex Manufacturing Corp",
            email: "procurement@apex-mfg.com",
            role: "customer",
            memberSince: "20112023",
            lastLogin: "Oct 25, 2024",
          },
          {
            id: 2,
            name: "Detroit Assembly LLC",
            email: "orders@detroit-assembly.com",
            role: "customer",
            memberSince: "Mar 15, 2023",
            lastLogin: "Oct 19, 2024",
          },
          {
            id: 3,
            name: "Chicago Hub Pick",
            email: "warehouse@chicago-hub.com",
            role: "customer",
            memberSince: "Jun 1, 2022",
            lastLogin: "Oct 20, 2024",
          },
        ]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch customers");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading customers...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (customers.length === 0) {
    return <EmptyState
      title="No Customers Found"
      description="No customers found in the system."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Customers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Company Name</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Role</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Member Since</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Last Login</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{customer.name}</td>
                  <td className="py-3 px-3">
                    <a href="mailto:{customer.email}" className="text-sm text-primary-600 hover:underline">
                      {customer.email}
                    </a>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-600">
                      {customer.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-gray-500">{customer.memberSince}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-gray-500">{customer.lastLogin}</span>
                  </td>
                  <td className="py-3 px-3">
                    <Button
                      size="sm"
                      className="rounded-md px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                      type="button"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;