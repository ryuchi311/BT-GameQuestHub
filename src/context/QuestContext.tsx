import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Quest, QuestSubmission } from '../types';
import { useAuth } from './AuthContext';
import { questService, submissionService } from '../services/supabaseService';

interface QuestContextType {
  quests: Quest[];
  loading: boolean;
  error: string | null;
  viewedQuests: Set<string>;
  completedDailies: Set<string>;
  selectedQuest: Quest | null;
  fetchQuests: () => Promise<void>;
  selectQuest: (quest: Quest) => void;
  completeQuest: (quest: Quest) => Promise<void>;
  submitQuest: (questId: string, proofText?: string, proofUrl?: string) => Promise<void>;
  markQuestViewed: (questId: string) => void;
  clearSelectedQuest: () => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};

interface QuestProviderProps {
  children: ReactNode;
}

export const QuestProvider: React.FC<QuestProviderProps> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewedQuests, setViewedQuests] = useState<Set<string>>(new Set());
  const [completedDailies, setCompletedDailies] = useState<Set<string>>(new Set());
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  // Fetch quests from Supabase
  const fetchQuests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const questsData = await questService.getQuests(user?.id);
      setQuests(questsData || []);
    } catch (err) {
      console.error('Error fetching quests:', err);
      setError('Failed to load quests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load quests on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchQuests();
    }
  }, [user]);

  const selectQuest = (quest: Quest) => {
    const isDailyCompleted = quest.isDaily && completedDailies.has(quest.id);
    if (quest.isCompleted || isDailyCompleted) return;
    
    markQuestViewed(quest.id);
    setSelectedQuest(quest);
  };

  const markQuestViewed = (questId: string) => {
    setViewedQuests(prev => new Set(prev).add(questId));
  };

  const clearSelectedQuest = () => {
    setSelectedQuest(null);
  };

  const submitQuest = async (questId: string, proofText?: string, proofUrl?: string) => {
    if (!user) {
      throw new Error('User must be logged in to submit a quest');
    }

    try {
      setLoading(true);
      
      const submission: Partial<QuestSubmission> = {
        quest_id: questId,
        user_id: user.id,
        proof_text: proofText,
        proof_url: proofUrl,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      };

      await submissionService.submitQuest(submission);
      
      // Update quest status locally
      setQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, submissionStatus: 'pending' } : q
      ));

      if (selectedQuest?.id === questId) {
        setSelectedQuest(prev => prev ? { ...prev, submissionStatus: 'pending' } : null);
      }
      
      // Refresh quests to get updated status
      await fetchQuests();
    } catch (err) {
      console.error('Error submitting quest:', err);
      throw new Error('Failed to submit quest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completeQuest = async (quest: Quest) => {
    if (!user) return;

    try {
      // Update user points
      const newPoints = user.points + quest.reward;
      const newQuestsCompleted = user.questsCompleted + 1;
      
      await updateUser({
        points: newPoints,
        questsCompleted: newQuestsCompleted,
      });

      if (quest.isDaily) {
        setCompletedDailies(prev => new Set(prev).add(quest.id));
      } else {
        // Mark quest as completed locally
        setQuests(prev => prev.map(q => 
          q.id === quest.id ? { ...q, isCompleted: true } : q
        ));
      }
    } catch (err) {
      console.error('Error completing quest:', err);
      throw new Error('Failed to complete quest. Please try again.');
    }
  };

  const value: QuestContextType = {
    quests,
    loading,
    error,
    viewedQuests,
    completedDailies,
    selectedQuest,
    fetchQuests,
    selectQuest,
    completeQuest,
    submitQuest,
    markQuestViewed,
    clearSelectedQuest,
  };

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
};