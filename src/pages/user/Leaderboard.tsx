import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/supabaseService';
import { Loader2 } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const topUsers = await userService.getLeaderboard(20); // Get top 20 users
        const leaderboard: LeaderboardUser[] = topUsers.map((user, index) => ({
          id: user.id,
          name: user.name,
          points: user.points,
          level: user.level,
          rank: index + 1
        }));
        setLeaderboardData(leaderboard);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-400';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-8">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Current User Rank */}
          {user && (
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Your Rank</p>
                    <p className="text-yellow-400 text-sm">#{leaderboardData.findIndex(u => u.id === user.id) + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{user.points.toLocaleString()} pts</p>
                  <p className="text-gray-400 text-sm">Level {user.level}</p>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboardData.slice(0, 10).map((player, index) => {
              const isCurrentUser = user && player.id === user.id;
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isCurrentUser
                      ? 'bg-yellow-400/10 border-yellow-400/30'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${getRankColor(index + 1)}`}>
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{player.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className={`font-semibold ${isCurrentUser ? 'text-yellow-400' : 'text-white'}`}>
                        {player.name}
                        {isCurrentUser && <span className="text-xs ml-2">(You)</span>}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Level {player.level}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{player.points.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">points</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Complete more quests to climb the leaderboard! 🚀
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;