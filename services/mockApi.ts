
import { Quest, Submission, QuestPlatform, QuestDifficulty, SubmissionStatus, QuestType, VerificationType } from '../types';

let quests: Quest[] = [
    { id: '1', title: 'Subscribe to our YouTube Channel', description: 'Click the link, subscribe, and upload a screenshot.', platform: QuestPlatform.YouTube, type: QuestType.Subscribe, verificationType: VerificationType.Manual, questUrl: '', difficulty: QuestDifficulty.Easy, reward: 100, isCompleted: false },
    { id: '2', title: 'Follow us on Twitter', description: 'Follow @BrgyTamago on Twitter and submit your username.', platform: QuestPlatform.Twitter, type: QuestType.Follow, verificationType: VerificationType.Manual, questUrl: '', difficulty: QuestDifficulty.Easy, reward: 50 },
    { id: '3', title: 'Join our Telegram Group', description: 'Join our main Telegram group for announcements.', platform: QuestPlatform.Telegram, type: QuestType.Join, verificationType: VerificationType.Automatic, questUrl: '', difficulty: QuestDifficulty.Medium, reward: 150, isCompleted: true },
    { id: '4', title: 'Retweet our Pinned Post', description: 'Retweet our pinned post and submit the link to your retweet.', platform: QuestPlatform.Twitter, type: QuestType.Retweet, verificationType: VerificationType.Manual, questUrl: '', difficulty: QuestDifficulty.Hard, reward: 250 },
    { id: '5', title: 'Watch our Latest Video', description: 'Watch our latest YouTube video for at least 2 minutes.', platform: QuestPlatform.YouTube, type: QuestType.Watch, verificationType: VerificationType.Automatic, questUrl: '', difficulty: QuestDifficulty.Medium, reward: 120 },
    { id: '6', title: 'Quote Tweet with #TamagoHub', description: 'Quote tweet our announcement with the hashtag #TamagoHub.', platform: QuestPlatform.Twitter, type: QuestType.QuoteTweet, verificationType: VerificationType.Manual, questUrl: '', difficulty: QuestDifficulty.Hard, reward: 300 },
];

let submissions: Submission[] = [
    { id: 's1', questId: '4', userId: 'user123', proof: 'https://twitter.com/user123/status/123456', status: 'pending', timestamp: new Date() },
    { id: 's2', questId: '5', userId: 'user456', proof: 'https://picsum.photos/seed/proof2/400/300', status: 'pending', timestamp: new Date(Date.now() - 3600 * 1000) },
];

let userPoints = 150; // Points from the completed Telegram quest

const findQuest = (id: string) => quests.find(q => q.id === id);
const findQuestForSubmission = (sub: Submission) => {
    sub.quest = findQuest(sub.questId);
    sub.user = { id: sub.userId, name: `User ${sub.userId.substring(0,6)}` };
    return sub;
}

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
    getUserPoints: async (): Promise<number> => {
        await delay(200);
        return userPoints;
    },

    getQuests: async (): Promise<Quest[]> => {
        await delay(500);
        return quests;
    },

    getQuestById: async (id: string): Promise<Quest | undefined> => {
        await delay(300);
        return findQuest(id);
    },

    submitProof: async (questId: string, proof: string): Promise<Submission> => {
        await delay(1000);
        const newSubmission: Submission = {
            id: `s${Date.now()}`,
            questId,
            userId: 'currentUser',
            proof,
            status: 'pending',
            timestamp: new Date(),
        };
        submissions.push(newSubmission);
        const quest = findQuest(questId);
        if (quest) quest.submissionStatus = 'pending';
        return newSubmission;
    },

    getSubmissions: async (): Promise<Submission[]> => {
        await delay(700);
        return submissions.map(findQuestForSubmission).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    },

    updateSubmissionStatus: async (submissionId: string, status: SubmissionStatus): Promise<Submission | undefined> => {
        await delay(500);
        const submission = submissions.find(s => s.id === submissionId);
        if (submission) {
            submission.status = status;
            if (status === 'approved') {
                const quest = findQuest(submission.questId);
                if (quest) {
                    userPoints += quest.reward;
                    quest.isCompleted = true;
                }
            }
        }
        return submission;
    },
    
    createQuest: async (questData: Omit<Quest, 'id' | 'isCompleted'>): Promise<Quest> => {
        await delay(500);
        const newQuest: Quest = {
            id: `q${Date.now()}`,
            ...questData,
            isCompleted: false,
        };
        quests.unshift(newQuest);
        return newQuest;
    },

    updateQuest: async (questData: Quest): Promise<Quest | undefined> => {
        await delay(500);
        const index = quests.findIndex(q => q.id === questData.id);
        if (index !== -1) {
            quests[index] = questData;
            return quests[index];
        }
        return undefined;
    },
    
    deleteQuest: async (questId: string): Promise<boolean> => {
        await delay(500);
        const initialLength = quests.length;
        quests = quests.filter(q => q.id !== questId);
        return quests.length < initialLength;
    }
};
