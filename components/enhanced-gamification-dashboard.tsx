/**
 * Enhanced Gamification Dashboard Component
 * Comprehensive gamification interface with achievements, progress, and leaderboards
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Star,
  Flame,
  Target,
  Users,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  Clock,
  Gift
} from 'lucide-react';
import { gamificationEngine } from '@/lib/gamification-engine';
import { Achievement, UserGamification, DailyChallenge, LeaderboardEntry } from '@/lib/gamification-types';

interface GamificationDashboardProps {
  userId: string;
  className?: string;
}

export const EnhancedGamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userId,
  className = ''
}) => {
  const [userProfile, setUserProfile] = useState<UserGamification | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load user profile
    const profile = gamificationEngine.getUserProfile(userId);
    setUserProfile(profile);

    // Load achievements
    const allAchievements = gamificationEngine.getAllAchievements();
    setAchievements(allAchievements);

    // Generate daily challenges if needed
    if (profile.dailyChallenges.length === 0) {
      const challenges = gamificationEngine.generateDailyChallenges(userId);
      setDailyChallenges(challenges);
    } else {
      setDailyChallenges(profile.dailyChallenges);
    }

    // Update leaderboard
    gamificationEngine.updateLeaderboard('overall');
    const lb = gamificationEngine.getLeaderboard('overall', 'weekly');
    if (lb) {
      setLeaderboard(lb.entries.slice(0, 10)); // Top 10
    }
  }, [userId]);

  const handleClaimChallenge = (challengeId: string) => {
    const success = gamificationEngine.claimDailyChallengeReward(userId, challengeId);
    if (success) {
      // Refresh profile
      const profile = gamificationEngine.getUserProfile(userId);
      setUserProfile(profile);
      setDailyChallenges(profile.dailyChallenges);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const progressToNextLevel = (userProfile.xp / userProfile.xpToNextLevel) * 100;

  return (
    <div className={`enhanced-gamification-dashboard ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{userProfile.level}</div>
            <div className="text-sm text-gray-600">Level</div>
            <Progress value={progressToNextLevel} className="mt-2" />
            <div className="text-xs text-gray-500 mt-1">
              {userProfile.xp}/{userProfile.xpToNextLevel} XP to next level
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-3xl font-bold">{userProfile.totalPoints}</div>
            <div className="text-sm text-gray-600">Points</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-3xl font-bold">{userProfile.achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-3xl font-bold">
              {userProfile.streaks.find(s => s.type === 'learning')?.current || 0}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Daily Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress
                          value={(challenge.current / challenge.target) * 100}
                          className="flex-1 max-w-xs"
                        />
                        <span className="text-sm text-gray-600">
                          {challenge.current}/{challenge.target}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm">
                        <div className="font-medium">+{challenge.xpReward} XP</div>
                        <div className="text-gray-600">+{challenge.pointsReward} pts</div>
                      </div>
                      {challenge.completed && !challenge.claimed && (
                        <Button
                          size="sm"
                          onClick={() => handleClaimChallenge(challenge.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Gift className="h-4 w-4 mr-1" />
                          Claim
                        </Button>
                      )}
                      {challenge.claimed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProfile.achievements.slice(-6).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={
                          achievement.difficulty === 'bronze' ? 'secondary' :
                          achievement.difficulty === 'silver' ? 'default' :
                          achievement.difficulty === 'gold' ? 'default' :
                          'destructive'
                        }>
                          {achievement.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-600">+{achievement.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievement Categories */}
          {['learning', 'trading', 'social', 'streak', 'special'].map((category) => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            const unlockedCount = categoryAchievements.filter(a => a.unlockedAt).length;

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{category.replace('_', ' ')} Achievements</span>
                    <span className="text-sm text-gray-600">
                      {unlockedCount}/{categoryAchievements.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryAchievements.map((achievement) => {
                      const isUnlocked = achievement.unlockedAt;
                      const progress = (achievement.currentProgress / achievement.maxProgress) * 100;

                      return (
                        <div
                          key={achievement.id}
                          className={`p-4 border rounded-lg ${
                            isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{achievement.name}</h4>
                              <p className="text-sm text-gray-600">{achievement.description}</p>

                              {!isUnlocked && (
                                <div className="mt-2">
                                  <Progress value={progress} className="h-2" />
                                  <div className="text-xs text-gray-600 mt-1">
                                    {achievement.currentProgress}/{achievement.maxProgress}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={
                                  achievement.difficulty === 'bronze' ? 'secondary' :
                                  achievement.difficulty === 'silver' ? 'default' :
                                  achievement.difficulty === 'gold' ? 'default' :
                                  'destructive'
                                }>
                                  {achievement.difficulty}
                                </Badge>
                                <span className="text-xs text-gray-600">
                                  {achievement.points} pts, {achievement.xpReward} XP
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={challenge.completed ? 'default' : 'secondary'}>
                          {challenge.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                        {challenge.claimed && (
                          <Badge variant="outline" className="text-green-600">
                            Claimed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <Progress
                          value={(challenge.current / challenge.target) * 100}
                          className="h-3"
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {challenge.current}/{challenge.target}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>+{challenge.xpReward} XP</span>
                        <span>+{challenge.pointsReward} points</span>
                      </div>
                      {challenge.completed && !challenge.claimed && (
                        <Button
                          onClick={() => handleClaimChallenge(challenge.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Gift className="h-4 w-4 mr-1" />
                          Claim Reward
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      entry.userId === userId ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.username}</span>
                          <Badge variant="outline" style={{ color: entry.rank.color }}>
                            {entry.rank.icon} {entry.rank.name}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          Level {entry.level} • {entry.xp} XP
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.points} pts</div>
                      <div className="text-sm text-gray-600">
                        {entry.achievementsCount} achievements
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedGamificationDashboard;
