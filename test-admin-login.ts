import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otheoutvqrphxqsggwxt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODUxNTcsImV4cCI6MjA3NjA2MTE1N30.AHS_9Iq8EfM4O2liu0947dszn4NOFXqFKsOflVyu3Gc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminLogin() {
  const email = 'ryuchicago@gmail.com';
  const password = '123456';
  
  console.log('🔐 Testing admin login...');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);

  try {
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('   Error details:', error);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('👤 User ID:', data.user?.id);
    console.log('📧 Email:', data.user?.email);
    console.log('🔑 Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
    console.log('📋 User metadata:', JSON.stringify(data.user?.user_metadata, null, 2));
    console.log('🔒 Session access token exists:', !!data.session?.access_token);
    
    // Check if user has admin role
    const isAdmin = data.user?.user_metadata?.role === 'admin';
    console.log('👑 Is Admin:', isAdmin ? 'Yes' : 'No');
    
    if (!isAdmin) {
      console.log('⚠️  User does not have admin role!');
    }
    
    // Sign out
    await supabase.auth.signOut();
    console.log('🚪 Signed out successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminLogin().then(() => {
  console.log('\n🏁 Test complete');
});