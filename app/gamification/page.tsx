/**
 * Gamification Dashboard Page
 * Showcases the comprehensive gamification system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Star,
  Target,
  TrendingUp,
  Award,
  Zap,
  Users,
  Calendar,
  Gift,
  Flame,
  Crown,
  Medal
} from 'lucide-react';
import { EnhancedGamificationDashboard } from '@/components/enhanced-gamification-dashboard';
import MarketQuiz from '@/components/market-quiz';
import { MainLayout } from '@/components/navigation';
import { useGamification } from '@/contexts/GamificationContext';

export default function GamificationPage() {
  const { state, actions } = useGamification();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Sample data for demonstration
  const sampleAchievements = [
    {
      id: 'first-trade',
      title: 'First Trade',
      description: 'Complete your first trade in the simulator',
      icon: '🎯',
      category: 'trading',
      rarity: 'common' as const,
      points: 100,
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      progress: 100,
      maxProgress: 100
    },
    {
      id: 'profit-streak',
      title: 'Profit Streak',
      description: 'Achieve 5 consecutive profitable trades',
      icon: '🔥',
      category: 'trading',
      rarity: 'rare' as const,
      points: 500,
      unlocked: true,
      unlockedAt: new Date('2024-01-20'),
      progress: 5,
      maxProgress: 5
    },
    {
      id: 'portfolio-master',
      title: 'Portfolio Master',
      description: 'Build a portfolio worth $100,000',
      icon: '💰',
      category: 'portfolio',
      rarity: 'epic' as const,
      points: 1000,
      unlocked: false,
      progress: 75000,
      maxProgress: 100000
    },
    {
      id: 'learning-champion',
      title: 'Learning Champion',
      description: 'Complete 50 learning modules',
      icon: '📚',
      category: 'learning',
      rarity: 'legendary' as const,
      points: 2000,
      unlocked: false,
      progress: 35,
      maxProgress: 50
    }
  ];

  const sampleChallenges = [
    {
      id: 'daily-login',
      title: 'Daily Login',
      description: 'Log in to the platform today',
      type: 'daily' as const,
      points: 50,
      progress: 1,
      maxProgress: 1,
      completed: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: 'weekly-trades',
      title: 'Weekly Trader',
      description: 'Complete 10 trades this week',
      type: 'weekly' as const,
      points: 200,
      progress: 7,
      maxProgress: 10,
      completed: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'monthly-portfolio',
      title: 'Portfolio Growth',
      description: 'Grow your portfolio by 10% this month',
      type: 'monthly' as const,
      points: 500,
      progress: 7.5,
      maxProgress: 10,
      completed: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  ];

  const sampleLeaderboard = [
    { rank: 1, username: 'TradeMaster2024', points: 15420, level: 25, avatar: '👑' },
    { rank: 2, username: 'StockWizard', points: 14850, level: 24, avatar: '🧙‍♂️' },
    { rank: 3, username: 'MarketGuru', points: 14200, level: 23, avatar: '📈' },
    { rank: 4, username: 'InvestPro', points: 13890, level: 22, avatar: '💼' },
    { rank: 5, username: 'AlgoTrader', points: 13500, level: 21, avatar: '🤖' },
    { rank: 6, username: 'RiskManager', points: 12950, level: 20, avatar: '⚖️' },
    { rank: 7, username: 'PortfolioKing', points: 12400, level: 19, avatar: '👑' },
    { rank: 8, username: 'ChartExpert', points: 11800, level: 18, avatar: '📊' },
    { rank: 9, username: 'DividendDude', points: 11200, level: 17, avatar: '💰' },
    { rank: 10, username: 'SwingTrader', points: 10800, level: 16, avatar: '🏌️‍♂️' }
  ];

  const handleClaimReward = (challengeId: string) => {
    console.log('Claiming reward for challenge:', challengeId);
    // In a real app, this would call the gamification engine
  };

  const handleAchievementClick = (achievementId: string) => {
    console.log('Viewing achievement details:', achievementId);
    // In a real app, this would show achievement details modal
  };

  useEffect(() => {
    // Load user profile on component mount
    actions.loadUserProfile('current-user');
  }, [actions]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gamification Hub</h1>
          <p className="text-gray-600">
            Track your progress, earn achievements, and compete with other traders
            in our comprehensive gamification system.
          </p>
        </div>

        {/* Achievement Notifications */}
        {/* <AchievementNotificationContainer /> */}

        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold">{state.userProfile?.level || 1}</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total XP</p>
                  <p className="text-2xl font-bold">{state.userProfile?.xp || 0}</p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold">{sampleAchievements.filter(a => a.unlocked).length}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rank</p>
                  <p className="text-2xl font-bold">#42</p>
                </div>
                <Medal className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* XP Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {state.userProfile?.level || 1} Progress</span>
              <span className="text-sm text-gray-600">
                {state.userProfile?.xp || 0} / {state.userProfile?.xpToNextLevel || 1000} XP
              </span>
            </div>
            <Progress
              value={((state.userProfile?.xp || 0) / (state.userProfile?.xpToNextLevel || 1000)) * 100}
              className="h-3"
            />
            <p className="text-xs text-gray-500 mt-2">
              {((state.userProfile?.xpToNextLevel || 1000) - (state.userProfile?.xp || 0))} XP to next level
            </p>
          </CardContent>
        </Card>

        {/* Main Gamification Dashboard */}
        <EnhancedGamificationDashboard
          userId="current-user"
        />

        {/* Market Quiz Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Market Knowledge Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-600">
                  Test your stock market knowledge and earn bonus XP! Complete the quiz to unlock achievements
                  and improve your trading skills.
                </p>
              </div>
              <MarketQuiz />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Daily Challenges</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete daily tasks to earn bonus XP and rewards
              </p>
              <Button variant="outline" size="sm">
                View Challenges
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Leaderboards</h3>
              <p className="text-sm text-gray-600 mb-4">
                Compete with other traders and climb the rankings
              </p>
              <Button variant="outline" size="sm">
                View Rankings
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Gift className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Rewards Store</h3>
              <p className="text-sm text-gray-600 mb-4">
                Redeem your points for exclusive rewards and perks
              </p>
              <Button variant="outline" size="sm">
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
