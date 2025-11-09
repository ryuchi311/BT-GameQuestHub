import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Reward } from '../../types';
import { rewardService } from '../../services/supabaseService';
import CreateRewardModal from '../../components/CreateRewardModal';
import { useToast } from '../../components/Toast';

const RewardManagement: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const data = await rewardService.getRewards();
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load rewards',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRewardCreated = (newReward: Reward) => {
    fetchRewards(); // Refresh the reward list
  };

  const handleToggleStatus = async (rewardId: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await rewardService.updateReward(rewardId, { status: newStatus });
      
      setRewards(prev => prev.map(reward => 
        reward.id === rewardId 
          ? { ...reward, status: newStatus }
          : reward
      ));
      
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Reward ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update reward status',
        duration: 5000
      });
    }
  };

  const filteredRewards = rewards.filter(reward => {
    switch (selectedTab) {
      case 'active':
        return reward.status === 'active';
      case 'inactive':
        return reward.status === 'inactive';
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
        <h1 className="text-2xl font-bold text-white">Reward Management</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Reward
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
        {[
          { key: 'all', label: 'All Rewards', count: rewards.length },
          { key: 'active', label: 'Active', count: rewards.filter(r => r.status === 'active').length },
          { key: 'inactive', label: 'Inactive', count: rewards.filter(r => r.status === 'inactive').length },
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

      {/* Rewards Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Reward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredRewards.map(reward => (
                <tr key={reward.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={reward.imageUrl} 
                        alt={reward.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{reward.title}</p>
                        <p className="text-gray-400 text-sm">{reward.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      reward.type === 'digital' ? 'bg-blue-100 text-blue-800' :
                      reward.type === 'physical' ? 'bg-green-100 text-green-800' :
                      reward.type === 'voucher' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reward.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {reward.points_required.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {reward.quantity || 'Unlimited'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(reward.id, reward.status)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reward.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors cursor-pointer`}
                    >
                      {reward.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-400"
                        title="View reward"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-yellow-400"
                        title="Edit reward"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-400"
                        title="Delete reward"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No rewards found for this filter.</p>
          </div>
        )}
      </div>

      {/* Create Reward Modal */}
      <CreateRewardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRewardCreated={handleRewardCreated}
      />
    </div>
  );
};

export default RewardManagement;