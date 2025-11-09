import { supabase, supabaseAdmin } from '../lib/supabase'
import type { User, Quest, Reward, QuestSubmission, SubmissionStatus } from '../types'

// Enable detailed logging for database operations
console.log('🗄️ Supabase service loaded');

// User operations - Updated to work with existing users table
export const userService = {
  async createUser(userData: Partial<User>) {
    console.log('👤 Creating user:', userData);
    
    // For Telegram users, map fields to the actual schema
    const dbUserData = {
      id: userData.id,
      telegram_id: userData.telegramId || Math.floor(Math.random() * 1000000000),
      username: userData.name || userData.telegramUsername,
      first_name: userData.name?.split(' ')[0],
      last_name: userData.name?.split(' ').slice(1).join(' ') || null,
      points: userData.points || 0,
      total_earned_points: 0,
      is_active: true,
      is_banned: false,
      twitter_username: userData.twitterUsername,
      instagram_username: userData.instagramUsername,
      discord_username: userData.discordUsername
    };

    console.log('📝 Database user data:', dbUserData);

    const { data, error } = await supabase
      .from('users')
      .insert(dbUserData)
      .select()
      .single()
    
    if (error) {
      console.error('❌ User creation error:', error);
      throw error;
    }
    
    console.log('✅ User created successfully:', data);
    
    // Map back to User type
    return {
      id: data.id,
      email: '', // Not stored in users table
      name: `${data.first_name} ${data.last_name}`.trim() || data.username,
      role: 'user',
      level: Math.floor(data.points / 500) + 1,
      xp: data.points % 500,
      maxXp: 500,
      points: data.points,
      questsCompleted: 0,
      telegramUsername: data.username,
      telegramId: data.telegram_id,
      twitterUsername: data.twitter_username,
      instagramUsername: data.instagram_username,
      discordUsername: data.discord_username
    } as User;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    // Map to User type
    return {
      id: data.id,
      email: '', // Not stored in users table
      name: `${data.first_name} ${data.last_name}`.trim() || data.username,
      role: 'user',
      level: Math.floor(data.points / 500) + 1,
      xp: data.points % 500,
      maxXp: 500,
      points: data.points,
      questsCompleted: 0,
      telegramUsername: data.username,
      telegramId: data.telegram_id,
      twitterUsername: data.twitter_username,
      instagramUsername: data.instagram_username,
      discordUsername: data.discord_username
    } as User;
  },

  async updateUser(id: string, updates: Partial<User>) {
    // Map User updates to database schema
    const dbUpdates: any = {};
    
    if (updates.name) {
      const nameParts = updates.name.split(' ');
      dbUpdates.first_name = nameParts[0];
      dbUpdates.last_name = nameParts.slice(1).join(' ') || null;
    }
    if (updates.points !== undefined) dbUpdates.points = updates.points;
    if (updates.telegramUsername) dbUpdates.username = updates.telegramUsername;
    if (updates.twitterUsername) dbUpdates.twitter_username = updates.twitterUsername;
    if (updates.instagramUsername) dbUpdates.instagram_username = updates.instagramUsername;
    if (updates.discordUsername) dbUpdates.discord_username = updates.discordUsername;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    // Map back to User type
    return {
      id: data.id,
      email: '', 
      name: `${data.first_name} ${data.last_name}`.trim() || data.username,
      role: 'user',
      level: Math.floor(data.points / 500) + 1,
      xp: data.points % 500,
      maxXp: 500,
      points: data.points,
      questsCompleted: 0,
      telegramUsername: data.username,
      telegramId: data.telegram_id,
      twitterUsername: data.twitter_username,
      instagramUsername: data.instagram_username,
      discordUsername: data.discord_username
    } as User;
  },

  async getLeaderboard(limit: number = 10) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, points')
      .order('points', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    return data.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim() || user.username || 'Anonymous',
      points: user.points,
      level: Math.floor(user.points / 500) + 1
    }));
  }
}

