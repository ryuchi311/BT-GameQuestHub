import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import Dashboard from '../pages/user/Dashboard';
import QuestDetail from '../pages/user/QuestDetail';
import Leaderboard from '../pages/user/Leaderboard';
import Rewards from '../pages/user/Rewards';
import Profile from '../pages/user/Profile';

const UserRoutes: React.FC = () => {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quests" element={<Dashboard />} />
        <Route path="/quests/:id" element={<QuestDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </UserLayout>
  );
};

export default UserRoutes;