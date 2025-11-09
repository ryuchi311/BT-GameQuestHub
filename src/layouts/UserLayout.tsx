import React from 'react';
import { useLocation } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Get current tab from pathname
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/quest')) return 'Quests';
    if (path.includes('/leaderboard')) return 'Leaderboard';
    if (path.includes('/rewards')) return 'Rewards';
    if (path.includes('/profile')) return 'Profile';
    return 'Quests'; // default
  };

  return (
    <BaseLayout>
      <Header />
      <main className="px-4 pb-24 flex-grow">
        {children}
      </main>
      <BottomNav activeTab={getActiveTab()} />
    </BaseLayout>
  );
};

export default UserLayout;