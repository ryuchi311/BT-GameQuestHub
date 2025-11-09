import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebAppHook {
  isLoaded: boolean;
  user: TelegramUser | null;
  colorScheme: 'light' | 'dark';
  platform: string;
  version: string;
  themeParams: Record<string, string>;
  showMainButton: (text: string, callback: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (callback: () => void) => void;
  hideBackButton: () => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  hapticFeedback: {
    impact: (style: 'light' | 'medium' | 'heavy') => void;
    notification: (type: 'error' | 'success' | 'warning') => void;
    selection: () => void;
  };
  close: () => void;
  ready: () => void;
  expand: () => void;
}

export const useTelegramWebApp = (): TelegramWebAppHook => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [platform, setPlatform] = useState('');
  const [version, setVersion] = useState('');
  const [themeParams, setThemeParams] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize Telegram WebApp
      tg.ready();
      tg.expand();
      
      // Set user data
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      // Set app info
      setColorScheme(tg.colorScheme);
      setPlatform(tg.platform);
      setVersion(tg.version);
      setThemeParams(tg.themeParams);
      
      setIsLoaded(true);
      
      // Listen for theme changes
      tg.onEvent('themeChanged', () => {
        setColorScheme(tg.colorScheme);
        setThemeParams(tg.themeParams);
      });
      
      // Listen for viewport changes
      tg.onEvent('viewportChanged', () => {
        // Update CSS custom properties
        document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
        document.documentElement.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight}px`);
      });
    } else {
      // Fallback for development/testing outside Telegram
      setIsLoaded(true);
      console.warn('Telegram WebApp not available. Running in fallback mode.');
    }
  }, []);

  const showMainButton = (text: string, callback: () => void) => {
    if (window.Telegram?.WebApp) {
      const mainButton = window.Telegram.WebApp.MainButton;
      mainButton.setText(text);
      mainButton.onClick(callback);
      mainButton.show();
    }
  };

  const hideMainButton = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.MainButton.hide();
    }
  };

  const showBackButton = (callback: () => void) => {
    if (window.Telegram?.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;
      backButton.onClick(callback);
      backButton.show();
    }
  };

  const hideBackButton = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  };

  const showAlert = (message: string) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(message);
      // Note: Telegram WebApp doesn't provide callback support for showConfirm
      // This is a limitation of the current API
      setTimeout(() => callback(true), 100); // Fallback
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticFeedback = {
    impact: (style: 'light' | 'medium' | 'heavy') => {
      if (window.Telegram?.WebApp?.HapticFeedback && parseFloat(version) > 6.0) {
        try {
          window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        } catch (e) {
          console.log('📱 HapticFeedback not supported in this version');
        }
      }
    },
    notification: (type: 'error' | 'success' | 'warning') => {
      if (window.Telegram?.WebApp?.HapticFeedback && parseFloat(version) > 6.0) {
        try {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
        } catch (e) {
          console.log('📱 HapticFeedback not supported in this version');
        }
      }
    },
    selection: () => {
      if (window.Telegram?.WebApp?.HapticFeedback && parseFloat(version) > 6.0) {
        try {
          window.Telegram.WebApp.HapticFeedback.selectionChanged();
        } catch (e) {
          console.log('📱 HapticFeedback not supported in this version');
        }
      }
    }
  };

  const close = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  const ready = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  };

  const expand = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  };

  return {
    isLoaded,
    user,
    colorScheme,
    platform,
    version,
    themeParams,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    hapticFeedback,
    close,
    ready,
    expand
  };
};

export default useTelegramWebApp;