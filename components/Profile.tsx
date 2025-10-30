
import React, { useState, useEffect } from 'react';
import { User, ActivityLog, ActivityType } from '../types';
import ActivityLogRow from './ActivityLogRow';
import { TelegramIcon, TwitterIcon, TikTokIcon, DiscordIcon } from './icons/PlatformIcons';

interface ProfileProps {
    user: User;
    activities: ActivityLog[];
    onSave: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, activities, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(user);
    const [activeTab, setActiveTab] = useState<ActivityType | 'ALL'>('ALL');

    useEffect(() => {
        if (!isEditing) {
            setFormData(user);
        }
    }, [user, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const filteredActivities = activeTab === 'ALL' 
        ? activities 
        : activities.filter(act => act.type === activeTab);

    const renderSocialField = (label: string, name: keyof User, placeholder: string, Icon: React.FC<{className?: string}>) => (
        <div className="flex items-center gap-4">
            <Icon className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <div className="flex-grow">
                <label htmlFor={name} className="block text-xs font-medium text-gray-400">{label}</label>
                {isEditing ? (
                    <input 
                        type="text" 
                        name={name} 
                        id={name} 
                        value={String(formData[name] || '')} 
                        onChange={handleInputChange} 
                        className="bg-gray-700 border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2" 
                        placeholder={placeholder} 
                    />
                ) : (
                    <p className="text-white text-sm font-semibold w-full p-2 min-h-[38px]">
                        {formData[name] || <span className="text-gray-500 font-normal">Not set</span>}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="mt-4 space-y-8">
            <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-4 border-yellow-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-md font-semibold text-yellow-400">Level {user.level}</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4">Social Accounts</h3>
                <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
                    <div className="space-y-5">
                        {renderSocialField("Telegram Username", "telegramUsername", "@username", TelegramIcon)}
                        {renderSocialField("Twitter/X Username", "twitterUsername", "@username", TwitterIcon)}
                        {renderSocialField("TikTok Username", "tiktokUsername", "@username", TikTokIcon)}
                        {renderSocialField("Discord Username", "discordUsername", "username#0000", DiscordIcon)}
                    </div>
                    
                    <div className="pt-4">
                        {isEditing ? (
                            <button onClick={handleSaveClick} className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                                Save Profile
                            </button>
                        ) : (
                            <button onClick={handleEditClick} className="w-full bg-yellow-400 text-gray-900 font-bold py-2.5 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-sm">
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Activity History</h2>
                <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
                    {(['ALL', ActivityType.SUCCESS, ActivityType.FAILED, ActivityType.CLAIM] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200 capitalize ${
                                activeTab === tab
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {tab.toLowerCase()}
                        </button>
                    ))}
                </div>
                <div className="space-y-3">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map(activity => <ActivityLogRow key={activity.id} activity={activity} />)
                    ) : (
                        <p className="text-center text-gray-500 py-8">No activities found for this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
