import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Settings, 
  Trophy, 
  Activity, 
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Award,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { activityService } from '../../services/supabaseService';

interface ActivityLog {
  id: string;
  type: 'SUCCESS' | 'FAILED' | 'CLAIM';
  description: string;
  date: string;
  points?: number;
  status?: string;
}

interface UserStats {
  completedQuests: number;
  claimedRewards: number;
  daysActive: number;
}

const Profile: React.FC = () => {
  const { user, updateUser, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    completedQuests: 0,
    claimedRewards: 0,
    daysActive: 1,
  });
  const [loadingActivities, setLoadingActivities] = useState(false);

  console.log('👤 Profile page render - user:', user, 'isLoading:', isLoading);
  console.log('👤 User object details:', {
    hasUser: !!user,
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email
  });

  // Load user activity and stats when user is available
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        console.log('📊 Loading activity for user:', user.id);
        setLoadingActivities(true);
        try {
          const [activityData, statsData] = await Promise.all([
            activityService.getUserActivity(user.id),
            activityService.getUserStats(user.id)
          ]);
          console.log('✅ Loaded activity:', activityData.length, 'records');
          console.log('✅ Loaded stats:', statsData);
          setActivities(activityData);
          setUserStats(statsData);
        } catch (error) {
          console.error('❌ Error loading user data:', error);
        } finally {
          setLoadingActivities(false);
        }
      }
    };

    loadUserData();
  }, [user?.id]);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telegramUsername: user?.telegramUsername || '',
    twitterUsername: user?.twitterUsername || '',
    discordUsername: user?.discordUsername || '',
  });

  // Show loading state while user is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-medium text-white mb-2">Loading Profile</h3>
          <p className="text-gray-400">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  // If not loading but no user, show error state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Profile Not Available</h3>
          <p className="text-gray-400 mb-6">We couldn't load your profile. This might be a temporary issue.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      console.log('💾 Saving profile changes:', editForm);
      await updateUser(editForm);
      setIsEditing(false);
      console.log('✅ Profile saved successfully');
    } catch (error) {
      console.error('❌ Failed to save profile:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      telegramUsername: user?.telegramUsername || '',
      twitterUsername: user?.twitterUsername || '',
      discordUsername: user?.discordUsername || '',
    });
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return '✅';
      case 'FAILED': return '❌';
      case 'CLAIM': return '🎁';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'text-green-400';
      case 'FAILED': return 'text-red-400';
      case 'CLAIM': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Professional Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-800/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Header Content */}
        <div className="relative px-6 pt-8 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {user?.name || 'Professional User'}
                    </h1>
                    <div className="flex items-center gap-2 text-blue-200 mb-3">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm md:text-base">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Quest Hub Member</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 shadow-lg border border-white/20"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
                      <Trophy className="w-5 h-5" />
                      {user?.points || 0}
                    </div>
                    <div className="text-xs text-gray-400">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
                      <Award className="w-5 h-5" />
                      0
                    </div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xl">
                      <Star className="w-5 h-5" />
                      1
                    </div>
                    <div className="text-xs text-gray-400">Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Tab Navigation */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 shadow-xl border border-gray-700/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <User className="w-4 h-4" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'activity'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity History
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Telegram Username
                        </label>
                        <input
                          type="text"
                          value={editForm.telegramUsername}
                          onChange={(e) => setEditForm({ ...editForm, telegramUsername: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Twitter Username
                        </label>
                        <input
                          type="text"
                          value={editForm.twitterUsername}
                          onChange={(e) => setEditForm({ ...editForm, twitterUsername: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Discord Username
                        </label>
                        <input
                          type="text"
                          value={editForm.discordUsername}
                          onChange={(e) => setEditForm({ ...editForm, discordUsername: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="username#1234"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-6 border-t border-gray-700">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                          <p className="text-white text-lg">{user?.name || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                          <p className="text-white text-lg">{user?.email || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">User ID</label>
                          <p className="text-gray-300 text-sm font-mono bg-gray-700/30 rounded-lg p-2 break-all">
                            {user?.id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Telegram</label>
                          <p className="text-white text-lg">{user?.telegramUsername || 'Not connected'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Twitter</label>
                          <p className="text-white text-lg">{user?.twitterUsername || 'Not connected'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Discord</label>
                          <p className="text-white text-lg">{user?.discordUsername || 'Not connected'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Performance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-300">Total Points</span>
                    </div>
                    <span className="text-yellow-400 font-bold text-lg">{user?.points || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Completed Quests</span>
                    </div>
                    <span className="text-green-400 font-bold text-lg">{userStats.completedQuests}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">Rewards Claimed</span>
                    </div>
                    <span className="text-purple-400 font-bold text-lg">{userStats.claimedRewards}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Days Active</span>
                    </div>
                    <span className="text-blue-400 font-bold text-lg">{userStats.daysActive}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-600/30">
                    <Activity className="w-4 h-4" />
                    View Activity
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors border border-green-600/30">
                    <Trophy className="w-4 h-4" />
                    Browse Quests
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-600/30">
                    <Award className="w-4 h-4" />
                    View Rewards
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Activity Timeline */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              </div>

              {loadingActivities ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="relative">
                      {index < activities.length - 1 && (
                        <div className="absolute left-6 top-12 w-px h-8 bg-gray-600"></div>
                      )}
                      <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                          activity.type === 'SUCCESS' ? 'bg-green-600/20 border border-green-600/30' :
                          activity.type === 'FAILED' ? 'bg-red-600/20 border border-red-600/30' :
                          'bg-yellow-600/20 border border-yellow-600/30'
                        }`}>
                          <span>{getActivityIcon(activity.type)}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-white font-medium mb-1">{activity.description}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(activity.date).toLocaleString()}</span>
                              </div>
                            </div>
                            
                            {activity.points && (
                              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                activity.type === 'SUCCESS' ? 'bg-green-600/20 text-green-400' :
                                activity.type === 'CLAIM' ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-gray-600/20 text-gray-400'
                              }`}>
                                <Trophy className="w-3 h-3" />
                                +{activity.points} pts
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No Activity Yet</h3>
                  <p className="text-gray-500 mb-6">Start completing quests to see your activity timeline here</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Browse Quests
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Professional Logout Section */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Account Settings</h3>
              <p className="text-gray-400 text-sm">Manage your account preferences and security</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-medium border border-red-600/30"
            >
              <Settings className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
