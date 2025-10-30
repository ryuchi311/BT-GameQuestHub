
import React from 'react';
import { QuestIcon } from './icons/QuestIcon';
import { LeaderboardIcon } from './icons/LeaderboardIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { RewardIcon } from './icons/RewardIcon';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const navItems = [
    { name: 'Quests', icon: QuestIcon },
    { name: 'Leaderboard', icon: LeaderboardIcon },
    { name: 'Rewards', icon: RewardIcon },
    { name: 'Profile', icon: ProfileIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 z-20">
            <div className="max-w-md mx-auto flex justify-around">
                {navItems.map((item) => {
                    const isActive = activeTab === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs transition-colors duration-200 ${
                                isActive ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                            }`}
                            aria-label={`Go to ${item.name}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <item.icon className="w-6 h-6 mb-1" />
                            <span className="font-medium">{item.name}</span>
                            {isActive && <div className="w-1 h-1 bg-yellow-400 rounded-full mt-1"></div>}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
