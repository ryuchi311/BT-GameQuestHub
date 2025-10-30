
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
                        src="https://scontent-lhr8-2.xx.fbcdn.net/v/t39.30808-6/405144911_221130711007912_1482409412144017287_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=G_he4vM2GucQ7kNvwFp7L5c&_nc_oc=Adm9OvV7nyV8fqH0VR3NzvaSt_aLA1LQeKwQpaF_7isxtpOOhT6QO5wmh2jqHkGWw0jhf9Oemtn34CSR4xKKJPPj&_nc_zt=23&_nc_ht=scontent-lhr8-2.xx&_nc_gid=5csNfjoc1LhnjX948og3JA&oh=00_AfcUowIvbY5smY7twlt76XspDKoCP-OGRMeoELAdwv8IIQ&oe=6908A1C3
                        " 
                        alt="Brgy Tamago GameHub Logo" 
                        className="w-12 h-12 rounded-full object-cover" 
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
