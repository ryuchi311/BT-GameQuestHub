import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quest, Submission } from '../types';
import { mockApi } from '../services/mockApi';
import { ArrowLeft, Upload, Loader2, CheckCircle } from 'lucide-react';

const QuestDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quest, setQuest] = useState<Quest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofText, setProofText] = useState('');

    useEffect(() => {
        if (id) {
            mockApi.getQuestById(id).then(data => {
                setQuest(data || null);
                setLoading(false);
            });
        }
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quest || (!proofFile && !proofText)) return;
        
        setSubmitting(true);
        // In a real app, we would upload the file and get a URL. Here we simulate it.
        const proof = proofFile ? `screenshot_${proofFile.name}` : proofText;
        const result = await mockApi.submitProof(quest.id, proof);
        setSubmission(result);
        setSubmitting(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>;
    }

    if (!quest) {
        return <div className="text-center p-8">Quest not found.</div>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            <header className="flex items-center mb-6 relative">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-dark-card">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-center flex-grow">{quest.title}</h1>
            </header>

            <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
                <p className="text-gray-300 mb-4">{quest.description}</p>
                <div className="flex justify-between items-center text-sm mb-6">
                    <span className="font-semibold text-gray-400">Platform: <span className="text-white">{quest.platform}</span></span>
                    <span className="font-semibold text-gray-400">Difficulty: <span className="text-white">{quest.difficulty}</span></span>
                    {/* FIX: Property 'points' does not exist on type 'Quest'. Changed to 'reward'. */}
                    <span className="font-bold text-lg text-accent-gold">+{quest.reward} PTS</span>
                </div>

                {submission ? (
                    <div className="text-center p-6 bg-dark-bg rounded-lg">
                        <CheckCircle className="h-16 w-16 text-accent-green mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Submission Received!</h2>
                        <p className="text-gray-400 mt-2">Your submission is now pending verification. We'll notify you once it's reviewed.</p>
                         <button onClick={() => navigate('/')} className="mt-6 w-full bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                            Back to Quests
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Proof (Screenshot)</label>
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-dark-bg rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary border-2 border-dashed border-dark-border hover:border-brand-primary p-4 flex flex-col items-center justify-center text-center">
                                    <Upload className="h-10 w-10 text-gray-500" />
                                    <span className="mt-2 text-sm text-gray-400">{proofFile ? proofFile.name : 'Click to upload a screenshot'}</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                             <div>
                                <label htmlFor="proof-text" className="block text-sm font-medium text-gray-300 mb-2">Or Proof (Username/Link)</label>
                                <input
                                    type="text"
                                    id="proof-text"
                                    value={proofText}
                                    onChange={(e) => setProofText(e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    placeholder="e.g., your_username or https://..."
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={submitting || (!proofFile && !proofText)} className="mt-6 w-full bg-brand-primary hover:bg-brand-primary/80 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                            {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Submit for Verification'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default QuestDetailPage;