'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Target,
  Zap,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Gift,
  Crown,
  Medal,
  Flame
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GamificationStats, Achievement, DailyChallenge } from '@/lib/types';
import AchievementGallery from './achievement-gallery';
import Leaderboard from './leaderboard';
import DailyChallenges from './daily-challenges';

interface GamificationDashboardProps {
  className?: string;
}

export default function GamificationDashboard({ className }: GamificationDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);

      // Fetch user stats
      const statsResponse = await fetch('/api/gamification/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Fetch recent achievements
      const achievementsResponse = await fetch('/api/gamification/achievements?limit=5');
      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setRecentAchievements(achievementsData.achievements);
      }
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = () => {
    if (!stats) return 0;
    return (stats.levelProgress / 100) * 100;
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (streak >= 14) return <Medal className="h-4 w-4 text-orange-500" />;
    if (streak >= 7) return <Award className="h-4 w-4 text-blue-500" />;
    return <Flame className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-muted rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded w-full"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">Total XP</span>
            </div>
            <div className="text-2xl font-bold">{stats?.totalXP.toLocaleString() || 0}</div>
            <div className="text-xs text-muted-foreground">
              Level {stats?.currentLevel || 1}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Achievements</span>
            </div>
            <div className="text-2xl font-bold">
              {stats?.unlockedAchievements || 0}/{stats?.totalAchievements || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats ? Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100) : 0}% unlocked
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              {getStreakIcon(stats?.currentStreak || 0)}
              <span className="text-sm font-medium text-muted-foreground">Current Streak</span>
            </div>
            <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
            <div className="text-xs text-muted-foreground">
              Best: {stats?.longestStreak || 0} days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Leaderboard Rank</span>
            </div>
            <div className="text-2xl font-bold">#{stats?.leaderboardRank || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">
              {stats?.weeklyXP || 0} XP this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Level {stats?.currentLevel || 1}</span>
              <span className="text-sm text-muted-foreground">
                {stats?.xpToNextLevel || 0} XP to next level
              </span>
            </div>
            <Progress value={getLevelProgress()} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats ? stats.totalXP - stats.levelProgress : 0} XP</span>
              <span>{stats ? stats.totalXP + stats.xpToNextLevel : 0} XP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAchievements.length > 0 ? (
                  <div className="space-y-3">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.title}</div>
                          <div className="text-sm text-muted-foreground">{achievement.description}</div>
                        </div>
                        <Badge variant="secondary">+{achievement.xpReward} XP</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements yet</p>
                    <p className="text-sm">Complete lessons and challenges to earn achievements!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Study Time</span>
                    <span className="font-medium">{stats?.totalStudyTime || 0} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Trades</span>
                    <span className="font-medium">{stats?.totalTrades || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Win Rate</span>
                    <span className="font-medium">{stats ? Math.round(stats.winRate * 100) : 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly XP</span>
                    <span className="font-medium">{stats?.monthlyXP || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementGallery />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>

        <TabsContent value="challenges">
          <DailyChallenges />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={fetchGamificationData} variant="outline">
          Refresh Data
        </Button>
        <Button>
          <Gift className="h-4 w-4 mr-2" />
          View Rewards Store
        </Button>
      </div>
    </div>
  );
}
