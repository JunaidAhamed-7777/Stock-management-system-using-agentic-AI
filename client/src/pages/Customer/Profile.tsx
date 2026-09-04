import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser } from "../../services/auth.service";
import { Loading, EmptyState, ErrorState } from "../../components/ui";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getCurrentUser();
        setProfile(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!profile) {
    return <EmptyState title="No Profile" description="Profile data not found." />;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-medium text-gray-500 mb-4">Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{profile.name || "N/A"}</p>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{profile.email || "N/A"}</p>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{profile.role?.toUpperCase() || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</p>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : "Never"}</p>
          </div>
        </div>

        {/* Action buttons for profile management */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Account Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="py-2 px-4 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Update Profile
            </button>
            <button
              className="py-2 px-4 rounded-md text-sm font-medium text-danger-600 hover:bg-red-50 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;