// Quest operations - fetching from database tasks table
export const questService = {
  async getQuests(userId?: string) {
    console.log('📋 Fetching quests from database...');
    
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching tasks:', error);
        throw error;
      }

      console.log('✅ Loaded', tasks?.length || 0, 'tasks from database');

      // If userId provided, get user's completion status
      let userTasks: any[] = [];
      if (userId) {
        const { data: completions, error: userError } = await supabase
          .from('user_tasks')
          .select('task_id, status, completed_at')
          .eq('user_id', userId);

        if (!userError && completions) {
          userTasks = completions;
        }
      }

      // Transform database tasks to Quest format
      const quests = tasks?.map(task => {
        const userTask = userTasks.find(ut => ut.task_id === task.id);
        const isCompleted = userTask?.status === 'completed';
        
        // Determine difficulty based on points
        let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
        if (task.points_reward >= 300) difficulty = 'Hard';
        else if (task.points_reward >= 150) difficulty = 'Medium';

        // Map task_type to quest type
        const typeMapping: Record<string, string> = {
          'youtube': 'Subscribe',
          'youtube_watch': 'Watch',
          'twitter_follow': 'Follow',
          'discord_join': 'Join',
          'visit_website': 'Visit',
          'telegram_join': 'Join',
        };

        return {
          id: task.id,
          title: task.title,
          description: task.description || 'Complete this quest to earn rewards',
          platform: task.platform || 'other',
          type: (typeMapping[task.task_type] || 'Other') as any,
          difficulty: difficulty as any,
          reward: task.points_reward,
          pointsReward: task.points_reward,
          xpReward: Math.floor(task.points_reward / 2),
          requirements: task.verification_data || {},
          verificationType: (task.verification_required ? 'Manual' : 'Automatic') as any,
          verificationMethod: task.verification_required ? 'manual' : 'automatic',
          questUrl: task.url || '#',
          isActive: task.is_active,
          isCompleted: isCompleted,
          isNew: !userTask, // New if user hasn't attempted it
          isDaily: task.task_type === 'daily_check_in',
          createdAt: task.created_at,
          timeLimit: task.video_duration_seconds || 0,
          youtubeVideoId: task.youtube_video_id,
          verificationCode: task.verification_code,
          minWatchTime: task.min_watch_time_seconds,
        };
      }) || [];

      return quests;
    } catch (error) {
      console.error('❌ Failed to fetch quests:', error);
      return [];
    }
  },

  async getQuestById(id: string, userId?: string) {
    console.log('🔍 Fetching quest by ID:', id);
    
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !task) {
        console.error('❌ Quest not found:', id);
        return null;
      }

      // Get user completion status if userId provided
      let userTask = null;
      if (userId) {
        const { data: completion } = await supabase
          .from('user_tasks')
          .select('*')
          .eq('user_id', userId)
          .eq('task_id', id)
          .single();
        
        userTask = completion;
      }

      const isCompleted = userTask?.status === 'completed';
      
      // Determine difficulty based on points
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
      if (task.points_reward >= 300) difficulty = 'Hard';
      else if (task.points_reward >= 150) difficulty = 'Medium';

      // Map task_type to quest type
      const typeMapping: Record<string, string> = {
        'youtube': 'Subscribe',
        'youtube_watch': 'Watch',
        'twitter_follow': 'Follow',
        'discord_join': 'Join',
        'visit_website': 'Visit',
        'telegram_join': 'Join',
      };

      return {
        id: task.id,
        title: task.title,
        description: task.description || 'Complete this quest to earn rewards',
        platform: task.platform || 'other',
        type: (typeMapping[task.task_type] || 'Other') as any,
        difficulty: difficulty as any,
        reward: task.points_reward,
        pointsReward: task.points_reward,
        xpReward: Math.floor(task.points_reward / 2),
        requirements: task.verification_data || {},
        verificationType: (task.verification_required ? 'Manual' : 'Automatic') as any,
        verificationMethod: task.verification_required ? 'manual' : 'automatic',
        questUrl: task.url || '#',
        isActive: task.is_active,
        isCompleted: isCompleted,
        isNew: !userTask,
        isDaily: task.task_type === 'daily_check_in',
        createdAt: task.created_at,
        timeLimit: task.video_duration_seconds || 0,
        youtubeVideoId: task.youtube_video_id,
        verificationCode: task.verification_code,
        minWatchTime: task.min_watch_time_seconds,
      };
    } catch (error) {
      console.error('❌ Failed to fetch quest:', error);
      return null;
    }
  },

  async createQuest(questData: any) {
    console.log('📝 Creating new quest in database...', questData);
    
    try {
      // Map quest data to database task structure
      const taskTypeMapping: Record<string, string> = {
        'Subscribe': 'youtube',
        'Watch': 'youtube_watch',
        'Follow': 'twitter_follow',
        'Join': 'telegram_join',
        'Visit': 'visit_website',
        'Other': 'other',
      };

      const taskData = {
        title: questData.title,
        description: questData.description,
        task_type: taskTypeMapping[questData.type] || 'other',
        platform: questData.platform?.toLowerCase() || 'other',
        url: questData.questUrl || '',
        points_reward: questData.reward || questData.pointsReward || 100,
        is_bonus: questData.isSponsored || false,
        max_completions: questData.isDaily ? 0 : 1, // 0 for unlimited (daily)
        verification_required: questData.verificationType === 'Manual',
        is_active: true,
        verification_data: {
          method: questData.verificationType?.toLowerCase() || 'manual',
          validation_code: questData.validationCode || null,
        },
        // YouTube specific fields if applicable
        youtube_video_id: questData.youtubeVideoId || null,
        min_watch_time_seconds: questData.minWatchTime || null,
        verification_code: questData.validationCode || null,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating quest:', error);
        throw error;
      }

      console.log('✅ Quest created successfully:', data);

      // Transform back to Quest format for return
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        platform: data.platform,
        type: questData.type,
        difficulty: questData.difficulty,
        reward: data.points_reward,
        pointsReward: data.points_reward,
        xpReward: Math.floor(data.points_reward / 2),
        requirements: data.verification_data || {},
        verificationType: questData.verificationType,
        verificationMethod: data.verification_required ? 'manual' : 'automatic',
        questUrl: data.url,
        isActive: data.is_active,
        isCompleted: false,
        isNew: true,
        isDaily: data.max_completions === 0,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('❌ Failed to create quest:', error);
      throw error;
    }
  },

  async submitQuest(questId: string, userId: string, submissionData: any) {
    // Mock submission - in real implementation would insert to quest_submissions table
    const submission = {
      id: Date.now().toString(),
      questId: questId,
      userId: userId,
      status: 'pending' as SubmissionStatus,
      submissionData: submissionData,
      submittedAt: new Date().toISOString()
    };
    console.log('Mock: Created submission:', submission);
    return submission;
  },

  async updateQuest(questId: string, updates: any) {
    console.log('✏️ Updating quest:', questId, updates);
    
    try {
      const taskUpdates: any = {};
      
      // Map common quest fields to database columns
      if (updates.title) taskUpdates.title = updates.title;
      if (updates.description) taskUpdates.description = updates.description;
      if (updates.reward || updates.pointsReward) {
        taskUpdates.points_reward = updates.reward || updates.pointsReward;
      }
      if (updates.questUrl) taskUpdates.url = updates.questUrl;
      if (updates.isActive !== undefined) taskUpdates.is_active = updates.isActive;
      if (updates.platform) taskUpdates.platform = updates.platform.toLowerCase();
      
      // Update verification settings
      if (updates.verificationType) {
        taskUpdates.verification_required = updates.verificationType === 'Manual';
      }
      if (updates.validationCode) {
        taskUpdates.verification_code = updates.validationCode;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(taskUpdates)
        .eq('id', questId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating quest:', error);
        throw error;
      }

      console.log('✅ Quest updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Failed to update quest:', error);
      throw error;
    }
  },

  async deleteQuest(questId: string) {
    console.log('🗑️ Deleting quest:', questId);
    
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('tasks')
        .update({ is_active: false })
        .eq('id', questId);

      if (error) {
        console.error('❌ Error deleting quest:', error);
        throw error;
      }

      console.log('✅ Quest deleted (deactivated) successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete quest:', error);
      throw error;
    }
  }
}

