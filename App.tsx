import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProviders } from './src/context/AppProviders';
import AppRoutes from './src/routes';
import DatabaseStatus from './src/components/DatabaseStatus';
import EmailSignupModal from './src/components/EmailSignupModal';
import { ToastProvider, useToast } from './src/components/Toast';
import { telegramService } from './src/services/telegramService';
import { useTelegramWebApp } from './src/hooks/useTelegramWebApp';

// Enable detailed console logging
console.log('🚀 App.tsx loaded - Enabling detailed logging');
window.addEventListener('error', (e) => {
  console.error('❌ Global Error:', e.error, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Unhandled Promise Rejection:', e.reason);
});

const AppContent: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { addToast } = useToast();
  const telegram = useTelegramWebApp();
  const hasShownWelcome = React.useRef(false);

  useEffect(() => {
    console.log('🔄 App useEffect started');
    
    // Initialize Telegram WebApp
    telegramService.init();
    console.log('📱 Telegram service initialized');
    
    // Check if user has completed email registration
    const hasCompletedEmailRegistration = localStorage.getItem('gamequesthub-email-registered');
    const hasUserAccount = localStorage.getItem('supabase.auth.token');
    console.log('📋 Registration check:', { hasCompletedEmailRegistration, hasUserAccount, telegram: telegram.isLoaded });
    
    // If in Telegram, auto-register user but still require email for participation
    if (telegram.isLoaded && telegram.user && !hasShownWelcome.current) {
      console.log('👤 Telegram user detected:', telegram.user);
      hasShownWelcome.current = true;
      
      // Auto-register with Telegram user data
      const telegramUserData = {
        telegramId: telegram.user.id,
        firstName: telegram.user.first_name,
        lastName: telegram.user.last_name,
        username: telegram.user.username,
        languageCode: telegram.user.language_code,
        isPremium: telegram.user.is_premium
      };
      
      localStorage.setItem('gamequesthub-telegram-user', JSON.stringify(telegramUserData));
      localStorage.setItem('gamequesthub-telegram-registered', 'true');
      console.log('💾 Telegram user data saved:', telegramUserData);
      
      // Show welcome message
      addToast({
        type: 'success',
        title: `Welcome ${telegram.user.first_name}!`,
        message: 'You have been automatically registered. Please complete your email to participate in quests.',
        duration: 6000
      });
      
      // Haptic feedback for welcome
      telegram.hapticFeedback.notification('success');
      
      // Check if email is required for participation
      if (!hasCompletedEmailRegistration) {
        setTimeout(() => {
          setShowEmailModal(true);
        }, 2000); // Show email modal after welcome message
      }
    } else if (!telegram.isLoaded && !hasUserAccount && !hasShownWelcome.current) {
      // Show modal if not in Telegram and user hasn't seen it
      setTimeout(() => {
        setShowEmailModal(true);
      }, 1000);
    }
  }, [telegram.isLoaded, telegram.user]);

  const handleEmailSignup = async (email: string, password?: string, createAccount?: boolean) => {
    try {
      const telegramUser = localStorage.getItem('gamequesthub-telegram-user');
      const isTelegramUser = !!telegramUser;
      
      // Mark email registration as complete
      localStorage.setItem('gamequesthub-email-registered', 'true');
      localStorage.setItem('gamequesthub-signup-email', email);
      
      if (createAccount && password) {
        // If user wants to create a full account
        localStorage.setItem('gamequesthub-wants-account', 'true');
        
        setShowEmailModal(false);
        
        if (isTelegramUser) {
          addToast({
            type: 'success',
            title: 'Registration Complete!',
            message: 'Your email has been registered. You can now participate in quests and earn rewards!',
            duration: 6000
          });
        } else {
          addToast({
            type: 'info',
            title: 'Welcome to GameQuestHub!',
            message: 'Account creation feature coming soon! For now, you can browse quests and create a full account later from the login page.',
            duration: 8000
          });
        }
      } else {
        // Quick join - email registration for participation
        localStorage.setItem('gamequesthub-quick-join', 'true');
        
        setShowEmailModal(false);
        
        if (isTelegramUser) {
          const userData = JSON.parse(telegramUser);
          addToast({
            type: 'success',
            title: `Welcome ${userData.firstName}!`,
            message: 'Email registered successfully! You can now participate in all quests and earn rewards.',
            duration: 6000
          });
          
          // Haptic feedback for successful registration
          if (telegram.hapticFeedback) {
            telegram.hapticFeedback.notification('success');
          }
        } else {
          addToast({
            type: 'success',
            title: 'Welcome to GameQuestHub!',
            message: 'Thanks for joining! You can now browse quests and participate in our community.',
            duration: 5000
          });
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      addToast({
        type: 'error',
        title: 'Signup Error',
        message: 'Something went wrong. Please try again!',
        duration: 5000
      });
    }
  };

  const handleCloseModal = () => {
    // Mark that user has seen the welcome modal even if they dismissed it
    localStorage.setItem('gamequesthub-welcome-seen', 'true');
    setShowEmailModal(false);
    
    addToast({
      type: 'info',
      title: 'Welcome!',
      message: 'You can join anytime from the login page to track your progress.',
      duration: 4000
    });
  };

  return (
    <AppProviders>
      <AppRoutes />
      {/* <DatabaseStatus /> */}
      <EmailSignupModal
        isOpen={showEmailModal}
        onClose={handleCloseModal}
        onSignup={handleEmailSignup}
      />
    </AppProviders>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Router>
  );
};

export default App;