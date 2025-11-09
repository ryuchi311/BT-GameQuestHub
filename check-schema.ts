import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otheoutvqrphxqsggwxt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4NTE1NywiZXhwIjoyMDc2MDYxMTU3fQ.THGmhgu0VCs5mgGb2-0oUXc6Fqlzz0jQMivXE9pFL-A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check all tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_schema_info');
    
    if (tablesError) {
      console.log('📋 Trying to query users table directly...');
      
      // Try to get any existing user to see the schema
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (userError) {
        console.error('❌ Users table error:', userError.message);
        
        // Check if the table exists at all
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('id');
          
        if (testError) {
          console.error('❌ Table might not exist:', testError.message);
          console.log('🆕 Would you like me to create the users table?');
        }
      } else {
        console.log('✅ Users table structure (sample):');
        console.log(userData);
        
        if (userData && userData.length > 0) {
          console.log('📋 Available columns:', Object.keys(userData[0]));
        } else {
          console.log('📋 No users found in table, but table exists');
        }
      }
    }
    
    // Also check auth.users to see what data is available there
    console.log('\n🔍 Checking auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth users error:', authError.message);
    } else {
      console.log('✅ Auth users found:', authUsers.users.length);
      if (authUsers.users.length > 0) {
        console.log('📋 Sample auth user structure:', Object.keys(authUsers.users[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

checkSchema().then(() => {
  console.log('\n🏁 Schema check complete');
});