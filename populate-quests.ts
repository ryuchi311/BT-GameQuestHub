import { supabaseAdmin } from './src/lib/supabase';
import { Quest, QuestPlatform, QuestType, QuestDifficulty, VerificationType } from './src/types';

const exampleQuests: Omit<Quest, 'id'>[] = [
  // YouTube Quests
  {
    title: "Subscribe to GameQuestHub Channel",
    description: "Subscribe to our official YouTube channel and get 100 points! Don't forget to hit the notification bell.",
    platform: QuestPlatform.YouTube,
    type: QuestType.Subscribe,
    reward: 100,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://youtube.com/@gamequesthub",
    isDaily: false,
    isNew: true,
    isSponsored: false,
  },
  {
    title: "Watch: Top 10 Gaming Tips",
    description: "Watch our latest video about the top 10 gaming tips for beginners. Leave a comment with your favorite tip!",
    platform: QuestPlatform.YouTube,
    type: QuestType.Watch,
    reward: 75,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://youtube.com/watch?v=example123",
    validationCode: "GAMETIP2024",
    isDaily: true,
    isNew: false,
    isSponsored: false,
  },
  {
    title: "Like and Comment on Latest Review",
    description: "Like our latest game review video and leave a thoughtful comment about your gaming experience.",
    platform: QuestPlatform.YouTube,
    type: QuestType.Like,
    reward: 50,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://youtube.com/watch?v=review456",
    isDaily: true,
    isNew: false,
    isSponsored: false,
  },

  // Twitter/X Quests
  {
    title: "Follow @GameQuestHub",
    description: "Follow our official Twitter account for the latest gaming news, quest updates, and exclusive content!",
    platform: QuestPlatform.Twitter,
    type: QuestType.Follow,
    reward: 80,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://twitter.com/gamequesthub",
    isDaily: false,
    isNew: true,
    isSponsored: false,
  },
  {
    title: "Retweet Our Gaming Setup Post",
    description: "Retweet our latest post about the ultimate gaming setup. Tag 3 friends who would love this!",
    platform: QuestPlatform.Twitter,
    type: QuestType.Retweet,
    reward: 120,
    difficulty: QuestDifficulty.Medium,
    verificationType: VerificationType.Manual,
    questUrl: "https://twitter.com/gamequesthub/status/123456789",
    isDaily: true,
    isNew: false,
    isSponsored: false,
  },
  {
    title: "Quote Tweet with Gaming Memory",
    description: "Quote tweet our post about favorite gaming moments. Share your most memorable gaming experience!",
    platform: QuestPlatform.Twitter,
    type: QuestType.QuoteTweet,
    reward: 150,
    difficulty: QuestDifficulty.Medium,
    verificationType: VerificationType.Manual,
    questUrl: "https://twitter.com/gamequesthub/status/987654321",
    isDaily: false,
    isNew: false,
    isSponsored: false,
  },

  // TikTok Quests
  {
    title: "Follow GameQuestHub on TikTok",
    description: "Follow our TikTok account for quick gaming tips, reviews, and funny gaming moments!",
    platform: QuestPlatform.TikTok,
    type: QuestType.Follow,
    reward: 90,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://tiktok.com/@gamequesthub",
    isDaily: false,
    isNew: true,
    isSponsored: false,
  },
  {
    title: "Like Our Gaming Compilation",
    description: "Like our latest TikTok compilation of epic gaming fails and wins. It's hilarious!",
    platform: QuestPlatform.TikTok,
    type: QuestType.Like,
    reward: 60,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://tiktok.com/@gamequesthub/video/123",
    isDaily: true,
    isNew: false,
    isSponsored: false,
  },

  // Discord Quests
  {
    title: "Join GameQuestHub Discord",
    description: "Join our Discord community! Connect with fellow gamers, share tips, and participate in community events.",
    platform: QuestPlatform.Discord,
    type: QuestType.Join,
    reward: 200,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://discord.gg/gamequesthub",
    isDaily: false,
    isNew: true,
    isSponsored: false,
  },

  // Telegram Quests
  {
    title: "Join Telegram Gaming News",
    description: "Join our Telegram channel for instant gaming news, updates, and exclusive quest announcements!",
    platform: QuestPlatform.Telegram,
    type: QuestType.Join,
    reward: 150,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://t.me/gamequesthub",
    isDaily: false,
    isNew: false,
    isSponsored: false,
  },

  // Sponsored Quests
  {
    title: "Try Epic Games Store - Free Game",
    description: "Visit Epic Games Store and claim this week's free game. Screenshot your library showing the claimed game.",
    platform: QuestPlatform.Other,
    type: QuestType.Visit,
    reward: 500,
    difficulty: QuestDifficulty.Medium,
    verificationType: VerificationType.Manual,
    questUrl: "https://store.epicgames.com/en-US/free-games",
    isDaily: false,
    isNew: true,
    isSponsored: true,
  },
  {
    title: "Steam Wishlist - Indie Game",
    description: "Visit the featured indie game on Steam and add it to your wishlist. Support indie developers!",
    platform: QuestPlatform.Other,
    type: QuestType.Visit,
    reward: 300,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://store.steampowered.com/app/example",
    isDaily: false,
    isNew: false,
    isSponsored: true,
  },

  // Referral Quests
  {
    title: "Refer 3 Friends",
    description: "Invite 3 friends to join GameQuestHub. They need to complete their first quest for you to get the reward!",
    platform: QuestPlatform.Other,
    type: QuestType.Referral,
    reward: 1000,
    difficulty: QuestDifficulty.Hard,
    verificationType: VerificationType.Automatic,
    questUrl: "https://gamequesthub.com/referral",
    isDaily: false,
    isNew: false,
    isSponsored: false,
  },

  // High-value Epic Quests
  {
    title: "Complete Weekly Gaming Challenge",
    description: "Complete all daily quests for 7 consecutive days. This epic quest requires dedication and consistency!",
    platform: QuestPlatform.Other,
    type: QuestType.Visit,
    reward: 2000,
    difficulty: QuestDifficulty.Epic,
    verificationType: VerificationType.Automatic,
    questUrl: "https://gamequesthub.com/weekly-challenge",
    isDaily: false,
    isNew: true,
    isSponsored: false,
  },
  {
    title: "Master Quest Hunter",
    description: "Complete 50 quests across all platforms. Become a true Quest Master and earn this prestigious badge!",
    platform: QuestPlatform.Other,
    type: QuestType.Visit,
    reward: 5000,
    difficulty: QuestDifficulty.Epic,
    verificationType: VerificationType.Automatic,
    questUrl: "https://gamequesthub.com/master-hunter",
    isDaily: false,
    isNew: false,
    isSponsored: false,
  },

  // Additional Daily Quests
  {
    title: "Share Gaming Screenshot",
    description: "Share your best gaming screenshot on Twitter with #GameQuestHub and tag us!",
    platform: QuestPlatform.Twitter,
    type: QuestType.Share,
    reward: 180,
    difficulty: QuestDifficulty.Medium,
    verificationType: VerificationType.Manual,
    questUrl: "https://twitter.com/intent/tweet?hashtags=GameQuestHub",
    isDaily: true,
    isNew: false,
    isSponsored: false,
  },
  {
    title: "Comment on Gaming Discussion",
    description: "Join the discussion in our latest YouTube video about gaming trends. Share your opinion!",
    platform: QuestPlatform.YouTube,
    type: QuestType.Comment,
    reward: 100,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: "https://youtube.com/watch?v=discussion789",
    isDaily: true,
    isNew: false,
    isSponsored: false,
  },
];

async function populateQuestData() {
  try {
    console.log('Starting to populate quest data...');
    
    // Insert quests one by one to handle any errors
    for (const quest of exampleQuests) {
      try {
        const { data, error } = await supabaseAdmin
          .from('quests')
          .insert(quest)
          .select()
          .single();

        if (error) {
          console.error('Error inserting quest:', quest.title, error);
        } else {
          console.log('✅ Inserted quest:', quest.title);
        }
      } catch (err) {
        console.error('Exception inserting quest:', quest.title, err);
      }
    }

    console.log(`\n🎉 Successfully populated ${exampleQuests.length} example quests!`);
    console.log('\nQuest categories included:');
    console.log('- Daily quests for regular engagement');
    console.log('- Social media quests (YouTube, Twitter, TikTok, Discord, Telegram)');
    console.log('- Sponsored quests with higher rewards');
    console.log('- Epic quests for dedicated users');
    console.log('- Referral quests for community growth');

  } catch (error) {
    console.error('Error populating quest data:', error);
  }
}

// Run the population script
populateQuestData();