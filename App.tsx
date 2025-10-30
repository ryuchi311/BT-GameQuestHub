
import React, { useState, useMemo, useEffect } from 'react';
import { useMockData } from './hooks/useMockData';
import Header from './components/Header';
import QuestList from './components/QuestList';
import BottomNav from './components/BottomNav';
import Leaderboard from './components/Leaderboard';
import Rewards from './components/Rewards';
import Profile from './components/Profile';
import QuestDetail from './components/QuestDetail';
import ClaimRewardModal from './components/ClaimRewardModal';
import { QuestFilter, User, Reward, ActivityLog, Quest, QuestPlatform, ActivityType } from './types';

const App: React.FC = () => {
    const initialData = useMockData();
    const [user, setUser] = useState<User>(initialData.user);
    const [quests, setQuests] = useState<Quest[]>(initialData.quests);
    const [leaderboardData, setLeaderboardData] = useState(initialData.leaderboardData);
    const [rewards, setRewards] = useState(initialData.rewards);
    const [activities, setActivities] = useState<ActivityLog[]>(initialData.activities);
    const [viewedQuests, setViewedQuests] = useState<Set<string>>(new Set());
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
    const [rewardToClaim, setRewardToClaim] = useState<Reward | null>(null);
    const [completedDailies, setCompletedDailies] = useState<Set<string>>(new Set());

    const [activeTab, setActiveTab] = useState<string>('Quests');
    const [activeQuestFilter, setActiveQuestFilter] = useState<QuestFilter>('All');

    const handleSelectRewardToClaim = (reward: Reward) => {
        if (user.points >= reward.cost) {
            setRewardToClaim(reward);
        } else {
            alert("You don't have enough points to claim this reward.");
        }
    };

    const handleCloseClaimModal = () => {
        setRewardToClaim(null);
    };

    const handleConfirmClaim = async () => {
        if (!rewardToClaim) return;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setUser(prevUser => ({ ...prevUser, points: prevUser.points - rewardToClaim.cost }));
        
        const newActivity: ActivityLog = {
            id: `act-${Date.now()}`,
            type: ActivityType.CLAIM,
            description: `Claimed "${rewardToClaim.name}"`,
            date: new Date().toISOString().split('T')[0],
            points: -rewardToClaim.cost,
        };
        setActivities(prev => [newActivity, ...prev]);
    };

    const handleProfileSave = (updatedUser: User) => {
        setUser(updatedUser);
        alert('Profile saved successfully!');
    };

    const handleQuestView = (questId: string) => {
        if (!viewedQuests.has(questId)) {
            setViewedQuests(prev => {
                const newSet = new Set(prev);
                newSet.add(questId);
                return newSet;
            });
        }
    };

    const handleSelectQuest = (quest: Quest) => {
        const isDailyCompleted = quest.isDaily && completedDailies.has(quest.id);
        if (quest.isCompleted || isDailyCompleted) return;
        
        handleQuestView(quest.id);
        setSelectedQuest(quest);
    };

    const handleGoBack = () => {
        setSelectedQuest(null);
    };

    const handleQuestComplete = (completedQuest: Quest) => {
        // Update user points and quest count
        setUser(prevUser => ({
            ...prevUser,
            points: prevUser.points + completedQuest.reward,
            questsCompleted: prevUser.questsCompleted + 1,
        }));

        if (completedQuest.isDaily) {
            setCompletedDailies(prev => new Set(prev).add(completedQuest.id));
        } else {
            // Mark non-daily quest as permanently completed
            setQuests(prevQuests => 
                prevQuests.map(q => 
                    q.id === completedQuest.id ? { ...q, isCompleted: true, submissionStatus: 'approved' } : q
                )
            );
        }

        // Add to activity log
        const newActivity: ActivityLog = {
            id: `act-${Date.now()}`,
            type: ActivityType.SUCCESS,
            description: `Completed "${completedQuest.title}"`,
            date: new Date().toISOString().split('T')[0],
            points: completedQuest.reward,
        };
        setActivities(prev => [newActivity, ...prev]);
    };

    const handleManualSubmit = (submittedQuest: Quest) => {
        // Set quest to pending
        setQuests(prevQuests => 
            prevQuests.map(q => 
                q.id === submittedQuest.id ? { ...q, submissionStatus: 'pending' } : q
            )
        );
        setSelectedQuest(prev => prev ? { ...prev, submissionStatus: 'pending' } : null);

        // Simulate admin review
        setTimeout(() => {
            const isApproved = Math.random() > 0.3; // 70% chance of approval
            if (isApproved) {
                handleQuestComplete(submittedQuest);
            } else {
                // Mark as rejected
                setQuests(prevQuests => 
                    prevQuests.map(q => 
                        q.id === submittedQuest.id ? { ...q, submissionStatus: 'rejected' } : q
                    )
                );
                 setSelectedQuest(prev => prev ? { ...prev, submissionStatus: 'rejected' } : null);
                 const newActivity: ActivityLog = {
                    id: `act-${Date.now()}`,
                    type: ActivityType.FAILED,
                    description: `Submission for "${submittedQuest.title}" rejected`,
                    date: new Date().toISOString().split('T')[0],
                };
                setActivities(prev => [newActivity, ...prev]);
            }
        }, 3000);
    };

    const socialPlatforms = [
        QuestPlatform.YouTube,
        QuestPlatform.Twitter,
        QuestPlatform.Telegram,
        QuestPlatform.Instagram,
        QuestPlatform.Discord,
        QuestPlatform.TikTok,
        QuestPlatform.Custom,
        QuestPlatform.Other,
    ];

    const { newQuestFilters, newQuestCount } = useMemo(() => {
        const filtersWithNewQuests = new Set<QuestFilter>();
        let count = 0;
        quests.forEach(quest => {
            if (quest.isNew && !quest.isCompleted && !viewedQuests.has(quest.id)) {
                count++;
                if (quest.isDaily) {
                    filtersWithNewQuests.add('Daily');
                }
                if (quest.platform === QuestPlatform.Partner) {
                    filtersWithNewQuests.add('Sponsors');
                } else if (socialPlatforms.includes(quest.platform)) {
                    filtersWithNewQuests.add('Socials');
                }
            }
        });
        return { newQuestFilters: filtersWithNewQuests, newQuestCount: count };
    }, [quests, viewedQuests]);

    const sortedAndFilteredQuests = useMemo(() => {
        const getIsQuestComplete = (quest: Quest) => quest.isCompleted || (quest.isDaily && completedDailies.has(quest.id));

        const sortedQuests = [...quests].sort((a, b) => {
            const aComplete = getIsQuestComplete(a);
            const bComplete = getIsQuestComplete(b);
            if (aComplete && !bComplete) return 1;
            if (!aComplete && bComplete) return -1;
            return 0;
        });

        switch (activeQuestFilter) {
            case 'All':
                return sortedQuests;
            case 'Daily':
                return sortedQuests.filter(quest => quest.isDaily);
            case 'Sponsors':
                return sortedQuests.filter(quest => quest.platform === QuestPlatform.Partner);
            case 'Socials':
                return sortedQuests.filter(quest => socialPlatforms.includes(quest.platform));
            default:
                return sortedQuests;
        }
    }, [quests, activeQuestFilter, completedDailies]);

    const renderContent = () => {
        if (activeTab === 'Quests' && selectedQuest) {
            // Find the latest quest data from the main state to pass to detail view
            const currentQuestData = quests.find(q => q.id === selectedQuest.id) || selectedQuest;
            return <QuestDetail quest={currentQuestData} onGoBack={handleGoBack} onComplete={handleQuestComplete} onManualSubmit={handleManualSubmit} />;
        }

        switch (activeTab) {
            case 'Quests':
                return (
                    <QuestList 
                        quests={sortedAndFilteredQuests} 
                        activeFilter={activeQuestFilter}
                        setActiveFilter={setActiveQuestFilter}
                        newQuestCount={newQuestCount}
                        newQuestFilters={newQuestFilters}
                        viewedQuests={viewedQuests}
                        onSelectQuest={handleSelectQuest}
                        completedDailies={completedDailies}
                    />
                );
            case 'Leaderboard':
                return <Leaderboard leaderboardData={leaderboardData} currentUser={user} />;
            case 'Rewards':
                return <Rewards rewards={rewards} userPoints={user.points} onClaim={handleSelectRewardToClaim} />;
            case 'Profile':
                return <Profile user={user} activities={activities} onSave={handleProfileSave} />;
            default:
                return (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-gray-500">{activeTab} page coming soon!</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-50 flex flex-col">
            <div className="w-full max-w-md mx-auto flex-grow">
                <Header user={user} />
                <main className="px-4 pb-24">
                    {renderContent()}
                </main>
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            {rewardToClaim && (
                <ClaimRewardModal
                    reward={rewardToClaim}
                    onClose={handleCloseClaimModal}
                    onConfirm={handleConfirmClaim}
                />
            )}
        </div>
    );
};

export default App;
