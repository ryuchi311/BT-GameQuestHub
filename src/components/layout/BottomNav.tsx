import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { QuestIcon } from '../icons/QuestIcon';
import { LeaderboardIcon } from '../icons/LeaderboardIcon';
import { ProfileIcon } from '../icons/ProfileIcon';
import { RewardIcon } from '../icons/RewardIcon';
import { Shield } from 'lucide-react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

interface BottomNavProps {
  activeTab: string;
}

const userNavItems = [
  { name: 'Quests', icon: QuestIcon, path: '/dashboard' },
  { name: 'Leaderboard', icon: LeaderboardIcon, path: '/leaderboard' },
  { name: 'Rewards', icon: RewardIcon, path: '/rewards' },
  { name: 'Profile', icon: ProfileIcon, path: '/profile' },
];

const adminNavItems = [
  { name: 'Admin', icon: () => <Shield className="w-5 h-5" />, path: '/admin/dashboard' },
  { name: 'Quests', icon: QuestIcon, path: '/admin/quests' },
  { name: 'Verify', icon: () => <Shield className="w-5 h-5" />, path: '/admin/verify' },
  { name: 'Profile', icon: ProfileIcon, path: '/profile' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const telegram = useTelegramWebApp();
  
  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const handleNavigation = (path: string) => {
    // Haptic feedback for navigation
    telegram.hapticFeedback.selection();
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-20 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center w-full py-2.5 px-1 text-xs transition-colors duration-200 ${
                isActive ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
              }`}
              aria-label={`Go to ${item.name}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="font-medium text-xs">{item.name}</span>
              {isActive && <div className="w-1 h-1 bg-yellow-400 rounded-full mt-1"></div>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;