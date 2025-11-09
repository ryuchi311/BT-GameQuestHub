import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { rewardService } from '../../services/supabaseService';
import { Reward } from '../../types';
import { Loader2 } from 'lucide-react';

const Rewards: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      console.log('🎁 Loading rewards...');
      setLoading(true);
      setError(null);
      
      try {
        const activeRewards = await rewardService.getRewards();
        console.log('🎁 Rewards loaded:', activeRewards);
        setRewards(activeRewards || []);
      } catch (err) {
        console.error('❌ Error fetching rewards:', err);
        setError('Failed to load rewards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const handleClaimReward = async (reward: Reward) => {
    const rewardCost = reward.cost || reward.points_required || 0;
    if (!user || user.points < rewardCost || claimingReward) return;

    setClaimingReward(reward.id);
    
    try {
      // Claim the reward through Supabase
      await rewardService.claimReward(user.id, reward.id);
      
      // Update user points
      updateUser({ points: user.points - rewardCost });
      
      alert(`Successfully claimed ${reward.name || reward.title}!`);
    } catch (err) {
      console.error('Error claiming reward:', err);
      alert('Failed to claim reward. Please try again.');
    } finally {
      setClaimingReward(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'digital': return '💻';
      case 'physical': return '📦';
      case 'experience': return '🎪';
      default: return '🎁';
    }
  };

  const canAfford = (cost: number) => user && user.points >= (cost || 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Claim Rewards</h2>
        <p className="text-gray-400">
          You have <span className="font-bold text-yellow-400">{user?.points.toLocaleString() || 0}</span> points to spend.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewards.map(reward => {
          console.log('🎁 Processing reward:', reward);
          const rewardCost = reward.cost || reward.points_required || 0;
          const affordable = canAfford(rewardCost);
          const claiming = claimingReward === reward.id;

          return (
            <div
              key={reward.id}
              className={`bg-gray-800 rounded-lg border overflow-hidden transition-all ${
                affordable ? 'border-gray-600 hover:border-yellow-400' : 'border-gray-700 opacity-60'
              }`}
            >
              <div className="aspect-video bg-gray-700 relative overflow-hidden">
                <img
                  src={reward.imageUrl}
                  alt={reward.title || reward.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs text-white">{getCategoryIcon(reward.type)}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white line-clamp-1">
                    {reward.title || reward.name}
                  </h3>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    affordable ? 'bg-yellow-400 text-gray-900' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {rewardCost.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {reward.description}
                </p>
                
                <button
                  onClick={() => handleClaimReward(reward)}
                  disabled={!affordable || claiming}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                    affordable && !claiming
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {claiming ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Claiming...
                    </span>
                  ) : affordable ? (
                    'Claim Reward'
                  ) : (
                    `Need ${(rewardCost - (user?.points || 0)).toLocaleString()} more points`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Complete quests to earn more points and unlock exclusive rewards! 🎁
        </p>
      </div>
    </div>
  );
};

export default Rewards;