import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../components/AdminLogin';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return <AdminLogin />;
  }

  // Show login if user is not admin
  if (user.role !== 'admin') {
    return <AdminLogin />;
  }

  // User is authenticated and is admin, show children
  return <>{children}</>;
};

export default AdminGuard;