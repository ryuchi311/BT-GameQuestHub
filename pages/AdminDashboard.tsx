
import React from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, ClipboardList, ShieldCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    return (
        <div className="p-4 max-w-lg mx-auto">
            <header className="text-center mb-8">
                 <div className="inline-block bg-dark-card p-4 rounded-full border-2 border-brand-secondary shadow-lg">
                    <ShieldCheck className="h-10 w-10 text-brand-secondary" />
                </div>
                <h1 className="text-3xl font-bold mt-2 text-white">Admin Panel</h1>
                <p className="text-gray-400">Manage GameHub Operations</p>
            </header>

            <div className="space-y-4">
                <AdminCard 
                    to="/admin/quests"
                    icon={<ClipboardList className="h-8 w-8 text-brand-primary" />}
                    title="Quest Management"
                    description="Create, edit, and manage all quests."
                />
                <AdminCard 
                    to="/admin/verify"
                    icon={<ListChecks className="h-8 w-8 text-accent-green" />}
                    title="Verification Hub"
                    description="Review and approve user submissions."
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
}

const AdminCard: React.FC<AdminCardProps> = ({ to, icon, title, description }) => (
    <Link to={to} className="block">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border hover:border-brand-primary transition-all duration-300 shadow-md hover:shadow-brand-primary/20 transform hover:-translate-y-1 flex items-center space-x-4">
            <div className="flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
        </div>
    </Link>
);


export default AdminDashboard;
