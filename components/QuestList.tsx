import React from 'react';
import { Quest, QuestFilter } from '../types';
import QuestCard from './QuestCard';
import { DailyIcon, AllFilterIcon, SocialsIcon } from './icons/FilterIcons';
import { PartnerIcon } from './icons/PlatformIcons';

interface QuestListProps {
    quests: Quest[];
    activeFilter: QuestFilter;
    setActiveFilter: (filter: QuestFilter) => void;
    newQuestCount: number;
    newQuestFilters: Set<QuestFilter>;
    viewedQuests: Set<string>;
    onSelectQuest: (quest: Quest) => void;
    completedDailies: Set<string>;
}

const filterOrder: QuestFilter[] = [
    'All',
    'Daily',
    'Socials',
    'Sponsors',
];

const filterIcons: Record<string, React.FC<{ className?: string }>> = {
    'All': AllFilterIcon,
    'Daily': DailyIcon,
    'Socials': SocialsIcon,
    'Sponsors': PartnerIcon,
};


const QuestList: React.FC<QuestListProps> = ({ 
    quests, 
    activeFilter, 
    setActiveFilter,
    newQuestCount,
    newQuestFilters,
    viewedQuests,
    onSelectQuest,
    completedDailies
}) => {

    const activeQuests = quests.filter(q => !(q.isCompleted || (q.isDaily && completedDailies.has(q.id))));
    const completedQuests = quests.filter(q => q.isCompleted || (q.isDaily && completedDailies.has(q.id)));

    return (
        <div className="mt-4">
            <h2 className="text-lg font-bold text-white mb-2">Available Quests</h2>
            
            <div className="mb-6 pt-2">
                <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
                    {filterOrder.map(filter => {
                        const isActive = activeFilter === filter;
                        const Icon = filterIcons[filter];
                        const displayName = filter;
                        const hasNewDot = filter !== 'All' && newQuestFilters.has(filter);
                        const isAllFilter = filter === 'All';

                        return (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`relative flex-shrink-0 ${isAllFilter ? 'p-3' : 'px-4 py-2 gap-2'} rounded-full transition-colors duration-200 flex items-center justify-center text-sm font-semibold ${
                                    isActive 
                                    ? 'bg-yellow-400 text-gray-900' 
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                aria-pressed={isActive}
                                aria-label={`Filter by ${displayName}`}
                                title={displayName}
                            >
                                {Icon && <Icon className={isAllFilter ? "w-6 h-6" : "w-5 h-5"} />}
                                
                                {!isAllFilter && <span>{displayName}</span>}
                                
                                {isAllFilter && newQuestCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-gray-900"
                                        style={{ top: '0px' }}
                                    >
                                        {newQuestCount}
                                    </span>
                                )}

                                {hasNewDot && (
                                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeQuests.length > 0 ? (
                <div className="space-y-4">
                    {activeQuests.map(quest => (
                        <QuestCard 
                            key={quest.id} 
                            quest={quest}
                            viewedQuests={viewedQuests}
                            onSelect={onSelectQuest}
                            completedDailies={completedDailies}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No active quests available for this category.</p>
                </div>
            )}

            {completedQuests.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-4">
                        <hr className="flex-grow border-t border-gray-700" />
                        <h3 className="text-base font-semibold text-gray-400">Completed Quests</h3>
                        <hr className="flex-grow border-t border-gray-700" />
                    </div>
                    <div className="space-y-4">
                        {completedQuests.map(quest => (
                            <QuestCard 
                                key={quest.id} 
                                quest={quest}
                                viewedQuests={viewedQuests}
                                onSelect={onSelectQuest}
                                completedDailies={completedDailies}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestList;