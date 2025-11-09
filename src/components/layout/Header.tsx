import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CoinIcon } from '../icons/PlatformIcons';
import { Shield, LogOut } from 'lucide-react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const telegram = useTelegramWebApp();

  if (!user) return null;

  const xpPercentage = (user.xp / user.maxXp) * 100;

  const handleLogout = async () => {
    try {
      // Haptic feedback for action
      telegram.hapticFeedback.impact('light');
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      telegram.hapticFeedback.notification('error');
    }
  };

  return (
    <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-20 p-3 safe-area-top">
      <div className="flex items-center justify-between mb-3">
        {/* Left side: Branding */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white truncate">Brgy Tamago GameHub</h1>
              {user.role === 'admin' && (
                <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full text-xs">
                  <Shield size={10} />
                  <span>ADMIN</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">
              {user.role === 'admin' ? 'Admin Dashboard' : 'Complete quests, earn points!'}
            </p>
          </div>
        </div>
        {/* Right side: Points and Admin Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1.5 rounded-full">
            <CoinIcon className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-white text-sm">{user.points.toLocaleString()}</span>
          </div>
          
          {user.role === 'admin' && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-full text-white text-sm transition-colors"
              title="Admin Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
      {/* Bottom section: XP Bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>XP Progress (Level {user.level})</span>
          <span>{user.xp.toLocaleString()} / {user.maxXp.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${xpPercentage}%` }}
            aria-valuenow={xpPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
            aria-label="Experience points progress"
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;