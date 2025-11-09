
import React, { useState, useEffect } from 'react';
import { Quest, QuestDifficulty, QuestPlatform, QuestType, VerificationType } from '../types';
import { YouTubeIcon, TwitterIcon, TelegramIcon, DiscordIcon, TikTokIcon, CustomUrlIcon, CoinIcon, PartnerIcon } from './icons/PlatformIcons';
import { ManualVerificationIcon, AutomaticVerificationIcon } from './icons/VerificationIcons';

interface QuestDetailProps {
    quest: Quest;
    onGoBack: () => void;
    onComplete: (quest: Quest) => void;
    onManualSubmit: (quest: Quest) => void;
}

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
    [QuestPlatform.YouTube]: YouTubeIcon,
    [QuestPlatform.Twitter]: TwitterIcon,
    [QuestPlatform.Telegram]: TelegramIcon,
    [QuestPlatform.Discord]: DiscordIcon,
    [QuestPlatform.TikTok]: TikTokIcon,
    [QuestPlatform.Partner]: PartnerIcon,
    [QuestPlatform.Other]: CustomUrlIcon,
    [QuestPlatform.Instagram]: () => null, // Placeholder
    [QuestPlatform.Custom]: CustomUrlIcon,
};

const difficultyColors: Record<QuestDifficulty, string> = {
    [QuestDifficulty.Easy]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [QuestDifficulty.Medium]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [QuestDifficulty.Hard]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [QuestDifficulty.Epic]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const QuestDetail: React.FC<QuestDetailProps> = ({ quest, onGoBack, onComplete, onManualSubmit }) => {
    const PlatformIcon = platformIcons[quest.platform];
    
    const [viewedQuestLink, setViewedQuestLink] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [formState, setFormState] = useState<Record<string, string>>({});
    const [validationError, setValidationError] = useState('');
    
    // Countdown state
    const [claimCountdown, setClaimCountdown] = useState(60);
    const [isCountdownActive, setIsCountdownActive] = useState(false);

    useEffect(() => {
        if (isCountdownActive && claimCountdown > 0) {
            const timer = setInterval(() => {
                setClaimCountdown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isCountdownActive, claimCountdown]);

    const handleGoToQuestClick = () => {
        setViewedQuestLink(true);
        if (
            (quest.platform === QuestPlatform.YouTube && quest.type === QuestType.Watch) ||
            (quest.platform === QuestPlatform.Other && quest.type === QuestType.Visit)
        ) {
            setIsCountdownActive(true);
        }
    };

    const handleAutoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationError('');

        setTimeout(() => {
            setIsLoading(false);
            let isSuccess = false;
            if (quest.type === QuestType.Watch) {
                 if (formState.watchCode?.trim().toUpperCase() === quest.validationCode?.toUpperCase()) {
                    isSuccess = true;
                } else {
                    setValidationError('Invalid code. Please try again.');
                }
            } else {
                isSuccess = true;
            }

            if (isSuccess) {
                onComplete(quest);
                setSubmissionSuccess(true);
            }
        }, 1500);
    };

    const handleManualFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onManualSubmit(quest);
    };

    if (submissionSuccess) {
        return (
            <div className="mt-4 text-center bg-gray-800 p-8 rounded-lg animate-fade-in">
                <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
                <p className="text-gray-300 mb-6">Quest completed! You've earned {quest.reward} points.</p>
                <button onClick={onGoBack} className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                    Back to Quests
                </button>
            </div>
        );
    }

    const renderManualSubmissionForm = (fields: {name: string, label: string, placeholder: string, type?: string}[], instructions: string) => (
        <form onSubmit={handleManualFormSubmit}>
            <h3 className="font-bold text-white mb-3">Submit Proof</h3>
            <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400">{instructions}</p>
                {quest.submissionStatus === 'rejected' && (
                    <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md">Your previous submission was rejected. Please review the requirements and submit again.</p>
                )}
                {fields.map(field => (
                     <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-400 mb-1">{field.label}</label>
                        <input type={field.type || 'text'} value={formState[field.name] || ''} onChange={(e) => setFormState(prev => ({...prev, [field.name]: e.target.value}))} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5" placeholder={field.placeholder} required />
                    </div>
                ))}
                <button type="submit" className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-sm">
                    Submit for Verification
                </button>
            </div>
        </form>
    );

    const renderPendingVerification = () => (
        <div className="bg-gray-900/50 p-6 rounded-lg text-center animate-fade-in">
            <div className="flex justify-center items-center mb-4">
                <svg className="animate-spin h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Pending Verification</h3>
            <p className="text-gray-400 mt-2">Your submission is under review by our admin team. You will be notified once it's approved or rejected.</p>
        </div>
    );

    const renderSubmissionUI = () => {
        // FIX: Changed string literal 'manual' to enum VerificationType.Manual for type-safe comparison.
        if (quest.verificationType === VerificationType.Manual) {
            if (quest.submissionStatus === 'pending') {
                return renderPendingVerification();
            }
            
            const commonFields = [{ name: 'screenshotLink', label: 'Facebook Screenshot Link', placeholder: 'https://facebook.com/...', type: 'url' }];
            if (quest.platform === QuestPlatform.YouTube) {
                return renderManualSubmissionForm([{ name: 'channel', label: 'Your YouTube Channel/Username', placeholder: 'e.g., @MyChannel' }, ...commonFields], "Provide your YouTube channel/username and a link to a public Facebook post with the subscription screenshot.");
            }
            if (quest.platform === QuestPlatform.Twitter) {
                return renderManualSubmissionForm([{ name: 'twitterUsername', label: 'Your Twitter Profile/Username', placeholder: '@your_handle' }, ...commonFields], "Provide your Twitter username and a link to a public Facebook post with the task screenshot.");
            }
            if (quest.platform === QuestPlatform.Discord) {
                return renderManualSubmissionForm([{ name: 'discordUsername', label: 'Your Discord Username', placeholder: 'username#0000' }, ...commonFields], "Provide your Discord username and a link to a public Facebook post with the screenshot of you in the server.");
            }
            if (quest.platform === QuestPlatform.Partner && quest.type === QuestType.Visit) {
                return renderManualSubmissionForm(commonFields, "Provide a link to a public Facebook post with a screenshot of the partner's site.");
            }
        }

        // Automatic verification flows
        if (quest.type === QuestType.Referral) {
            return (
                <div>
                    <h3 className="font-bold text-white mb-3">Share Your Referral Link</h3>
                    <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-300">Share this link with your friends. You'll earn rewards automatically when they sign up!</p>
                        <div className="flex items-center gap-2">
                            <input type="text" value={quest.questUrl} readOnly className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5" />
                            <button onClick={() => { navigator.clipboard.writeText(quest.questUrl); alert('Referral link copied to clipboard!'); }} className="bg-yellow-400 text-gray-900 font-bold p-2.5 rounded-lg hover:bg-yellow-500 transition-colors" title="Copy link">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Verification is automatic. No submission is needed.</p>
                    </div>
                </div>
            );
        }
        if (quest.type === QuestType.Watch) {
            return (
                <form onSubmit={handleAutoSubmit}>
                    <h3 className="font-bold text-white mb-3">Validate Watch Quest</h3>
                    <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
                         <p className="text-xs text-gray-400">Please watch the video for at least 1 minute. Enter the unique code that appears at the end of the video to claim your reward.</p>
                        <div>
                            <label htmlFor="watchCode" className="block text-sm font-medium text-gray-400 mb-1">Unique Code</label>
                            <input type="text" value={formState.watchCode || ''} onChange={(e) => setFormState(p => ({...p, watchCode: e.target.value}))} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5" placeholder="Enter code from video" required />
                        </div>
                        {validationError && <p className="text-sm text-red-400">{validationError}</p>}
                        <button type="submit" disabled={isLoading || claimCountdown > 0} className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-sm disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Validating...' : (claimCountdown > 0 ? `Validate in ${claimCountdown}s` : 'Validate Code')}
                        </button>
                    </div>
                </form>
            );
        }
        // FIX: Changed string literal 'auto' to enum VerificationType.Automatic for type-safe comparison.
        if (quest.platform === QuestPlatform.Twitter && quest.verificationType === VerificationType.Automatic) {
            return (
                <form onSubmit={handleAutoSubmit}>
                    <h3 className="font-bold text-white mb-3">Verify Twitter Interaction</h3>
                    <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-300">After completing the task, click the button below. We'll use the Twitter API to verify your action.</p>
                        <p className="font-semibold text-white">Task: {quest.type}</p>
                        <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm disabled:bg-gray-600">
                            {isLoading ? 'Verifying...' : 'Verify Interaction'}
                        </button>
                    </div>
                </form>
            );
        }
        if (quest.platform === QuestPlatform.Telegram) {
            return (
                <form onSubmit={handleAutoSubmit}>
                    <h3 className="font-bold text-white mb-3">Verify Telegram Task</h3>
                    <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg text-center">
                        {/* FIX: Changed string literal 'Join' to enum QuestType.Join for type-safe comparison. */}
                        <p className="text-sm text-gray-300">After joining the {quest.type === QuestType.Join ? 'group' : 'channel'}, return here and click the button below to verify your membership.</p>
                        {/* FIX: Changed string literal 'Join' to enum QuestType.Join for type-safe comparison. */}
                        {quest.type === QuestType.Join && <p className="text-xs text-gray-400">Our bot will check if your Telegram username from your profile matches a member in the group.</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-sky-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-sky-600 transition-colors duration-200 text-sm disabled:bg-gray-600">
                            {isLoading ? 'Verifying...' : 'Verify Me'}
                        </button>
                    </div>
                </form>
            );
        }
        if (quest.type === QuestType.Visit) {
            return (
                <form onSubmit={handleAutoSubmit}>
                    <h3 className="font-bold text-white mb-3">Claim Your Reward</h3>
                    <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
                         <p className="text-xs text-gray-400">Please explore the website for at least 1 minute to be eligible for the reward.</p>
                        <button type="submit" disabled={isLoading || claimCountdown > 0} className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-sm disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Claiming...' : (claimCountdown > 0 ? `Claim in ${claimCountdown}s` : 'Claim Reward')}
                        </button>
                    </div>
                </form>
            );
        }
        return null;
    };

    return (
        <div className="mt-4 animate-fade-in">
            <button onClick={onGoBack} className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Back to Quests
            </button>

            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {PlatformIcon && <PlatformIcon className="w-10 h-10 text-gray-300" />}
                        <div>
                            <h2 className="text-xl font-bold text-white">{quest.title}</h2>
                            <p className="text-sm text-gray-400">{quest.type} on {quest.platform}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {quest.isSponsored && (
                            <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400" title="Sponsored">
                                <PartnerIcon className="w-5 h-5" />
                            </div>
                        )}
                        <div className={`text-sm font-semibold px-3 py-1 rounded-full border ${difficultyColors[quest.difficulty]}`}>
                            {quest.difficulty}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 my-4 text-center">
                    <div className="flex-1">
                        <span className="text-xs text-gray-400 block">Reward</span>
                        <div className="flex items-center justify-center gap-1 font-bold text-yellow-400 text-lg">
                            <CoinIcon className="w-5 h-5" />
                            <span>{quest.reward}</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <span className="text-xs text-gray-400 block">Verification</span>
                        <div className="flex items-center justify-center gap-1.5 font-medium text-gray-200 text-lg">
                            {quest.verificationType === VerificationType.Manual ? (<ManualVerificationIcon className="w-5 h-5" />) : (<AutomaticVerificationIcon className="w-5 h-5" />)}
                            <span>{quest.verificationType}</span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-300 my-4 text-base bg-gray-900/50 p-3 rounded-md">{quest.description}</p>

                {!viewedQuestLink && quest.type !== QuestType.Referral && (
                    <a href={quest.questUrl} target="_blank" rel="noopener noreferrer" onClick={handleGoToQuestClick} className="block w-full text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-base mb-6">
                        Go to Quest
                    </a>
                )}

                {(viewedQuestLink || quest.type === QuestType.Referral) && renderSubmissionUI()}
            </div>
        </div>
    );
};

export default QuestDetail;