// Debug utility to clear registration state
// Run this in browser console to reset and test the new Telegram user flow

// Clear all game-related localStorage
localStorage.removeItem('gamequesthub-welcome-seen');
localStorage.removeItem('gamequesthub-email-registered');
localStorage.removeItem('gamequesthub-signup-email');
localStorage.removeItem('gamequesthub-telegram-user');
localStorage.removeItem('gamequesthub-telegram-registered');
localStorage.removeItem('gamequesthub-quick-join');
localStorage.removeItem('gamequesthub-wants-account');

console.log('🔄 Registration state cleared!');
console.log('📱 Refresh the page to test Telegram user flow:');
console.log('   1. User opens Mini App → Auto-registered with Telegram data');
console.log('   2. Welcome message shown → Email modal appears');
console.log('   3. User enters email → Registration complete');
console.log('   4. User can now participate in quests');

// For testing: Simulate Telegram user data
const mockTelegramUser = {
  id: 12345,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "en",
  is_premium: false
};

// Uncomment the line below to simulate Telegram user for testing
// localStorage.setItem('gamequesthub-telegram-user', JSON.stringify(mockTelegramUser));