import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otheoutvqrphxqsggwxt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4NTE1NywiZXhwIjoyMDc2MDYxMTU3fQ.THGmhgu0VCs5mgGb2-0oUXc6Fqlzz0jQMivXE9pFL-A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAllTables() {
  console.log('🗃️ Checking all database tables...\n');

  const tablesToCheck = [
    'users',
    'quests', 
    'rewards',
    'quest_submissions',
    'user_rewards',
    'activities',
    'leaderboard'
  ];

  for (const tableName of tablesToCheck) {
    console.log(`📋 Table: ${tableName}`);
    console.log('─'.repeat(50));
    
    try {
      // Get table structure and sample data
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);
      
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        
        // Check if table exists with a different approach
        const { data: existsData, error: existsError } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);
          
        if (existsError) {
          console.log(`❌ Table does not exist: ${existsError.message}`);
        }
      } else {
        console.log(`✅ Table exists with ${data.length} sample records`);
        
        if (data && data.length > 0) {
          console.log('📄 Sample data:');
          console.log(JSON.stringify(data[0], null, 2));
          console.log('\n📊 Columns:', Object.keys(data[0]).join(', '));
        } else {
          console.log('📄 Table is empty');
          
          // Try to get column info by inserting and rolling back
          try {
            const { error: insertError } = await supabase
              .from(tableName)
              .insert({});
            
            if (insertError) {
              console.log('📊 Column info from error:', insertError.message);
            }
          } catch (e) {
            console.log('📊 Could not determine columns');
          }
        }
        
        // Get count
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
          
        if (!countError) {
          console.log(`📈 Total records: ${count}`);
        }
      }
    } catch (error) {
      console.log(`❌ Failed to check table: ${error}`);
    }
    
    console.log('\n');
  }

  // Check auth.users separately
  console.log('🔐 Auth Users Table');
  console.log('─'.repeat(50));
  
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else {
      console.log(`✅ Auth users found: ${authData.users.length}`);
      
      if (authData.users.length > 0) {
        const sampleUser = authData.users[0];
        console.log('📄 Sample auth user:');
        console.log(JSON.stringify({
          id: sampleUser.id,
          email: sampleUser.email,
          email_confirmed_at: sampleUser.email_confirmed_at,
          user_metadata: sampleUser.user_metadata,
          app_metadata: sampleUser.app_metadata,
          created_at: sampleUser.created_at,
          last_sign_in_at: sampleUser.last_sign_in_at
        }, null, 2));
      }
    }
  } catch (error) {
    console.log('❌ Failed to check auth users:', error);
  }
}

checkAllTables().then(() => {
  console.log('\n🏁 Database schema check complete');
});