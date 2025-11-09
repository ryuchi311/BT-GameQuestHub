import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

// Create Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please make sure you have set:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTempAdminUser() {
  const email = 'ryuchicago@gmail.com';
  const password = '123456'; // Changed to 6 characters to meet Supabase requirement
  const name = 'Admin User';

  try {
    console.log('🔐 Creating temporary admin user...');
    
    // First, try to sign up the user
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (signUpError) {
      // If user already exists, we'll sign them in instead
      if (signUpError.message.includes('already registered')) {
        console.log('👤 User already exists, signing in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('❌ Error signing in existing user:', signInError.message);
          
          // Try to update existing user to admin role
          console.log('🔄 Attempting to update existing user to admin role...');
          
          // First get the user by email
          const { data: users, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

          if (fetchError) {
            console.error('❌ Error fetching user:', fetchError.message);
            return;
          }

          if (users && users.length > 0) {
            const userId = users[0].id;
            
            // Update the user role to admin
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                role: 'admin',
                points: 10000 // Give admin some points for testing
              })
              .eq('id', userId);

            if (updateError) {
              console.error('❌ Error updating user role:', updateError.message);
              return;
            }

            console.log('✅ Successfully updated existing user to admin!');
            console.log('🎯 Admin credentials ready:');
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);
            console.log('🔗 You can now login at: http://localhost:3000/admin');
            return;
          }
        } else {
          console.log('✅ User signed in successfully');
        }
      } else {
        console.error('❌ Signup error:', signUpError.message);
        return;
      }
    }

    // Create or update user profile with admin role
    if (authData.user) {
      console.log('👤 Creating admin user profile...');
      
      try {
        // Try to create new user profile directly
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            name,
            role: 'admin',
            level: 1,
            xp: 0,
            maxXp: 100,
            points: 10000, // Give admin some points for testing
            questsCompleted: 0,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }
        
        console.log('✅ Admin user profile created successfully!');
      } catch (error: any) {
        if (error.message?.includes('duplicate key')) {
          console.log('👤 User profile already exists, updating role...');
          
          // Update existing profile to admin
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              role: 'admin',
              points: 10000
            })
            .eq('id', authData.user.id);

          if (updateError) {
            console.error('❌ Error updating user role:', updateError.message);
            return;
          }
          
          console.log('✅ User role updated to admin!');
        } else {
          console.error('❌ Error creating user profile:', error);
          return;
        }
      }
    }

    console.log('\n🎉 Temporary admin user setup complete!');
    console.log('📋 Admin credentials:');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Password: ${password}`);
    console.log(`   👑 Role: admin`);
    console.log(`   💰 Points: 10,000 (for testing)`);
    console.log('\n🔗 Access admin panel at: http://localhost:3000/admin');
    console.log('\n⚠️  IMPORTANT: Change this password in production!');
    console.log('💡 The admin can change their password from the profile section.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    // Clean up auth session
    await supabase.auth.signOut();
  }
}

// Run the script
createTempAdminUser();