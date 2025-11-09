
import React, { useState, useEffect } from 'react';
import { Reward } from '../types';
import { CoinIcon } from './icons/PlatformIcons';

interface ClaimRewardModalProps {
    reward: Reward;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

const ClaimRewardModal: React.FC<ClaimRewardModalProps> = ({ reward, onClose, onConfirm }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [claimState, setClaimState] = useState<'confirming' | 'loading' | 'success'>('confirming');

    useEffect(() => {
        // Animate in on mount
        setIsModalOpen(true);
    }, []);

    const handleClose = () => {
        if (claimState === 'loading') return;
        setIsModalOpen(false);
        setTimeout(onClose, 300); // Wait for animation to finish before unmounting
    };

    const handleConfirmClick = async () => {
        setClaimState('loading');
        await onConfirm();
        setClaimState('success');
    };

    const renderContent = () => {
        if (claimState === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center text-center h-64">
                    <svg className="animate-spin h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg font-semibold text-white">Processing Claim...</p>
                </div>
            );
        }
        
        if (claimState === 'success') {
            return (
                 <div className="flex flex-col items-center justify-center text-center animate-fade-in h-64">
                    <svg className="w-20 h-20 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-white">Success!</h3>
                    <p className="text-gray-300 mt-2 mb-6">Reward claimed. Points have been deducted.</p>
                    <button onClick={handleClose} className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Done
                    </button>
                </div>
            );
        }

        return (
            <>
                <div className="text-center">
                    <img src={reward.imageUrl} alt={reward.name} className="w-full h-32 object-cover rounded-t-lg" />
                    <h3 className="text-2xl font-bold text-white mt-4">{reward.name}</h3>
                    <p className="text-gray-400 mt-1">{reward.description}</p>
                    <div className="my-6 bg-gray-900/50 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-gray-300 font-medium">This will cost:</span>
                        <div className="flex items-center gap-1.5 font-bold text-yellow-400 text-xl">
                            <CoinIcon className="w-6 h-6" />
                            <span>{reward.cost.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="text-lg text-white">Are you sure you want to claim this reward?</p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button onClick={handleClose} className="bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleConfirmClick} className="bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
                        Confirm Claim
                    </button>
                </div>
            </>
        );
    };

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reward-modal-title"
        >
            <div 
                className={`bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm transition-all duration-300 ease-out ${isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6" id="reward-modal-title">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ClaimRewardModal;
