import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* User Routes */}
      <Route path="/*" element={<UserRoutes />} />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;