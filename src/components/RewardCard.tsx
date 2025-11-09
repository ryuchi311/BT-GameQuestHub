
import React from 'react';
import { Reward } from '../types';
import { CoinIcon } from './icons/PlatformIcons';

interface RewardCardProps {
    reward: Reward;
    userPoints: number;
    onClaim: (reward: Reward) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, userPoints, onClaim }) => {
    const canAfford = userPoints >= reward.cost;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
            <img src={reward.imageUrl} alt={reward.name} className="w-full h-28 object-cover" />
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-bold text-white text-base">{reward.name}</h3>
                <p className="text-xs text-gray-400 mt-1 mb-3 flex-grow">{reward.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Cost:</span>
                    <div className="flex items-center gap-1 font-bold text-yellow-400">
                        <CoinIcon className="w-4 h-4" />
                        <span>{reward.cost.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    onClick={() => onClaim(reward)}
                    disabled={!canAfford}
                    className={`w-full text-sm font-bold py-2 px-3 rounded-lg transition-colors duration-200 ${
                        canAfford 
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                    aria-label={canAfford ? `Claim ${reward.name}` : `Not enough points for ${reward.name}`}
                >
                    {canAfford ? 'Claim' : 'Not Enough Points'}
                </button>
            </div>
        </div>
    );
};

export default RewardCard;
