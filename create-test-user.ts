import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otheoutvqrphxqsggwxt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4NTE1NywiZXhwIjoyMDc2MDYxMTU3fQ.THGmhgu0VCs5mgGb2-0oUXc6Fqlzz0jQMivXE9pFL-A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  console.log('🧪 Creating test regular user...');
  
  const email = 'testuser@example.com';
  const password = 'testpass123';
  const name = 'Test User';
  
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'user' // Regular user role
      }
    });
    
    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('✅ Test user already exists');
        
        // Get existing user and update
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.find((u: any) => u.email === email);
        if (existingUser) {
          console.log('🔄 Updating existing user...');
          await supabase.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
            user_metadata: {
              name,
              role: 'user'
            }
          });
        }
        
        return;
      } else {
        throw authError;
      }
    }
    
    console.log('✅ Test user created successfully!');
    console.log('📝 User ID:', authData.user?.id);
    
    // Create corresponding database user record
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          telegram_id: 999999998, // Test telegram ID
          username: 'test_user',
          first_name: 'Test',
          last_name: 'User',
          points: 250, // Give some starting points
          total_earned_points: 250,
          is_active: true,
          is_banned: false
        }, {
          onConflict: 'id'
        });
      
      if (dbError) {
        console.log('⚠️ Could not create database record:', dbError.message);
      } else {
        console.log('✅ Database user profile created!');
      }
    }
    
    console.log('\n🎉 Test user setup complete!');
    console.log('📝 Login credentials:');
    console.log('   📧 Email:', email);
    console.log('   🔑 Password:', password);
    console.log('   🔗 User URL: http://localhost:3001/');
    
  } catch (error) {
    console.error('❌ Failed to create test user:', error);
  }
}

createTestUser().then(() => {
  console.log('\n🏁 Test user creation complete');
});