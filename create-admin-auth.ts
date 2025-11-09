import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otheoutvqrphxqsggwxt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4NTE1NywiZXhwIjoyMDc2MDYxMTU3fQ.THGmhgu0VCs5mgGb2-0oUXc6Fqlzz0jQMivXE9pFL-A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminAuth() {
  const email = 'ryuchicago@gmail.com';
  const password = '123456';
  
  console.log('🔐 Creating admin user with auth metadata...');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);

  try {
    // Try to get existing user by listing all users
    console.log('👤 Looking for existing user...');
    
    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      return;
    }
    
    const existingUser = usersList.users.find((user: any) => user.email === email);
    
    if (existingUser) {
      console.log('✅ Found existing user, updating with admin role...');
      
      // Update user with admin role in user_metadata
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password: password,
          email_confirm: true,
          user_metadata: {
            ...existingUser.user_metadata,
            role: 'admin',
            name: 'Admin User'
          }
        }
      );
      
      if (updateError) {
        console.error('❌ Failed to update user:', updateError.message);
        return;
      }
      
      console.log('✅ User updated successfully!');
      console.log('🔑 User ID:', updateData.user?.id);
      console.log('📋 User metadata:', updateData.user?.user_metadata);
      
      // Create entry in users table if needed (for points tracking)
      console.log('\n🎮 Creating game profile entry...');
      
      const { error: gameProfileError } = await supabase
        .from('users')
        .upsert({
          id: updateData.user?.id,
          telegram_id: 999999999, // Dummy telegram ID for admin
          username: 'admin_user',
          first_name: 'Admin',
          last_name: 'User',
          points: 10000,
          total_earned_points: 10000,
          is_active: true,
          is_banned: false
        }, {
          onConflict: 'id'
        });
      
      if (gameProfileError) {
        console.error('⚠️ Could not create game profile:', gameProfileError.message);
        console.log('💡 This is okay - admin can still login, just won\'t have game stats');
      } else {
        console.log('✅ Game profile created/updated!');
      }
      
    } else {
      console.log('👤 Creating new admin user...');
      
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          name: 'Admin User'
        }
      });
      
      if (createError) {
        console.error('❌ Failed to create user:', createError.message);
        return;
      }
      
      console.log('✅ Admin user created successfully!');
      console.log('🔑 User ID:', createData.user?.id);
      console.log('📋 User metadata:', createData.user?.user_metadata);
    }
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('📝 Login credentials:');
    console.log('   📧 Email:', email);
    console.log('   🔑 Password:', password);
    console.log('   🔗 Admin URL: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

createAdminAuth().then(() => {
  console.log('\n🏁 Process complete');
});