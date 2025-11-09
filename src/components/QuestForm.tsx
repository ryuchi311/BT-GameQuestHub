
import React, { useState } from 'react';
import { Quest, QuestPlatform, QuestDifficulty, QuestType, VerificationType } from '../types';

interface QuestFormProps {
    quest: Quest | null;
    onSave: (quest: Omit<Quest, 'id' | 'isCompleted'> | Quest) => void;
    onClose: () => void;
}

const QuestForm: React.FC<QuestFormProps> = ({ quest, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: quest?.title || '',
        description: quest?.description || '',
        platform: quest?.platform || QuestPlatform.YouTube,
        difficulty: quest?.difficulty || QuestDifficulty.Easy,
        reward: quest?.reward || 100,
        type: quest?.type || QuestType.Visit,
        verificationType: quest?.verificationType || VerificationType.Manual,
        questUrl: quest?.questUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'reward' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (quest) {
            onSave({ ...quest, ...formData });
        } else {
            onSave(formData as Omit<Quest, 'id' | 'isCompleted'>);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl w-full max-w-lg border border-dark-border">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">{quest ? 'Edit Quest' : 'Create New Quest'}</h2>
                        <div className="space-y-4">
                            <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
                            <div>
                               <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                               <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                            </div>
                            <InputField label="Quest URL" name="questUrl" value={formData.questUrl} onChange={handleChange} required />

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SelectField label="Platform" name="platform" value={formData.platform} onChange={handleChange} options={Object.values(QuestPlatform)} />
                                <SelectField label="Type" name="type" value={formData.type} onChange={handleChange} options={Object.values(QuestType)} />
                                <SelectField label="Difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} options={Object.values(QuestDifficulty)} />
                                <SelectField label="Verification" name="verificationType" value={formData.verificationType} onChange={handleChange} options={Object.values(VerificationType)} />
                                <InputField label="Points" name="reward" type="number" value={String(formData.reward)} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                    <div className="bg-dark-bg px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Cancel</button>
                        <button type="submit" className="bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Save Quest</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper sub-components to keep the form clean
const InputField: React.FC<{label: string, name: string, value: string, onChange: any, type?: string, required?: boolean}> = ({ label, name, value, onChange, type = "text", required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input type={type} name={name} id={name} value={value} onChange={onChange} required={required} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
    </div>
);

const SelectField: React.FC<{label: string, name: string, value: string, onChange: any, options: string[]}> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select name={name} id={name} value={value} onChange={onChange} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default QuestForm;
