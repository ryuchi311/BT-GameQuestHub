import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminGuard from '../components/AdminGuard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import QuestManagement from '../pages/admin/QuestManagement';
import VerificationHub from '../pages/admin/VerificationHub';
import RewardManagement from '../pages/admin/RewardManagement';

const AdminRoutes: React.FC = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/quests" element={<QuestManagement />} />
          <Route path="/rewards" element={<RewardManagement />} />
          <Route path="/verify" element={<VerificationHub />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminRoutes;