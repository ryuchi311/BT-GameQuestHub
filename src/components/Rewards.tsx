
import React from 'react';
import { Reward } from '../types';
import RewardCard from './RewardCard';

interface RewardsProps {
    rewards: Reward[];
    userPoints: number;
    onClaim: (reward: Reward) => void;
}

const Rewards: React.FC<RewardsProps> = ({ rewards, userPoints, onClaim }) => {
    return (
        <div className="mt-4">
            <h2 className="text-2xl font-bold text-white mb-4">Claim Rewards</h2>
            <p className="text-gray-400 mb-6">Use your points to claim exclusive rewards. You have <span className="font-bold text-yellow-400">{userPoints.toLocaleString()}</span> points.</p>

            <div className="grid grid-cols-2 gap-4">
                {rewards.map(reward => (
                    <RewardCard 
                        key={reward.id} 
                        reward={reward} 
                        userPoints={userPoints}
                        onClaim={onClaim}
                    />
                ))}
            </div>
        </div>
    );
};

export default Rewards;