// Reward operations using real database
export const rewardService = {
  async getRewards() {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_cost', { ascending: true })
    
    if (error) throw error
    
    return data.map(reward => ({
      id: reward.id,
      title: reward.title,
      description: reward.description,
      pointsCost: reward.points_cost,
      type: reward.reward_type,
      imageUrl: reward.image_url,
      isActive: reward.is_active,
      quantityAvailable: reward.quantity_available,
      quantityClaimed: reward.quantity_claimed,
      createdAt: reward.created_at
    }));
  },

  async getRewardById(id: string) {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      pointsCost: data.points_cost,
      type: data.reward_type,
      imageUrl: data.image_url,
      isActive: data.is_active,
      quantityAvailable: data.quantity_available,
      quantityClaimed: data.quantity_claimed,
      createdAt: data.created_at
    };
  },

  async createReward(rewardData: any) {
    const dbData = {
      title: rewardData.title,
      description: rewardData.description,
      reward_type: rewardData.type,
      points_cost: rewardData.pointsCost,
      quantity_available: rewardData.quantityAvailable || 100,
      quantity_claimed: 0,
      is_active: true,
      image_url: rewardData.imageUrl,
      code_prefix: rewardData.codePrefix
    };

    const { data, error } = await supabase
      .from('rewards')
      .insert(dbData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async claimReward(rewardId: string, userId: string) {
    // Check if user has enough points
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single()
    
    if (userError) throw userError
    
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('points_cost, quantity_available, quantity_claimed')
      .eq('id', rewardId)
      .single()
    
    if (rewardError) throw rewardError
    
    if (user.points < reward.points_cost) {
      throw new Error('Insufficient points')
    }
    
    if (reward.quantity_available <= reward.quantity_claimed) {
      throw new Error('Reward no longer available')
    }
    
    // Create user_reward record
    const { data: userReward, error: claimError } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        points_spent: reward.points_cost,
        claimed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (claimError) throw claimError
    
    // Update user points
    await supabase
      .from('users')
      .update({ points: user.points - reward.points_cost })
      .eq('id', userId)
    
    // Update reward claimed count
    await supabase
      .from('rewards')
      .update({ quantity_claimed: reward.quantity_claimed + 1 })
      .eq('id', rewardId)
    
    return userReward
  },

  async updateReward(id: string, updates: any) {
    const dbUpdates: any = {};
    
    if (updates.status) {
      dbUpdates.is_active = updates.status === 'active';
    }
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.pointsCost) dbUpdates.points_cost = updates.pointsCost;
    if (updates.quantityAvailable) dbUpdates.quantity_available = updates.quantityAvailable;

    const { data, error } = await supabase
      .from('rewards')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      pointsCost: data.points_cost,
      type: data.reward_type,
      imageUrl: data.image_url,
      isActive: data.is_active,
      quantityAvailable: data.quantity_available,
      quantityClaimed: data.quantity_claimed,
      createdAt: data.created_at
    };
  }
}

