
import React from 'react';
import { User } from '../types';
import { CoinIcon } from './icons/PlatformIcons';

interface HeaderProps {
    user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const xpPercentage = (user.xp / user.maxXp) * 100;

    return (
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-20 p-4">
            <div className="flex items-center justify-between mb-4">
                {/* Left side: Branding */}
                <div className="flex items-center gap-3">
                    <img 
                        src="https://placehold.co/200x200/fbbf24/1f2937?text=Brgy+Tamago" 
                        alt="Brgy Tamago GameHub Logo" 
                        className="w-12 h-12 rounded-full object-cover border border-yellow-400" 
                    />
                    <div>
                        <h1 className="text-lg font-bold text-white">Brgy Tamago GameHub</h1>
                        <p className="text-sm text-gray-400">Complete quests, earn points!</p>
                    </div>
                </div>
                {/* Right side: Points */}
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full">
                    <CoinIcon className="w-6 h-6 text-yellow-400" />
                    <span className="font-bold text-white">{user.points.toLocaleString()}</span>
                </div>
            </div>
            {/* Bottom section: XP Bar */}
            <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>XP Progress (Level {user.level})</span>
                    <span>{user.xp.toLocaleString()} / {user.maxXp.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${xpPercentage}%` }}
                        aria-valuenow={xpPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                        aria-label="Experience points progress"
                    ></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
