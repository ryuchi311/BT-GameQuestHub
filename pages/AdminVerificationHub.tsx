import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { Submission, SubmissionStatus } from '../types';
import { ArrowLeft, Loader2, Check, X, ExternalLink } from 'lucide-react';

const AdminVerificationHub: React.FC = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        setLoading(true);
        const data = await mockApi.getSubmissions();
        // FIX: 'SubmissionStatus' only refers to a type. Used string literal 'pending' instead.
        setSubmissions(data.filter(s => s.status === 'pending'));
        setLoading(false);
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleUpdateStatus = async (submissionId: string, status: SubmissionStatus) => {
        setUpdatingId(submissionId);
        await mockApi.updateSubmissionStatus(submissionId, status);
        setSubmissions(prev => prev.filter(s => s.id !== submissionId));
        setUpdatingId(null);
    };

    const isImageUrl = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url) || url.includes('picsum.photos');
    const isLink = (text: string) => text.startsWith('http');

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <header className="flex items-center mb-6 relative">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-dark-card">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-center flex-grow">Verification Hub</h1>
            </header>

            {loading ? (
                <div className="flex justify-center mt-8"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
            ) : submissions.length > 0 ? (
                <div className="space-y-4">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="bg-dark-card p-4 rounded-lg border border-dark-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <p className="text-sm text-gray-400">User: <span className="font-semibold text-white">{sub.user?.name}</span></p>
                                    <p className="text-lg font-bold text-white mt-1">{sub.quest?.title}</p>
                                </div>
                                <div className="mt-2 sm:mt-0 text-right text-xs text-gray-500">
                                    {sub.timestamp.toLocaleString()}
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-dark-bg rounded-lg">
                                <h4 className="font-semibold text-gray-300 mb-2">Proof:</h4>
                                {isImageUrl(sub.proof) ? (
                                    <img src={sub.proof} alt="Submission proof" className="max-w-xs rounded-md" />
                                ) : isLink(sub.proof) ? (
                                    <a href={sub.proof} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline flex items-center">
                                        {sub.proof}
                                        <ExternalLink className="h-4 w-4 ml-2"/>
                                    </a>
                                ) : (
                                    <p className="text-white font-mono bg-gray-900 p-2 rounded">{sub.proof}</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                {updatingId === sub.id ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        {/* FIX: 'SubmissionStatus' only refers to a type. Used string literal 'rejected' instead. */}
                                        <button onClick={() => handleUpdateStatus(sub.id, 'rejected')} className="bg-accent-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
                                            <X className="h-5 w-5 mr-1" /> Reject
                                        </button>
                                        {/* FIX: 'SubmissionStatus' only refers to a type. Used string literal 'approved' instead. */}
                                        <button onClick={() => handleUpdateStatus(sub.id, 'approved')} className="bg-accent-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
                                            <Check className="h-5 w-5 mr-1" /> Approve
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 mt-8">No pending submissions. Great job!</p>
            )}
        </div>
    );
};

export default AdminVerificationHub;