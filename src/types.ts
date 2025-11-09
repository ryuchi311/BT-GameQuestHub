
export enum QuestPlatform {
    YouTube = 'YouTube',
    Twitter = 'Twitter/X',
    Telegram = 'Telegram',
    Instagram = 'Instagram',
    Discord = 'Discord',
    TikTok = 'TikTok',
    Custom = 'Custom URL',
    Partner = 'Partner',
    Other = 'Other',
}

export enum QuestDifficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
    Epic = 'Epic',
}

export enum QuestType {
    Subscribe = 'Subscribe',
    Like = 'Like',
    Comment = 'Comment',
    Watch = 'Watch',
    Follow = 'Follow',
    Retweet = 'Retweet',
    QuoteTweet = 'Quote Tweet',
    Join = 'Join Channel/Group',
    Share = 'Share',
    Visit = 'Visit URL',
    Referral = 'Referral',
}

export enum VerificationType {
    Manual = 'Manual',
    Automatic = 'Automatic',
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | null;

export interface Quest {
    id: string;
    title: string;
    description: string;
    platform: string;
    type: string;
    reward?: number; // For backwards compatibility
    pointsReward?: number;
    xpReward?: number;
    difficulty: string;
    verificationType?: VerificationType;
    verificationMethod?: string;
    questUrl?: string;
    requirements?: any;
    validationCode?: string;
    isCompleted?: boolean;
    isDaily?: boolean;
    isNew?: boolean;
    isSponsored?: boolean;
    isActive?: boolean;
    submissionStatus?: SubmissionStatus;
    createdAt?: string;
    timeLimit?: number;
}

export type QuestFilter = 'All' | 'Daily' | 'Socials' | 'Sponsors';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatarUrl?: string;
    level: number;
    xp: number;
    maxXp: number;
    points: number;
    questsCompleted: number;
    telegramUsername?: string;
    telegramId?: number;
    twitterUsername?: string;
    tiktokUsername?: string;
    discordUsername?: string;
    instagramUsername?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LeaderboardUser extends User {
    rank: number;
}

export interface Reward {
    id: string;
    title: string;
    name?: string; // For backwards compatibility
    description: string;
    cost?: number; // For backwards compatibility
    pointsCost?: number;
    points_required?: number; // For backwards compatibility
    imageUrl?: string;
    status?: 'active' | 'inactive';
    isActive?: boolean;
    type: string;
    quantity?: number;
    quantityAvailable?: number;
    quantityClaimed?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface QuestSubmission {
    id: string;
    quest_id: string;
    user_id: string;
    proof_url?: string;
    proof_text?: string;
    status: SubmissionStatus;
    submitted_at: string;
    verified_at?: string;
    verified_by?: string;
    quest?: Quest;
    user?: { id: string; name: string; telegram_username?: string };
}

export interface RewardClaim {
    id: string;
    user_id: string;
    reward_id: string;
    claimed_at: string;
    status: 'pending' | 'processed' | 'delivered';
    reward?: Reward;
}

export enum ActivityType {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CLAIM = 'CLAIM',
}

export interface ActivityLog {
    id: string;
    type: ActivityType;
    description: string;
    date: string;
    points?: number;
}

export interface Submission {
    id: string;
    questId: string;
    userId: string;
    proof: string;
    status: SubmissionStatus;
    timestamp: Date;
    quest?: Quest;
    user?: { id: string; name: string };
}
