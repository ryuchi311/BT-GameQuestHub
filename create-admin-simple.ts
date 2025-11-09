import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSimpleAdminUser() {
  const email = 'ryuchicago@gmail.com';
  const password = '123456';
  const name = 'Admin User';

  try {
    console.log('🔐 Creating temporary admin user...');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    // Step 1: Create auth user
    console.log('👤 Creating authentication user...');
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    let userId: string | null = null;

    if (authError) {
      if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
        console.log('👤 User already exists in auth, getting user info...');
        
        // Get existing user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.find((u: any) => u.email === email);
        if (!existingUser) throw new Error('Could not find existing user');
        
        userId = existingUser.id;
        console.log(`✅ Found existing user: ${userId}`);
        
        // Update password for existing user
        console.log('� Updating password...');
        const { error: updateAuthError } = await supabase.auth.admin.updateUserById(userId, {
          password
        });
        
        if (updateAuthError) {
          console.log('⚠️  Warning: Could not update password:', updateAuthError.message);
        } else {
          console.log('✅ Password updated successfully');
        }
        
      } else {
        console.error('❌ Auth error:', authError.message);
        return;
      }
    } else if (authData.user) {
      userId = authData.user.id;
      console.log('✅ Auth user created successfully');
      console.log(`� User ID: ${userId}`);
    }

    // Step 2: Create or update user profile
    console.log('📝 Creating/updating user profile...');
    
    // First try to update existing profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        role: 'admin',
        points: 10000
      })
      .eq('id', userId);

    if (updateError) {
      console.log('📝 User profile might not exist, creating it...');
      
      // Try to create profile with various column name possibilities
      const profileData = {
        id: userId,
        name,
        email,
        role: 'admin',
        level: 1,
        xp: 0,
        points: 10000
      };

      // Try with camelCase column names
      const { error: insertError1 } = await supabase
        .from('users')
        .insert({
          ...profileData,
          maxXp: 100,
          questsCompleted: 0
        });

      if (insertError1) {
        console.log('🔄 Trying snake_case column names...');
        // Try with snake_case column names
        const { error: insertError2 } = await supabase
          .from('users')
          .insert({
            ...profileData,
            max_xp: 100,
            quests_completed: 0
          });
          
        if (insertError2) {
          console.log('🔄 Trying minimal profile...');
          // Try with minimal required fields
          const { error: insertError3 } = await supabase
            .from('users')
            .insert({
              id: userId,
              email,
              role: 'admin',
              points: 10000
            });
            
          if (insertError3) {
            console.error('❌ All profile creation attempts failed:');
            console.error('   - CamelCase error:', insertError1.message);
            console.error('   - Snake_case error:', insertError2.message);
            console.error('   - Minimal error:', insertError3.message);
            return;
          } else {
            console.log('✅ Minimal user profile created successfully!');
          }
        } else {
          console.log('✅ User profile created with snake_case columns!');
        }
      } else {
        console.log('✅ User profile created with camelCase columns!');
      }
    } else {
      console.log('✅ User profile updated successfully!');
    }

    console.log('\n🎉 Temporary admin user setup complete!');
    console.log('📋 Admin credentials:');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Password: ${password}`);
    console.log(`   👑 Role: admin`);
    console.log(`   💰 Points: 10,000`);
    console.log('\n🔗 Access admin panel at: http://localhost:3000/admin');
    console.log('\n⚠️  SECURITY WARNING:');
    console.log('   - This is a temporary password: ' + password);
    console.log('   - Change the password immediately after first login');
    console.log('   - Do not use this in production');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSimpleAdminUser();