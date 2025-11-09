import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://otheoutvqrphxqsggwxt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODUxNTcsImV4cCI6MjA3NjA2MTE1N30.AHS_9Iq8EfM4O2liu0947dszn4NOFXqFKsOflVyu3Gc'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Singleton pattern to avoid multiple instances
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    console.log('🗄️ Creating Supabase client instance for main app');
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
})();

// For admin operations (use service key)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4NTE1NywiZXhwIjoyMDc2MDYxMTU3fQ.THGmhgu0VCs5mgGb2-0oUXc6Fqlzz0jQMivXE9pFL-A'

export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    console.log('🗄️ Creating Supabase admin client instance');
    supabaseAdminInstance = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  return supabaseAdminInstance;
})();