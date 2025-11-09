import React, { useState } from 'react';
import { X, Mail, Zap, User, Lock } from 'lucide-react';

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (email: string, password?: string, createAccount?: boolean) => void;
}

const EmailSignupModal: React.FC<EmailSignupModalProps> = ({
  isOpen,
  onClose,
  onSignup
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createAccount, setCreateAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Check if user is coming from Telegram
  const telegramUser = localStorage.getItem('gamequesthub-telegram-user');
  const isTelegramUser = !!telegramUser;
  let userData = null;
  if (isTelegramUser) {
    try {
      userData = JSON.parse(telegramUser);
    } catch (e) {
      // Fallback if parsing fails
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (createAccount && !password.trim()) return;

    setIsLoading(true);
    try {
      await onSignup(email.trim(), createAccount ? password : undefined, createAccount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
            {isTelegramUser ? <User className="text-white" size={28} /> : <Zap className="text-white" size={28} />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isTelegramUser && userData 
              ? `Welcome ${userData.firstName}!` 
              : 'Welcome to GameQuestHub!'
            }
          </h2>
          <p className="text-gray-300 text-sm">
            {isTelegramUser 
              ? 'Please provide your email to participate in quests and earn rewards'
              : 'Join thousands of gamers earning rewards through exciting quests'
            }
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
            {isTelegramUser ? 'Your Telegram account is already registered' : 'Complete quests across gaming platforms'}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
            Earn points and redeem awesome rewards
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
            {isTelegramUser ? 'Email required for quest participation' : 'Compete on leaderboards with fellow gamers'}
          </div>
        </div>

        {/* Account Type Toggle */}
        <div className="mb-4">
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setCreateAccount(false)}
              className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${
                !createAccount 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Quick Join
            </button>
            <button
              type="button"
              onClick={() => setCreateAccount(true)}
              className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${
                createAccount 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Full Account
            </button>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              {createAccount ? 'Email Address' : 'Enter your email to get started'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {createAccount && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                  required={createAccount}
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="w-full">
            <button
              type="submit"
              disabled={isLoading || !email.trim() || (createAccount && !password.trim())}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {createAccount ? 'Creating...' : 'Registering...'}
                </div>
              ) : (
                isTelegramUser 
                  ? (createAccount ? 'Complete Registration' : 'Register Email') 
                  : (createAccount ? 'Create Account' : 'Start Questing!')
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-4">
          {createAccount ? (
            <p className="text-xs text-gray-400 text-center">
              Create a full account to track progress, earn rewards, and compete on leaderboards
            </p>
          ) : (
            <p className="text-xs text-gray-400 text-center">
              Quick join to browse quests. You can create a full account later to save progress
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailSignupModal;