import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuests } from '../../context/QuestContext';
import { QuestFilter, QuestPlatform } from '../../types';
import QuestList from '../../components/features/QuestList';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    quests, 
    loading, 
    error, 
    viewedQuests, 
    completedDailies, 
    selectQuest 
  } = useQuests();
  
  const [activeFilter, setActiveFilter] = useState<QuestFilter>('All');

  const socialPlatforms = [
    'youtube',
    'twitter',
    'telegram',
    'instagram',
    'discord',
    'tiktok',
    'custom',
    'other',
  ];

  const { newQuestFilters, newQuestCount, filteredQuests } = useMemo(() => {
    const filtersWithNewQuests = new Set<QuestFilter>();
    let count = 0;
    
    // Count new quests
    quests.forEach(quest => {
      if (quest.isNew && !quest.isCompleted && !viewedQuests.has(quest.id)) {
        count++;
        if (quest.isDaily) {
          filtersWithNewQuests.add('Daily');
        }
        if (quest.platform === 'partner') {
          filtersWithNewQuests.add('Sponsors');
        } else if (socialPlatforms.includes(quest.platform)) {
          filtersWithNewQuests.add('Socials');
        }
      }
    });

    // Filter and sort quests
    const getIsQuestComplete = (quest: any) => 
      quest.isCompleted || (quest.isDaily && completedDailies.has(quest.id));

    const sortedQuests = [...quests].sort((a, b) => {
      const aComplete = getIsQuestComplete(a);
      const bComplete = getIsQuestComplete(b);
      if (aComplete && !bComplete) return 1;
      if (!aComplete && bComplete) return -1;
      return 0;
    });

    let filtered = sortedQuests;
    switch (activeFilter) {
      case 'All':
        filtered = sortedQuests;
        break;
      case 'Daily':
        filtered = sortedQuests.filter(quest => quest.isDaily);
        break;
      case 'Sponsors':
        filtered = sortedQuests.filter(quest => quest.platform === 'partner');
        break;
      case 'Socials':
        filtered = sortedQuests.filter(quest => socialPlatforms.includes(quest.platform));
        break;
    }

    return { 
      newQuestFilters: filtersWithNewQuests, 
      newQuestCount: count,
      filteredQuests: filtered
    };
  }, [quests, activeFilter, viewedQuests, completedDailies]);

  const handleSelectQuest = (quest: any) => {
    selectQuest(quest);
    navigate(`/quests/${quest.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <QuestList 
        quests={filteredQuests}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        newQuestCount={newQuestCount}
        newQuestFilters={newQuestFilters}
        viewedQuests={viewedQuests}
        onSelectQuest={handleSelectQuest}
        completedDailies={completedDailies}
      />
    </div>
  );
};

export default Dashboard;