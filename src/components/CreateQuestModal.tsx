import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Quest, QuestPlatform, QuestType, QuestDifficulty, VerificationType } from '../types';
import { questService } from '../services/supabaseService';
import { useToast } from './Toast';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestCreated?: (quest: Quest) => void;
}

const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  isOpen,
  onClose,
  onQuestCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: QuestPlatform.YouTube,
    type: QuestType.Subscribe,
    reward: 100,
    difficulty: QuestDifficulty.Easy,
    verificationType: VerificationType.Manual,
    questUrl: '',
    validationCode: '',
    isDaily: false,
    isSponsored: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const questData: Omit<Quest, 'id'> = {
        ...formData,
        isCompleted: false,
        isNew: true,
      };

      const newQuest = await questService.createQuest(questData);
      
      addToast({
        type: 'success',
        title: 'Quest Created',
        message: `"${formData.title}" has been successfully created!`,
        duration: 5000
      });

      if (onQuestCreated && newQuest) {
        onQuestCreated(newQuest);
      }
      
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        platform: QuestPlatform.YouTube,
        type: QuestType.Subscribe,
        reward: 100,
        difficulty: QuestDifficulty.Easy,
        verificationType: VerificationType.Manual,
        questUrl: '',
        validationCode: '',
        isDaily: false,
        isSponsored: false,
      });
    } catch (error: any) {
      console.error('Error creating quest:', error);
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create quest. Please try again.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900/95 border border-gray-600 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Quest</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quest Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="Enter quest title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="Describe what users need to do..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform
              </label>
              <select
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value as QuestPlatform)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {Object.values(QuestPlatform).map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quest Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as QuestType)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {Object.values(QuestType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value as QuestDifficulty)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {Object.values(QuestDifficulty).map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Reward Points */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reward Points
              </label>
              <input
                type="number"
                value={formData.reward}
                onChange={(e) => handleInputChange('reward', parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Quest URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quest URL
            </label>
            <input
              type="url"
              value={formData.questUrl}
              onChange={(e) => handleInputChange('questUrl', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="https://youtube.com/..."
              required
            />
          </div>

          {/* Verification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Verification Type
            </label>
            <div className="flex space-x-4">
              {Object.values(VerificationType).map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="verificationType"
                    value={type}
                    checked={formData.verificationType === type}
                    onChange={(e) => handleInputChange('verificationType', e.target.value as VerificationType)}
                    className="mr-2 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Validation Code (if manual verification) */}
          {formData.verificationType === VerificationType.Manual && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Validation Code (Optional)
              </label>
              <input
                type="text"
                value={formData.validationCode}
                onChange={(e) => handleInputChange('validationCode', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="CODE123"
              />
            </div>
          )}

          {/* Checkboxes */}
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDaily}
                onChange={(e) => handleInputChange('isDaily', e.target.checked)}
                className="mr-2 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-300">Daily Quest</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isSponsored}
                onChange={(e) => handleInputChange('isSponsored', e.target.checked)}
                className="mr-2 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-300">Sponsored Quest</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Create Quest</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestModal;