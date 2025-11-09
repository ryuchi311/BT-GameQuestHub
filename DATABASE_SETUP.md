# GameQuestHub - Example Data Setup

This directory contains scripts to populate your Supabase database with example quest and reward data to get your GameQuestHub application up and running quickly.

## 📋 What's Included

### Quest Data (17 quests)
- **YouTube Quests**: Subscribe, watch videos, like and comment
- **Twitter/X Quests**: Follow, retweet, quote tweet
- **TikTok Quests**: Follow and like content
- **Discord Quests**: Join the community server
- **Telegram Quests**: Join the news channel
- **Sponsored Quests**: High-value partner quests
- **Referral Quests**: Community growth incentives
- **Epic Quests**: Long-term challenges for dedicated users

### Reward Data (18 rewards)
- **Digital Rewards**: Steam cards, Epic Games credits, Discord Nitro
- **Physical Rewards**: Gaming gear (headsets, keyboards, chairs, monitors)
- **Voucher Rewards**: Pizza, Amazon, Netflix vouchers
- **Cryptocurrency**: Bitcoin and Ethereum rewards
- **Exclusive Rewards**: VIP Discord roles, beta access

## 🚀 Quick Setup

### 1. Environment Variables
First, make sure you have your Supabase credentials set up:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual Supabase credentials
nano .env
```

Your `.env` should contain:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Database Setup
Your Supabase database should have these tables:
- `users`
- `quests`
- `quest_submissions`
- `rewards`
- `reward_claims`

### 3. Run Population Scripts

#### Option 1: Run Everything (Recommended)
```bash
npm run setup-db
```
This will populate both quests and rewards with comprehensive example data.

#### Option 2: Run Individual Scripts
```bash
# Populate only quests
npm run populate-quests

# Populate only rewards
npm run populate-rewards
```

## 📊 Data Overview

### Quest Distribution
- **Easy Quests**: 8 quests (50-150 points)
- **Medium Quests**: 6 quests (120-300 points)
- **Hard Quests**: 2 quests (1000-2000 points)
- **Epic Quests**: 2 quests (2000-5000 points)

### Reward Tiers
- **Low Tier**: $5-15 value (500-1500 points)
- **Mid Tier**: $15-50 value (1500-5000 points)
- **High Tier**: $50-200 value (5000-15000 points)
- **Premium Tier**: $200+ value (15000+ points)

### Platform Coverage
- **YouTube**: 3 quests
- **Twitter/X**: 3 quests
- **TikTok**: 2 quests
- **Discord**: 1 quest
- **Telegram**: 1 quest
- **Other/Web**: 7 quests

## 🎯 Usage Instructions

### After Running the Scripts

1. **Start your application**:
   ```bash
   npm run dev
   ```

2. **Create user accounts**: Users can sign up and start completing quests

3. **Admin features**: 
   - Use the admin dashboard to verify quest submissions
   - Monitor user activity and reward claims

4. **Test the flow**:
   - Complete easy quests to earn points
   - Redeem rewards from the rewards page
   - Check leaderboards for user rankings

## 🔧 Customization

### Adding More Quests
Edit `populate-quests.ts` and add new quest objects to the `exampleQuests` array:

```typescript
{
  title: "Your Quest Title",
  description: "Quest description...",
  platform: QuestPlatform.YouTube,
  type: QuestType.Subscribe,
  reward: 100,
  difficulty: QuestDifficulty.Easy,
  // ... other properties
}
```

### Adding More Rewards
Edit `populate-rewards.ts` and add new reward objects to the `exampleRewards` array:

```typescript
{
  title: "Reward Title",
  name: "Reward Name",
  description: "Reward description...",
  cost: 1000,
  points_required: 1000,
  imageUrl: "https://example.com/image.jpg",
  status: "active",
  type: "digital",
  // ... other properties
}
```

## 🚫 Troubleshooting

### Common Issues

1. **Permission Errors**: Make sure your `SUPABASE_SERVICE_ROLE_KEY` is correct
2. **Connection Issues**: Verify your `VITE_SUPABASE_URL` is correct
3. **Table Missing**: Ensure your database schema is set up correctly

### Error Messages
- `Missing required environment variables`: Check your `.env` file
- `Error inserting quest/reward`: Check database schema and constraints
- `Cannot find name 'SubmissionStatus'`: TypeScript compilation issue, check imports

## 📈 Analytics

After populating the data, you can monitor:
- User quest completion rates
- Most popular rewards
- Platform engagement (which social media quests are most completed)
- Point distribution and economy balance

## 🎮 Happy Questing!

Your GameQuestHub is now ready with comprehensive example data. Users can start earning points, completing quests, and redeeming awesome rewards!