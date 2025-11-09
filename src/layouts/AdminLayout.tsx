import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { ArrowLeft, Shield } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/admin/dashboard';

  return (
    <BaseLayout className="bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Exit Admin
          </button>
        </div>
      </header>
      <main className="px-4 py-6 flex-grow">
        {children}
      </main>
    </BaseLayout>
  );
};

export default AdminLayout;