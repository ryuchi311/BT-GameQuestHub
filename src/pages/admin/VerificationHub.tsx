import React, { useState } from 'react';
import { Check, X, ExternalLink, User } from 'lucide-react';

interface Submission {
  id: string;
  questId: string;
  userId: string;
  questTitle: string;
  userName: string;
  proof: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const VerificationHub: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 's1',
      questId: 'q1',
      userId: 'u1',
      questTitle: 'Subscribe to our YouTube Channel',
      userName: 'John Doe',
      proof: 'https://imgur.com/screenshot123.png',
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'pending',
    },
    {
      id: 's2',
      questId: 'q2',
      userId: 'u2',
      questTitle: 'Follow us on Twitter',
      userName: 'Jane Smith',
      proof: '@janesmith',
      timestamp: new Date('2024-01-15T09:15:00'),
      status: 'pending',
    },
    {
      id: 's3',
      questId: 'q3',
      userId: 'u3',
      questTitle: 'Retweet our Pinned Post',
      userName: 'Mike Johnson',
      proof: 'https://twitter.com/mike/status/123456',
      timestamp: new Date('2024-01-14T16:45:00'),
      status: 'pending',
    },
  ]);

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleStatusUpdate = async (submissionId: string, newStatus: 'approved' | 'rejected') => {
    setProcessingIds(prev => new Set(prev).add(submissionId));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: newStatus }
            : sub
        )
      );
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  };

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const processedSubmissions = submissions.filter(sub => sub.status !== 'pending');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Verification Hub</h1>
        <p className="text-gray-400">
          Review and approve user quest submissions. {pendingSubmissions.length} pending review.
        </p>
      </div>

      {/* Pending Submissions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          Pending Submissions ({pendingSubmissions.length})
        </h2>
        
        {pendingSubmissions.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSubmissions.map(submission => {
              const isProcessing = processingIds.has(submission.id);
              
              return (
                <div key={submission.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {submission.questTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{submission.userName}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(submission.timestamp)}</span>
                      </div>
                    </div>
                    <span className="bg-yellow-600/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Submitted Proof:</h4>
                    <div className="bg-slate-700 rounded p-3">
                      {submission.proof.startsWith('http') ? (
                        <a
                          href={submission.proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                        >
                          {submission.proof}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <p className="text-white">{submission.proof}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(submission.id, 'approved')}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                      disabled={isProcessing}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Decisions */}
      {processedSubmissions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Decisions ({processedSubmissions.length})
          </h2>
          
          <div className="space-y-3">
            {processedSubmissions.slice(0, 5).map(submission => (
              <div key={submission.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{submission.questTitle}</p>
                    <p className="text-sm text-gray-400">{submission.userName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    submission.status === 'approved'
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {submission.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationHub;