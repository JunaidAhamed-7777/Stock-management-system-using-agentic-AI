import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const AdminSuppliersPage: React.FC = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        // In a real app, we'd fetch from /api/suppliers
        // For now, use mock data based on Stitch design
        setSuppliers([
          {
            id: 1,
            companyName: "Apex Microdevices Ltd",
            contactNumber: "+1-555-0100",
            address: "123 Tech Drive, Austin, TX 78701",
            userId: 1,
          },
          {
            id: 2,
            companyName: "Photonix Corp",
            contactNumber: "+1-555-0200",
            address: "456 Lightwave Blvd, Dallas, TX 75201",
            userId: 2,
          },
          {
            id: 3,
            companyName: "Vanguard Dynamics",
            contactNumber: "+1-555-0300",
            address: "789 Innovation Way, Chicago, IL 60601",
            userId: 3,
          },
        ]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch suppliers");
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading suppliers...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (suppliers.length === 0) {
    return <EmptyState
      title="No Suppliers Found"
      description="No suppliers found in the system."
    />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-medium text-gray-500 mb-4">Suppliers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Company Name</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Contact</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Address</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Products</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier: any) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{supplier.companyName}</td>
                  <td className="py-3 px-3">
                    <span className="text-sm text-gray-500">{supplier.contactNumber}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="truncate max-w-xs text-sm text-gray-500">
                      {supplier.address}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-500">34 products</td>
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

export default AdminSuppliersPage;