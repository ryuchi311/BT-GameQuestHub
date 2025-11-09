import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuests } from '../../context/QuestContext';
import { ArrowLeft } from 'lucide-react';

const QuestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quests, selectedQuest, submitQuest, completeQuest } = useQuests();

  const quest = selectedQuest || quests.find(q => q.id === id);

  if (!quest) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Quest not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Back to Quests
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (quest.verificationType === 'Automatic') {
      completeQuest(quest);
    } else {
      submitQuest(quest.id);
    }
  };

  const isCompleted = quest.isCompleted || quest.submissionStatus === 'approved';
  const isPending = quest.submissionStatus === 'pending';
  const isRejected = quest.submissionStatus === 'rejected';

  return (
    <div className="mt-4 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Quests
      </button>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-white">{quest.title}</h1>
          <span className="bg-yellow-400 text-gray-900 text-lg font-bold px-3 py-1 rounded">
            +{quest.reward} points
          </span>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">{quest.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-400">Platform:</span>
            <span className="text-white ml-2">{quest.platform}</span>
          </div>
          <div>
            <span className="text-gray-400">Difficulty:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              quest.difficulty === 'Easy' ? 'bg-green-600/20 text-green-400' :
              quest.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
              quest.difficulty === 'Hard' ? 'bg-red-600/20 text-red-400' :
              'bg-purple-600/20 text-purple-400'
            }`}>
              {quest.difficulty}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Type:</span>
            <span className="text-white ml-2">{quest.type}</span>
          </div>
          <div>
            <span className="text-gray-400">Verification:</span>
            <span className="text-white ml-2">{quest.verificationType}</span>
          </div>
        </div>

        {quest.questUrl && (
          <div className="mb-6">
            <a
              href={quest.questUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Open Quest Link
            </a>
          </div>
        )}

        <div className="mt-6">
          {isCompleted ? (
            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
              <p className="text-green-400 font-semibold">✓ Quest Completed!</p>
              <p className="text-green-300 text-sm mt-1">You've earned {quest.reward} points.</p>
            </div>
          ) : isPending ? (
            <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
              <p className="text-yellow-400 font-semibold">⏳ Submission Under Review</p>
              <p className="text-yellow-300 text-sm mt-1">Please wait for admin approval.</p>
            </div>
          ) : isRejected ? (
            <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 mb-4">
              <p className="text-red-400 font-semibold">✗ Submission Rejected</p>
              <p className="text-red-300 text-sm mt-1">Please try again with valid proof.</p>
            </div>
          ) : null}

          {!isCompleted && !isPending && (
            <button
              onClick={handleSubmit}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {quest.verificationType === 'Automatic' ? 'Complete Quest' : 'Submit for Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;