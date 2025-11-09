#!/usr/bin/env node

/**
 * GameQuestHub Database Population Script
 * 
 * This script populates your Supabase database with example quest and reward data.
 * Make sure you have your environment variables set up correctly before running.
 */

import { config } from 'dotenv';

// Load environment variables
config();

// Verify environment variables
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables!');
  console.error('Please make sure you have set:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🚀 GameQuestHub Database Population Script');
console.log('==========================================\n');

async function runPopulation() {
  try {
    console.log('🎯 Populating quests...');
    await import('./populate-quests');
    
    console.log('\n💎 Populating rewards...');
    await import('./populate-rewards');
    
    console.log('\n✨ Database population completed successfully!');
    console.log('\nYour GameQuestHub database now includes:');
    console.log('📋 17 diverse quests across multiple platforms');
    console.log('🏆 18 rewards ranging from digital to physical items');
    console.log('💰 Points ranging from 50 to 25,000 for various difficulty levels');
    console.log('\nYou can now:');
    console.log('1. Start your application: npm run dev');
    console.log('2. Users can browse and complete quests');
    console.log('3. Earn points and redeem rewards');
    console.log('4. Admins can verify quest submissions');
    console.log('\nHappy questing! 🎮');
    
  } catch (error) {
    console.error('❌ Error during population:', error);
    process.exit(1);
  }
}

runPopulation();