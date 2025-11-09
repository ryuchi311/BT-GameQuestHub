import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Shield, Users, BarChart3, Gift } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <header className="text-center mb-8">
        <div className="inline-block bg-blue-600 p-4 rounded-full mb-4">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage GameHub Operations</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <AdminCard 
          to="/admin/quests"
          icon={<ClipboardList className="h-8 w-8 text-blue-400" />}
          title="Quest Management"
          description="Create, edit, and manage all quests."
          badge="3 pending"
        />
        
        <AdminCard 
          to="/admin/verify"
          icon={<Shield className="h-8 w-8 text-green-400" />}
          title="Verification Hub"
          description="Review and approve user submissions."
          badge="5 to review"
        />
        
        <AdminCard 
          to="/admin/rewards"
          icon={<Gift className="h-8 w-8 text-yellow-400" />}
          title="Reward Management"
          description="Create and manage rewards catalog."
          badge="15 active"
        />
        
        <AdminCard 
          to="#"
          icon={<Users className="h-8 w-8 text-purple-400" />}
          title="User Management"
          description="View and manage user accounts."
          badge="124 users"
        />
        
        <AdminCard 
          to="#"
          icon={<BarChart3 className="h-8 w-8 text-orange-400" />}
          title="Analytics"
          description="View platform statistics and reports."
          badge="View reports"
        />
      </div>
    </div>
  );
};

interface AdminCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ to, icon, title, description, badge }) => (
  <Link to={to} className="block group">
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-blue-500/20 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        {badge && (
          <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  </Link>
);

export default AdminDashboard;