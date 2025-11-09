import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useQuests } from '../../context/QuestContext';
import CreateQuestModal from '../../components/CreateQuestModal';
import { Quest } from '../../types';
import { questService } from '../../services/supabaseService';

const QuestManagement: React.FC = () => {
  const { quests, loading, fetchQuests } = useQuests();
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'draft'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingQuestId, setDeletingQuestId] = useState<string | null>(null);

  const handleQuestCreated = (newQuest: Quest) => {
    // Refresh the quest list
    fetchQuests();
  };

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest? This action cannot be undone.')) {
      return;
    }

    setDeletingQuestId(questId);
    try {
      await questService.deleteQuest(questId);
      console.log('✅ Quest deleted successfully');
      // Refresh the quest list
      fetchQuests();
    } catch (error) {
      console.error('❌ Failed to delete quest:', error);
      alert('Failed to delete quest. Please try again.');
    } finally {
      setDeletingQuestId(null);
    }
  };

  const filteredQuests = quests.filter(quest => {
    switch (selectedTab) {
      case 'active':
        return quest.isActive && !quest.isCompleted;
      case 'draft':
        return !quest.isActive;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Quest Management</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Quest
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
        {[
          { key: 'all', label: 'All Quests', count: quests.length },
          { key: 'active', label: 'Active', count: quests.filter(q => q.isActive && !q.isCompleted).length },
          { key: 'draft', label: 'Inactive', count: quests.filter(q => !q.isActive).length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors text-sm font-medium ${
              selectedTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Quest Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Quest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredQuests.map(quest => (
                <tr key={quest.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{quest.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">
                        {quest.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{quest.platform}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-yellow-400">
                      {quest.reward} pts
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      !quest.isActive
                        ? 'bg-gray-600/20 text-gray-400'
                        : quest.isCompleted
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {!quest.isActive 
                        ? 'Inactive' 
                        : quest.isCompleted 
                        ? 'Completed' 
                        : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                        title="Edit Quest"
                        onClick={() => alert('Edit functionality coming soon!')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Quest"
                        onClick={() => handleDeleteQuest(quest.id)}
                        disabled={deletingQuestId === quest.id}
                      >
                        {deletingQuestId === quest.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No quests found for this filter.</p>
          </div>
        )}
      </div>

      {/* Create Quest Modal */}
      <CreateQuestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onQuestCreated={handleQuestCreated}
      />
    </div>
  );
};

export default QuestManagement;