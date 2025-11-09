
import React from 'react';
import { Quest, QuestDifficulty, QuestPlatform, VerificationType } from '../types';
import { YouTubeIcon, TwitterIcon, TelegramIcon, DiscordIcon, TikTokIcon, CustomUrlIcon, CoinIcon, PartnerIcon } from './icons/PlatformIcons';
import { ManualVerificationIcon, AutomaticVerificationIcon } from './icons/VerificationIcons';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

interface QuestCardProps {
    quest: Quest;
    viewedQuests: Set<string>;
    onSelect: (quest: Quest) => void;
    completedDailies: Set<string>;
}

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
    [QuestPlatform.YouTube]: YouTubeIcon,
    [QuestPlatform.Twitter]: TwitterIcon,
    [QuestPlatform.Telegram]: TelegramIcon,
    [QuestPlatform.Discord]: DiscordIcon,
    [QuestPlatform.TikTok]: TikTokIcon,
    [QuestPlatform.Partner]: PartnerIcon,
    [QuestPlatform.Other]: CustomUrlIcon,
    [QuestPlatform.Instagram]: () => null, // Placeholder
    [QuestPlatform.Custom]: CustomUrlIcon,
};

const difficultyColors: Record<QuestDifficulty, string> = {
    [QuestDifficulty.Easy]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [QuestDifficulty.Medium]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [QuestDifficulty.Hard]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [QuestDifficulty.Epic]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, viewedQuests, onSelect, completedDailies }) => {
    const PlatformIcon = platformIcons[quest.platform];
    const isFresh = quest.isNew && !quest.isCompleted && !viewedQuests.has(quest.id);
    const isQuestComplete = quest.isCompleted || (quest.isDaily && completedDailies.has(quest.id));
    const telegram = useTelegramWebApp();

    const handleClick = () => {
        // Haptic feedback for quest selection
        telegram.hapticFeedback.impact('light');
        onSelect(quest);
    };

    return (
        <div 
            className={`relative bg-gray-800 rounded-lg p-4 border transition-all duration-300 haptic-active touch-target no-select cursor-pointer ${isQuestComplete ? 'opacity-60' : ''} ${isFresh ? 'shadow-lg shadow-yellow-400/20 border-yellow-400/50' : 'border-gray-700'}`}
            onClick={handleClick}
        >
            {isFresh && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                    NEW
                </div>
            )}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {PlatformIcon && <PlatformIcon className="w-8 h-8 text-gray-400" />}
                    <div>
                        <h3 className="font-bold text-white">{quest.title}</h3>
                        <p className="text-sm text-gray-400">{quest.type} on {quest.platform}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {quest.isSponsored && (
                        <div className="p-1.5 rounded-full bg-indigo-500/20 text-indigo-400" title="Sponsored">
                            <PartnerIcon className="w-4 h-4" />
                        </div>
                    )}
                    {quest.isDaily && (
                        <div className="text-xs font-semibold px-2 py-1 rounded-full border bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            Daily
                        </div>
                    )}
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full border ${difficultyColors[quest.difficulty]}`}>
                        {quest.difficulty}
                    </div>
                </div>
            </div>
            
            <p className="text-gray-300 my-3 text-sm">{quest.description}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 font-bold text-yellow-400">
                        <CoinIcon className="w-5 h-5" />
                        <span>{quest.reward}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        {quest.verificationType === VerificationType.Manual ? (
                            <ManualVerificationIcon className="w-4 h-4" />
                        ) : (
                            <AutomaticVerificationIcon className="w-4 h-4" />
                        )}
                        <span>{quest.verificationType}</span>
                    </div>
                </div>
                {isQuestComplete ? (
                     <div className="flex items-center gap-2 text-green-400 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Completed
                    </div>
                ) : (
                    <button onClick={() => onSelect(quest)} className="bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-sm">
                        Start Quest
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuestCard;