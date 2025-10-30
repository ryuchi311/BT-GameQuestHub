import React, { useState, useEffect } from 'react';
import { Quest } from '../types';
import { mockApi } from '../services/mockApi';
import QuestCard from '../components/QuestCard';
import { Award, Loader2 } from 'lucide-react';

const UserDashboard: React.FC = () => {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [points, setPoints] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [questsData, pointsData] = await Promise.all([
                mockApi.getQuests(),
                mockApi.getUserPoints()
            ]);
            setQuests(questsData);
            setPoints(pointsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
        );
    }

    const availableQuests = quests.filter(q => !q.isCompleted);
    const completedQuests = quests.filter(q => q.isCompleted);

    return (
        <div className="p-4 max-w-lg mx-auto">
            <header className="text-center mb-6">
                 <div className="inline-block bg-dark-card p-4 rounded-full border-2 border-brand-primary shadow-lg">
                    <Award className="h-10 w-10 text-accent-gold" />
                </div>
                <h1 className="text-3xl font-bold mt-2 text-white">Brgy Tamago GameHub</h1>
                <p className="text-gray-400">Complete quests, earn points!</p>
                <div className="mt-4 inline-flex items-center bg-dark-card px-6 py-2 rounded-full text-lg font-semibold text-accent-gold border border-dark-border">
                    <span className="mr-2">Your Points:</span>
                    <span>{points.toLocaleString()}</span>
                </div>
            </header>
            
            <section>
                <h2 className="text-2xl font-bold text-brand-primary mb-4">Available Quests</h2>
                {availableQuests.length > 0 ? (
                    <div className="space-y-4">
                        {availableQuests.map(quest => (
                            // FIX: Added missing props `viewedQuests`, `onSelect`, and `completedDailies` to QuestCard component.
                            <QuestCard key={quest.id} quest={quest} viewedQuests={new Set()} onSelect={() => {}} completedDailies={new Set()} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-4">No new quests available. Check back soon!</p>
                )}
            </section>
            
            <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-500 mb-4">Completed Quests</h2>
                 {completedQuests.length > 0 ? (
                    <div className="space-y-4 opacity-60">
                        {completedQuests.map(quest => (
                            // FIX: Added missing props `viewedQuests`, `onSelect`, and `completedDailies` to QuestCard component.
                            <QuestCard key={quest.id} quest={quest} viewedQuests={new Set()} onSelect={() => {}} completedDailies={new Set()} />
                        ))}
                    </div>
                ) : (
                     <p className="text-gray-500 text-center py-4">You haven't completed any quests yet.</p>
                )}
            </section>
        </div>
    );
};

export default UserDashboard;