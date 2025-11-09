import React from 'react';
import { Quest, QuestFilter } from '../../types';

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

const QuestList: React.FC<QuestListProps> = ({
  quests,
  activeFilter,
  setActiveFilter,
  newQuestCount,
  newQuestFilters,
  viewedQuests,
  onSelectQuest,
  completedDailies,
}) => {
  const filters: QuestFilter[] = ['All', 'Daily', 'Socials', 'Sponsors'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Available Quests
        {newQuestCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {newQuestCount} new
          </span>
        )}
      </h2>
      
      {/* Filter Tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1 mb-6 overflow-x-auto">
        {filters.map(filter => {
          const hasNewQuests = newQuestFilters.has(filter);
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {filter}
              {hasNewQuests && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quest Grid */}
      {quests.length > 0 ? (
        <div className="space-y-4">
          {quests.map(quest => {
            const isCompleted = quest.isCompleted || (quest.isDaily && completedDailies.has(quest.id));
            const isNew = quest.isNew && !viewedQuests.has(quest.id);
            
            return (
              <div
                key={quest.id}
                onClick={() => !isCompleted && onSelectQuest(quest)}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isCompleted
                    ? 'bg-gray-800/50 border-gray-700 opacity-60'
                    : 'bg-gray-800 border-gray-600 hover:border-yellow-400 hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
                  <div className="flex items-center gap-2">
                    {isNew && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-2 py-1 rounded">
                      +{quest.reward || quest.pointsReward || 0}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{quest.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 capitalize">{quest.platform}</span>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${
                    quest.difficulty?.toLowerCase() === 'easy' ? 'bg-green-600/20 text-green-400' :
                    quest.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                    quest.difficulty?.toLowerCase() === 'hard' ? 'bg-red-600/20 text-red-400' :
                    'bg-purple-600/20 text-purple-400'
                  }`}>
                    {quest.difficulty}
                  </span>
                </div>
                {isCompleted && (
                  <div className="mt-2 text-green-400 text-sm font-semibold">
                    ✓ Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No quests available for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default QuestList;