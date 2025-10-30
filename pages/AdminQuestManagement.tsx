import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { Quest } from '../types';
import { ArrowLeft, Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuestForm from '../components/QuestForm';

const AdminQuestManagement: React.FC = () => {
    const navigate = useNavigate();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

    const fetchQuests = async () => {
        setLoading(true);
        const questsData = await mockApi.getQuests();
        setQuests(questsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const handleOpenModal = (quest: Quest | null = null) => {
        setEditingQuest(quest);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingQuest(null);
    };


    const handleSaveQuest = async (quest: Omit<Quest, 'id' | 'isCompleted'> | Quest) => {
        if ('id' in quest) {
            await mockApi.updateQuest(quest);
        } else {
            await mockApi.createQuest(quest);
        }
        fetchQuests();
        handleCloseModal();
    };

    const handleDeleteQuest = async (questId: string) => {
        if (window.confirm('Are you sure you want to delete this quest?')) {
            await mockApi.deleteQuest(questId);
            fetchQuests();
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <header className="flex items-center mb-6 relative">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-dark-card">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-center flex-grow">Quest Management</h1>
                <button onClick={() => handleOpenModal()} className="bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    New Quest
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center mt-8"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
            ) : (
                <div className="bg-dark-card border border-dark-border rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-dark-border">
                            <thead className="bg-dark-bg">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Platform</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {quests.map((quest) => (
                                    <tr key={quest.id} className="hover:bg-dark-bg/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{quest.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{quest.platform}</td>
                                        {/* FIX: Property 'points' does not exist on type 'Quest'. Changed to 'reward'. */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-accent-gold font-semibold">{quest.reward}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-4">
                                                <button onClick={() => handleOpenModal(quest)} className="text-blue-400 hover:text-blue-300"><Edit className="h-5 w-5" /></button>
                                                <button onClick={() => handleDeleteQuest(quest.id)} className="text-accent-red hover:text-red-400"><Trash2 className="h-5 w-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {isModalOpen && (
                <QuestForm
                    quest={editingQuest}
                    onSave={handleSaveQuest}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default AdminQuestManagement;