// Auth service
export const authService = {
  async signUp(email: string, password: string, userData?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}

// Submission service for quest submissions
export const submissionService = {
  async getAllSubmissions() {
    // Mock implementation since table doesn't exist yet
    return [];
  },

  async getSubmissionsByUserId(userId: string) {
    // Mock implementation
    return [];
  },

  async getUserSubmissions(userId: string) {
    // Mock implementation
    return [];
  },

  async getSubmissionsByQuest(questId: string) {
    // Mock implementation
    return [];
  },

  async submitQuest(submission: any) {
    // Mock implementation
    console.log('Mock: Submitted quest:', submission);
    return { id: Date.now().toString(), ...submission, status: 'pending' };
  },

  async updateSubmissionStatus(submissionId: string, status: SubmissionStatus, adminNotes?: string) {
    // Mock implementation
    console.log(`Mock: Updated submission ${submissionId} to ${status}`);
    return { id: submissionId, status, adminNotes };
  },

  async approveSubmission(submissionId: string, adminNotes?: string) {
    return this.updateSubmissionStatus(submissionId, 'approved', adminNotes);
  },

  async rejectSubmission(submissionId: string, adminNotes?: string) {
    return this.updateSubmissionStatus(submissionId, 'rejected', adminNotes);
  }
}

// User Activity Service - Fetch real quest activity from user_tasks table
export const activityService = {
  async getUserActivity(userId: string, limit: number = 20) {
    console.log('📊 Fetching user activity from user_tasks for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          id,
          status,
          points_earned,
          completed_at,
          created_at,
          tasks:task_id (
            id,
            title,
            description
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching user activity:', error);
        throw error;
      }

      console.log('✅ Fetched', data?.length || 0, 'activity records');

      // Transform to activity log format
      return data?.map(activity => {
        const task = Array.isArray(activity.tasks) ? activity.tasks[0] : activity.tasks;
        const activityType: 'SUCCESS' | 'FAILED' | 'CLAIM' = 
          activity.status === 'completed' ? 'SUCCESS' : 
          activity.status === 'pending' ? 'CLAIM' : 'FAILED';
        
        return {
          id: activity.id,
          type: activityType,
          description: task?.title || 'Quest Activity',
          date: activity.completed_at || activity.created_at,
          points: activity.points_earned,
          status: activity.status,
        };
      }) || [];
    } catch (error) {
      console.error('❌ Failed to fetch user activity:', error);
      return [];
    }
  },

  async getUserStats(userId: string) {
    console.log('📈 Fetching user statistics for:', userId);
    
    try {
      // Get completed quests count
      const { count: completedCount, error: completedError } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (completedError) throw completedError;

      // Get pending/claimed quests count
      const { count: claimedCount, error: claimedError } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['pending', 'claimed']);

      if (claimedError) throw claimedError;

      // Get user join date and calculate days active
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('created_at')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const joinDate = new Date(userData.created_at);
      const today = new Date();
      const daysActive = Math.max(1, Math.ceil((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)));

      return {
        completedQuests: completedCount || 0,
        claimedRewards: claimedCount || 0,
        daysActive: daysActive,
      };
    } catch (error) {
      console.error('❌ Failed to fetch user stats:', error);
      return {
        completedQuests: 0,
        claimedRewards: 0,
        daysActive: 1,
      };
    }
  }
}