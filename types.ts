
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
    platform: QuestPlatform;
    type: QuestType;
    reward: number;
    difficulty: QuestDifficulty;
    verificationType: VerificationType;
    questUrl: string;
    validationCode?: string;
    isCompleted?: boolean;
    isDaily?: boolean;
    isNew?: boolean;
    isSponsored?: boolean;
    submissionStatus?: SubmissionStatus;
}

export type QuestFilter = 'All' | 'Daily' | 'Socials' | 'Sponsors';

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    level: number;
    xp: number;
    maxXp: number;
    points: number;
    questsCompleted: number;
    telegramUsername?: string;
    twitterUsername?: string;
    tiktokUsername?: string;
    discordUsername?: string;
}

export interface LeaderboardUser extends User {
    rank: number;
}

export interface Reward {
    id: string;
    name: string;
    description: string;
    cost: number;
    imageUrl: string;
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
