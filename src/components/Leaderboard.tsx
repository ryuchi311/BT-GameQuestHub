
import React, { useState } from 'react';
import { LeaderboardUser, User } from '../types';
import LeaderboardRow from './LeaderboardRow';

interface LeaderboardProps {
    leaderboardData: LeaderboardUser[];
    currentUser: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboardData, currentUser }) => {
    const [activeLeaderboard, setActiveLeaderboard] = useState<'Overall' | 'Weekly' | 'Daily'>('Overall');

    const currentUserRank = leaderboardData.find(u => u.id === currentUser.id);

    return (
        <div className="mt-4">
            <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>

            <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
                {(['Overall', 'Weekly', 'Daily'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveLeaderboard(tab)}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                            activeLeaderboard === tab
                                ? 'bg-yellow-400 text-gray-900'
                                : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-2 py-1 text-xs font-bold text-gray-400 uppercase">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5">Player</div>
                    <div className="col-span-2 text-center">Level</div>
                    <div className="col-span-2 text-center">Quests</div>
                    <div className="col-span-2 text-right">Points</div>
                </div>

                {/* Top 10 List */}
                {leaderboardData.slice(0, 10).map(user => (
                    <LeaderboardRow
                        key={user.id}
                        user={user}
                        isCurrentUser={user.id === currentUser.id}
                    />
                ))}
            </div>

            {/* Current User's Rank */}
            {currentUserRank && (
                <div className="mt-6 sticky bottom-20 bg-gray-900 py-4 rounded-t-lg border-t-2 border-gray-700 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)]">
                     <p className="text-sm font-bold text-gray-400 mb-2 text-center">Your Rank</p>
                    <div className="px-2">
                        <LeaderboardRow
                            user={currentUserRank}
                            isCurrentUser={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
