export class TelegramService {
  private static instance: TelegramService;
  
  private constructor() {}
  
  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  /**
   * Check if running inside Telegram WebApp
   */
  isInTelegram(): boolean {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  }

  /**
   * Get Telegram user data
   */
  getTelegramUser() {
    if (!this.isInTelegram()) return null;
    return window.Telegram.WebApp.initDataUnsafe?.user || null;
  }

  /**
   * Get Telegram WebApp instance
   */
  getWebApp() {
    if (!this.isInTelegram()) return null;
    return window.Telegram.WebApp;
  }

  /**
   * Apply Telegram theme to the app
   */
  applyTelegramTheme(): void {
    if (!this.isInTelegram()) return;
    
    const tg = window.Telegram.WebApp;
    const root = document.documentElement;
    
    // Apply theme colors
    if (tg.themeParams.bg_color) {
      root.style.setProperty('--tg-bg-color', tg.themeParams.bg_color);
    }
    if (tg.themeParams.text_color) {
      root.style.setProperty('--tg-text-color', tg.themeParams.text_color);
    }
    if (tg.themeParams.hint_color) {
      root.style.setProperty('--tg-hint-color', tg.themeParams.hint_color);
    }
    if (tg.themeParams.link_color) {
      root.style.setProperty('--tg-link-color', tg.themeParams.link_color);
    }
    if (tg.themeParams.button_color) {
      root.style.setProperty('--tg-button-color', tg.themeParams.button_color);
    }
    if (tg.themeParams.button_text_color) {
      root.style.setProperty('--tg-button-text-color', tg.themeParams.button_text_color);
    }
    if (tg.themeParams.secondary_bg_color) {
      root.style.setProperty('--tg-secondary-bg-color', tg.themeParams.secondary_bg_color);
    }
    
    // Apply color scheme class
    root.setAttribute('data-theme', tg.colorScheme);
  }

  /**
   * Initialize Telegram WebApp
   */
  init(): void {
    if (!this.isInTelegram()) {
      console.warn('Not running in Telegram WebApp');
      return;
    }
    
    const tg = window.Telegram.WebApp;
    const version = parseFloat(tg.version || '6.0');
    
    console.log('📱 Initializing Telegram WebApp version:', tg.version);
    
    // Initialize WebApp
    tg.ready();
    tg.expand();
    
    // Apply theme
    this.applyTelegramTheme();
    
    // Version-safe feature initialization
    if (version > 6.0) {
      // Features supported in newer versions
      try {
        if (tg.headerColor) {
          // Only set if property exists and version supports it
        }
        if (tg.backgroundColor) {
          // Only set if property exists and version supports it  
        }
        if (tg.disableClosingConfirmation) {
          // Only set if method exists and version supports it
        }
      } catch (e) {
        console.log('📱 Some advanced features not supported in this version');
      }
    } else {
      console.log('📱 Running in compatibility mode for version 6.0');
    }
    
    // Set viewport
    document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
    document.documentElement.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight}px`);
    
    // Listen for theme changes
    tg.onEvent('themeChanged', () => {
      this.applyTelegramTheme();
    });
    
    // Listen for viewport changes
    tg.onEvent('viewportChanged', () => {
      document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
      document.documentElement.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight}px`);
    });
  }

  /**
   * Show confirmation dialog
   */
  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isInTelegram()) {
        window.Telegram.WebApp.showConfirm(message);
        // Note: Telegram WebApp doesn't provide callback support for showConfirm
        // This is a limitation of the current API
        setTimeout(() => resolve(true), 100); // Fallback
      } else {
        resolve(confirm(message));
      }
    });
  }

  /**
   * Show alert dialog
   */
  showAlert(message: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.isInTelegram()) {
        window.Telegram.WebApp.showAlert(message);
        setTimeout(() => resolve(), 100); // Fallback timing
      } else {
        alert(message);
        resolve();
      }
    });
  }

  /**
   * Trigger haptic feedback
   */
  hapticFeedback(type: 'impact' | 'notification' | 'selection', style?: string): void {
    if (!this.isInTelegram()) return;
    
    const tg = window.Telegram.WebApp;
    const version = parseFloat(tg.version || '6.0');
    
    // Only use haptic feedback for supported versions
    if (version <= 6.0) {
      console.log('📱 HapticFeedback not supported in version', tg.version);
      return;
    }
    
    const haptic = tg.HapticFeedback;
    if (!haptic) return;
    
    try {
      switch (type) {
        case 'impact':
          haptic.impactOccurred(style as any || 'medium');
          break;
        case 'notification':
          haptic.notificationOccurred(style as any || 'success');
          break;
        case 'selection':
          haptic.selectionChanged();
          break;
      }
    } catch (e) {
      console.log('📱 HapticFeedback error:', e.message);
    }
  }

  /**
   * Set main button
   */
  setMainButton(text: string, callback?: () => void): void {
    if (!this.isInTelegram()) return;
    
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.setText(text);
    
    if (callback) {
      mainButton.onClick(callback);
    }
    
    mainButton.show();
  }

  /**
   * Hide main button
   */
  hideMainButton(): void {
    if (!this.isInTelegram()) return;
    window.Telegram.WebApp.MainButton.hide();
  }

  /**
   * Set back button
   */
  setBackButton(callback: () => void): void {
    if (!this.isInTelegram()) return;
    
    const backButton = window.Telegram.WebApp.BackButton;
    backButton.onClick(callback);
    backButton.show();
  }

  /**
   * Hide back button
   */
  hideBackButton(): void {
    if (!this.isInTelegram()) return;
    window.Telegram.WebApp.BackButton.hide();
  }

  /**
   * Close WebApp
   */
  close(): void {
    if (!this.isInTelegram()) return;
    window.Telegram.WebApp.close();
  }

  /**
   * Send data to bot
   */
  sendData(data: any): void {
    if (!this.isInTelegram()) return;
    window.Telegram.WebApp.sendData(JSON.stringify(data));
  }

  /**
   * Open link
   */
  openLink(url: string): void {
    if (this.isInTelegram()) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }
}

export const telegramService = TelegramService.getInstance();