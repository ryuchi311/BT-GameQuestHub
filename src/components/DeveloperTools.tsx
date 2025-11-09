import React from 'react';
import { RotateCcw, Trash2, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DeveloperTools: React.FC = () => {
  const { login, logout, user } = useAuth();
  const resetWelcomeModal = () => {
    localStorage.removeItem('gamequesthub-welcome-seen');
    localStorage.removeItem('gamequesthub-signup-email');
    localStorage.removeItem('gamequesthub-quick-join');
    localStorage.removeItem('gamequesthub-wants-account');
    alert('Welcome modal reset! Refresh the page to see it again.');
  };

  const clearAllData = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('gamequesthub-'));
    keys.forEach(key => localStorage.removeItem(key));
    alert('All GameQuestHub data cleared! Refresh the page.');
  };

  const quickLoginAdmin = async () => {
    try {
      await login('ryuchicago@gmail.com', '123456');
    } catch (error) {
      console.error('Quick admin login failed:', error);
    }
  };

  const quickLoginUser = async () => {
    try {
      await login('testuser@example.com', 'testpass123');
    } catch (error) {
      console.error('Quick user login failed:', error);
    }
  };

  const quickLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Only show in development environment
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg p-3 z-40 max-w-xs">
      <h4 className="text-xs font-medium text-gray-300 mb-2">
        Developer Tools {user && `(${user.role}: ${user.name})`}
      </h4>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={resetWelcomeModal}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            title="Reset welcome modal"
          >
            <RotateCcw size={12} />
            <span>Reset Modal</span>
          </button>
          <button
            onClick={clearAllData}
            className="flex items-center space-x-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
            title="Clear all GameQuestHub data"
          >
            <Trash2 size={12} />
            <span>Clear Data</span>
          </button>
        </div>
        
        <div className="flex space-x-2">
          {!user ? (
            <>
              <button
                onClick={quickLoginAdmin}
                className="flex items-center space-x-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                title="Quick admin login"
              >
                <Shield size={12} />
                <span>Admin</span>
              </button>
              <button
                onClick={quickLoginUser}
                className="flex items-center space-x-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                title="Quick user login"
              >
                <User size={12} />
                <span>User</span>
              </button>
            </>
          ) : (
            <button
              onClick={quickLogout}
              className="flex items-center space-x-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
              title="Logout"
            >
              <User size={12} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperTools;