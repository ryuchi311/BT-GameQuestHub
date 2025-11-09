import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Reward } from '../types';
import { rewardService } from '../services/supabaseService';
import { useToast } from './Toast';

interface CreateRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardCreated?: (reward: Reward) => void;
}

const CreateRewardModal: React.FC<CreateRewardModalProps> = ({
  isOpen,
  onClose,
  onRewardCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    cost: 500,
    points_required: 500,
    imageUrl: '',
    status: 'active' as 'active' | 'inactive',
    type: 'digital' as 'physical' | 'digital' | 'voucher' | 'cryptocurrency',
    quantity: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Sync cost and points_required
    if (field === 'cost') {
      setFormData(prev => ({
        ...prev,
        points_required: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rewardData: Omit<Reward, 'id'> = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      const newReward = await rewardService.createReward(rewardData);
      
      addToast({
        type: 'success',
        title: 'Reward Created',
        message: `"${formData.title}" has been successfully created!`,
        duration: 5000
      });

      if (onRewardCreated && newReward) {
        onRewardCreated(newReward);
      }
      
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        name: '',
        description: '',
        cost: 500,
        points_required: 500,
        imageUrl: '',
        status: 'active',
        type: 'digital',
        quantity: 10,
      });
    } catch (error: any) {
      console.error('Error creating reward:', error);
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create reward. Please try again.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rewardTypes = [
    { value: 'digital', label: 'Digital' },
    { value: 'physical', label: 'Physical' },
    { value: 'voucher', label: 'Voucher' },
    { value: 'cryptocurrency', label: 'Cryptocurrency' },
  ];

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
          <h2 className="text-2xl font-bold text-white">Create New Reward</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Steam Gift Card"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Steam $10 Gift Card"
                required
              />
            </div>
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
              placeholder="Describe the reward and how it will be delivered..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reward Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {rewardTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Cost/Points */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Points Required
              </label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity Available
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mr-2 text-green-500 focus:ring-green-500"
                />
                <span className="text-gray-300">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mr-2 text-red-500 focus:ring-red-500"
                />
                <span className="text-gray-300">Inactive</span>
              </label>
            </div>
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
                  <span>Create Reward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRewardModal;