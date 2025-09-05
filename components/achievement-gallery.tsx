'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Target, Zap, Crown } from 'lucide-react';
import { Achievement, ApiResponse } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface AchievementGalleryProps {
  className?: string;
}

const AchievementGallery: React.FC<AchievementGalleryProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/gamification/achievements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: ApiResponse<Achievement[]> = await response.json();

      if (data.success) {
        setAchievements(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch achievements');
      }
    } catch (err) {
      setError('Failed to fetch achievements');
      console.error('Achievement fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return <Award className="w-8 h-8 text-blue-500" />;
      case 'trading':
        return <Target className="w-8 h-8 text-green-500" />;
      case 'social':
        return <Trophy className="w-8 h-8 text-purple-500" />;
      case 'consistency':
        return <Zap className="w-8 h-8 text-orange-500" />;
      case 'milestone':
        return <Crown className="w-8 h-8 text-red-500" />;
      case 'special':
        return <Star className="w-8 h-8 text-yellow-500" />;
      default:
        return <Award className="w-8 h-8 text-gray-500" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'uncommon':
        return 'border-green-300 bg-green-50';
      case 'rare':
        return 'border-blue-300 bg-blue-50';
      case 'epic':
        return 'border-purple-300 bg-purple-50';
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6FF3A]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchAchievements}
            className="mt-4 px-4 py-2 bg-[#C6FF3A] text-black rounded-lg hover:bg-[#C6FF3A]/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Achievement Gallery</h2>
        <p className="text-gray-400">
          {unlockedAchievements.length} of {achievements.length} achievements unlocked
        </p>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Unlocked Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} bg-opacity-10 backdrop-blur-sm`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  {getAchievementIcon(achievement.category)}
                  <div>
                    <h4 className="font-semibold text-white">{achievement.title}</h4>
                    <p className="text-sm text-gray-400 capitalize">{achievement.rarity}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C6FF3A] font-semibold">+{achievement.xpReward} XP</span>
                  <span className="text-xs text-gray-500">
                    Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Locked Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 rounded-lg border-2 border-gray-600 bg-gray-800/50 backdrop-blur-sm opacity-60"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-400">{achievement.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">{achievement.rarity}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">+{achievement.xpReward} XP</span>
                  <span className="text-xs text-gray-600">Locked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No achievements available yet.</p>
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;
