import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otheoutvqrphxqsggwxt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aGVvdXR2cXJwaHhxc2dnd3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4NTE1NywiZXhwIjoyMDc2MDYxMTU3fQ.THGmhgu0VCs5mgGb2-0oUXc6Fqlzz0jQMivXE9pFL-A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTables() {
  console.log('🗃️ Creating missing database tables...\n');

  try {
    // Insert sample quests directly (table might exist)
    console.log('🎯 Inserting sample quest data...');
    
    const sampleQuests = [
      {
        title: 'Follow on Twitter',
        description: 'Follow our official Twitter account and like the latest post',
        platform: 'twitter',
        quest_type: 'social',
        difficulty: 'easy',
        points_reward: 100,
        xp_reward: 50,
        requirements: { action: 'follow', username: 'gamequesthub' },
        verification_method: 'manual'
      },
      {
        title: 'Join Discord Server',
        description: 'Join our Discord community and introduce yourself',
        platform: 'discord',
        quest_type: 'social',
        difficulty: 'easy',
        points_reward: 150,
        xp_reward: 75,
        requirements: { action: 'join', server_id: 'gamequesthub' },
        verification_method: 'manual'
      },
      {
        title: 'Complete Profile',
        description: 'Fill out your complete profile information',
        platform: 'platform',
        quest_type: 'onboarding',
        difficulty: 'easy',
        points_reward: 200,
        xp_reward: 100,
        requirements: { fields: ['name', 'bio', 'avatar'] },
        verification_method: 'automatic'
      }
    ];

    // First, try to check if quests table exists
    console.log('📋 Checking if quests table exists...');
    const { data: existingQuests, error: questsCheckError } = await supabase
      .from('quests')
      .select('*')
      .limit(1);

    if (questsCheckError) {
      console.log('❌ Quests table does not exist:', questsCheckError.message);
      console.log('💡 You may need to create the quests table manually in Supabase dashboard');
      console.log(`
📋 Quests Table Schema:
CREATE TABLE public.quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  platform VARCHAR NOT NULL,
  quest_type VARCHAR NOT NULL,
  difficulty VARCHAR NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  requirements JSONB,
  verification_method VARCHAR NOT NULL DEFAULT 'manual',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ Quests table exists');
      
      for (const quest of sampleQuests) {
        const { error: insertError } = await supabase
          .from('quests')
          .insert(quest);
        
        if (insertError) {
          console.log(`⚠️ Could not insert quest "${quest.title}":`, insertError.message);
        } else {
          console.log(`✅ Inserted quest: ${quest.title}`);
        }
      }
    }

    // Check quest_submissions table
    console.log('\n📋 Checking quest_submissions table...');
    const { error: submissionsCheckError } = await supabase
      .from('quest_submissions')
      .select('*')
      .limit(1);

    if (submissionsCheckError) {
      console.log('❌ Quest submissions table does not exist');
      console.log(`
📋 Quest Submissions Table Schema:
CREATE TABLE public.quest_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR NOT NULL DEFAULT 'pending',
  submission_data JSONB,
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);
      `);
    } else {
      console.log('✅ Quest submissions table exists');
    }

    // Check activities table
    console.log('\n📋 Checking activities table...');
    const { error: activitiesCheckError } = await supabase
      .from('activities')
      .select('*')
      .limit(1);

    if (activitiesCheckError) {
      console.log('❌ Activities table does not exist');
      console.log(`
📋 Activities Table Schema:
CREATE TABLE public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type VARCHAR NOT NULL,
  description TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  quest_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ Activities table exists');
    }

    // Test sample data queries
    console.log('\n🔍 Testing data queries...');
    
    // Get users for leaderboard
    const { data: leaderboardData } = await supabase
      .from('users')
      .select('id, username, first_name, points')
      .order('points', { ascending: false })
      .limit(5);
    
    console.log('🏆 Top users by points:');
    leaderboardData?.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username || user.first_name || 'Anonymous'} - ${user.points} points`);
    });

    // Get rewards
    const { data: rewardsData } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .limit(3);
    
    console.log('\n🎁 Available rewards:');
    rewardsData?.forEach(reward => {
      console.log(`  • ${reward.title} - ${reward.points_cost} points`);
    });

  } catch (error) {
    console.error('❌ Failed to setup database:', error);
  }
}

createMissingTables().then(() => {
  console.log('\n🏁 Database check complete');
});