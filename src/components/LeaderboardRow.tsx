
import React from 'react';
import { LeaderboardUser } from '../types';
import { GoldMedalIcon, SilverMedalIcon, BronzeMedalIcon } from './icons/MedalIcons';
import { CoinIcon } from './icons/PlatformIcons';

interface LeaderboardRowProps {
    user: LeaderboardUser;
    isCurrentUser: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, isCurrentUser }) => {
    const { rank, name, avatarUrl, level, questsCompleted, points } = user;

    const rankDisplay = () => {
        if (rank === 1) return <GoldMedalIcon className="w-6 h-6" />;
        if (rank === 2) return <SilverMedalIcon className="w-6 h-6" />;
        if (rank === 3) return <BronzeMedalIcon className="w-6 h-6" />;
        return <span className="font-bold text-gray-400">{rank}</span>;
    };

    return (
        <div
            className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-all duration-200 ${
                isCurrentUser
                    ? 'bg-yellow-400/10 border-2 border-yellow-400/50'
                    : 'bg-gray-800 border-2 border-transparent'
            }`}
        >
            <div className="col-span-1 flex justify-center items-center">
                {rankDisplay()}
            </div>
            <div className="col-span-5 flex items-center gap-3">
                <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full" />
                <span className="font-semibold text-white truncate">{name}</span>
            </div>
            <div className="col-span-2 text-center font-medium text-gray-300">
                {level}
            </div>
            <div className="col-span-2 text-center font-medium text-gray-300">
                {questsCompleted}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-1 font-bold text-yellow-400">
                <span>{points.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default LeaderboardRow;
