import { supabaseAdmin } from './src/lib/supabase';
import { Reward } from './src/types';

const exampleRewards: Omit<Reward, 'id'>[] = [
  // Digital Rewards
  {
    title: "Steam Gift Card",
    name: "Steam $5 Gift Card",
    description: "Get a $5 Steam gift card to purchase your favorite games or in-game content.",
    cost: 500,
    points_required: 500,
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop",
    status: "active",
    type: "digital",
    quantity: 100,
  },
  {
    title: "Steam Gift Card",
    name: "Steam $10 Gift Card",
    description: "Get a $10 Steam gift card for even more gaming possibilities!",
    cost: 1000,
    points_required: 1000,
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop",
    status: "active",
    type: "digital",
    quantity: 50,
  },
  {
    title: "Epic Games Store Credit",
    name: "Epic Games $5 Credit",
    description: "Epic Games Store credit to use on games, DLC, and exclusive content.",
    cost: 500,
    points_required: 500,
    imageUrl: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=200&fit=crop",
    status: "active",
    type: "digital",
    quantity: 75,
  },
  {
    title: "Discord Nitro",
    name: "Discord Nitro - 1 Month",
    description: "1 month of Discord Nitro with enhanced chat, higher quality screen sharing, and more!",
    cost: 800,
    points_required: 800,
    imageUrl: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=300&h=200&fit=crop",
    status: "active",
    type: "digital",
    quantity: 25,
  },

  // Physical Rewards
  {
    title: "Gaming Mouse Pad",
    name: "GameQuestHub XL Mouse Pad",
    description: "Premium XL gaming mouse pad with GameQuestHub logo. Perfect for precision gaming!",
    cost: 1200,
    points_required: 1200,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
    status: "active",
    type: "physical",
    quantity: 20,
  },
  {
    title: "Gaming Headset",
    name: "Pro Gaming Headset",
    description: "High-quality gaming headset with noise cancellation and crystal-clear microphone.",
    cost: 5000,
    points_required: 5000,
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop",
    status: "active",
    type: "physical",
    quantity: 5,
  },
  {
    title: "Gaming Keyboard",
    name: "Mechanical RGB Gaming Keyboard",
    description: "Mechanical gaming keyboard with RGB lighting and programmable keys.",
    cost: 8000,
    points_required: 8000,
    imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop",
    status: "active",
    type: "physical",
    quantity: 3,
  },
  {
    title: "GameQuestHub T-Shirt",
    name: "Official GameQuestHub T-Shirt",
    description: "Comfortable cotton t-shirt with the official GameQuestHub logo. Available in multiple sizes.",
    cost: 2000,
    points_required: 2000,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
    status: "active",
    type: "physical",
    quantity: 15,
  },

  // Voucher Rewards
  {
    title: "Pizza Voucher",
    name: "Domino's Pizza Voucher",
    description: "$15 voucher for Domino's Pizza. Fuel your gaming sessions with delicious pizza!",
    cost: 1500,
    points_required: 1500,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
    status: "active",
    type: "voucher",
    quantity: 30,
  },
  {
    title: "Amazon Voucher",
    name: "Amazon $10 Gift Card",
    description: "Amazon gift card to purchase anything you want - gaming gear, books, electronics, and more!",
    cost: 1000,
    points_required: 1000,
    imageUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=300&h=200&fit=crop",
    status: "active",
    type: "voucher",
    quantity: 40,
  },
  {
    title: "Netflix Subscription",
    name: "Netflix - 1 Month Subscription",
    description: "1 month Netflix subscription to enjoy movies and shows during your gaming breaks.",
    cost: 1500,
    points_required: 1500,
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
    status: "active",
    type: "voucher",
    quantity: 20,
  },

  // Cryptocurrency Rewards
  {
    title: "Bitcoin Reward",
    name: "$5 Bitcoin",
    description: "Get $5 worth of Bitcoin transferred to your wallet. Perfect introduction to cryptocurrency!",
    cost: 600,
    points_required: 600,
    imageUrl: "https://images.unsplash.com/photo-1518544866330-4bf6b9d611c0?w=300&h=200&fit=crop",
    status: "active",
    type: "cryptocurrency",
    quantity: 10,
  },
  {
    title: "Ethereum Reward",
    name: "$10 Ethereum",
    description: "$10 worth of Ethereum (ETH) transferred to your crypto wallet.",
    cost: 1100,
    points_required: 1100,
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop",
    status: "active",
    type: "cryptocurrency",
    quantity: 8,
  },

  // Exclusive/Limited Rewards
  {
    title: "VIP Discord Role",
    name: "VIP Discord Member",
    description: "Exclusive VIP role in our Discord server with special channels and early access to announcements.",
    cost: 3000,
    points_required: 3000,
    imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=200&fit=crop",
    status: "active",
    type: "digital",
    quantity: 50,
  },
  {
    title: "Quest Beta Access",
    name: "Beta Tester Access",
    description: "Get early access to new quest features and help shape the future of GameQuestHub!",
    cost: 2500,
    points_required: 2500,
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
    status: "active",
    type: "digital",
    quantity: 100,
  },

  // High-tier rewards
  {
    title: "Gaming Chair",
    name: "Ergonomic Gaming Chair",
    description: "Premium ergonomic gaming chair with lumbar support, adjustable height, and RGB lighting.",
    cost: 15000,
    points_required: 15000,
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop",
    status: "active",
    type: "physical",
    quantity: 2,
  },
  {
    title: "Gaming Monitor",
    name: "24-inch 144Hz Gaming Monitor",
    description: "High-refresh rate gaming monitor with 1ms response time and adaptive sync technology.",
    cost: 25000,
    points_required: 25000,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop",
    status: "active",
    type: "physical",
    quantity: 1,
  }
];

async function populateRewardData() {
  try {
    console.log('Starting to populate reward data...');
    
    // Insert rewards one by one to handle any errors
    for (const reward of exampleRewards) {
      try {
        const { data, error } = await supabaseAdmin
          .from('rewards')
          .insert(reward)
          .select()
          .single();

        if (error) {
          console.error('Error inserting reward:', reward.title, error);
        } else {
          console.log('✅ Inserted reward:', reward.title);
        }
      } catch (err) {
        console.error('Exception inserting reward:', reward.title, err);
      }
    }

    console.log(`\n🎉 Successfully populated ${exampleRewards.length} example rewards!`);
    console.log('\nReward categories included:');
    console.log('- Digital rewards (Gift cards, subscriptions, game credits)');
    console.log('- Physical rewards (Gaming gear, merchandise)');
    console.log('- Voucher rewards (Food, shopping, entertainment)');
    console.log('- Cryptocurrency rewards (Bitcoin, Ethereum)');
    console.log('- Exclusive rewards (VIP access, beta testing)');

  } catch (error) {
    console.error('Error populating reward data:', error);
  }
}

// Run the population script
populateRewardData();