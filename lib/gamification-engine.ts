/**
 * Enhanced Gamification Engine
 * Core logic for achievements, XP, levels, and progress tracking
 */

import {
  Achievement,
  UserGamification,
  AchievementRequirement,
  UserStreak,
  DailyChallenge,
  WeeklyGoal,
  UserRank,
  GamificationStats,
  LeaderboardEntry,
  Leaderboard,
  GamificationEvent,
  NotificationReward
} from './gamification-types';

export class EnhancedGamificationEngine {
  private achievements: Map<string, Achievement> = new Map();
  private userProfiles: Map<string, UserGamification> = new Map();
  private leaderboards: Map<string, Leaderboard> = new Map();
  private eventListeners: Map<string, ((event: GamificationEvent) => void)[]> = new Map();

  constructor() {
    this.initializeAchievements();
    this.initializeRanks();
  }

  // Achievement Management
  private initializeAchievements(): void {
    const achievements: Achievement[] = [
      // Learning Achievements
      {
        id: 'first_module',
        name: 'First Steps',
        description: 'Complete your first learning module',
        icon: '🎓',
        category: 'learning',
        difficulty: 'bronze',
        points: 10,
        xpReward: 50,
        requirements: [{ type: 'module_complete', target: 1, current: 0, description: 'Complete 1 module' }],
        isHidden: false,
        isRepeatable: false,
        maxProgress: 1,
        currentProgress: 0,
        progressHistory: []
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Score 100% on 5 different quizzes',
        icon: '🧠',
        category: 'learning',
        difficulty: 'gold',
        points: 50,
        xpReward: 250,
        requirements: [{ type: 'quiz_score', target: 5, current: 0, description: 'Score 100% on 5 quizzes' }],
        isHidden: false,
        isRepeatable: false,
        maxProgress: 5,
        currentProgress: 0,
        progressHistory: []
      },
      {
        id: 'learning_streak',
        name: 'Dedication',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'streak',
        difficulty: 'silver',
        points: 25,
        xpReward: 150,
        requirements: [{ type: 'streak_days', target: 7, current: 0, description: '7-day learning streak' }],
        isHidden: false,
        isRepeatable: false,
        maxProgress: 7,
        currentProgress: 0,
        progressHistory: []
      },

      // Trading Achievements
      {
        id: 'first_trade',
        name: 'First Trade',
        description: 'Execute your first simulated trade',
        icon: '📈',
        category: 'trading',
        difficulty: 'bronze',
        points: 15,
        xpReward: 75,
        requirements: [{ type: 'trading_profit', target: 1, current: 0, description: 'Execute 1 trade' }],
        isHidden: false,
        isRepeatable: false,
        maxProgress: 1,
        currentProgress: 0,
        progressHistory: []
      },
      {
        id: 'profit_hunter',
        name: 'Profit Hunter',
        description: 'Achieve 10% profit in a single trading session',
        icon: '💰',
        category: 'trading',
        difficulty: 'gold',
        points: 75,
        xpReward: 500,
        requirements: [{ type: 'trading_profit', target: 10, current: 0, description: '10% profit in one session' }],
        isHidden: false,
        isRepeatable: true,
        maxProgress: 10,
        currentProgress: 0,
        progressHistory: []
      },

      // Social Achievements
      {
        id: 'community_helper',
        name: 'Community Helper',
        description: 'Help 10 fellow learners in the community',
        icon: '🤝',
        category: 'social',
        difficulty: 'silver',
        points: 30,
        xpReward: 200,
        requirements: [{ type: 'social_interaction', target: 10, current: 0, description: 'Help 10 learners' }],
        isHidden: false,
        isRepeatable: false,
        maxProgress: 10,
        currentProgress: 0,
        progressHistory: []
      },

      // Special Achievements
      {
        id: 'strategy_creator',
        name: 'Strategy Architect',
        description: 'Create 5 custom trading strategies',
        icon: '⚡',
        category: 'special',
        difficulty: 'platinum',
        points: 100,
        xpReward: 750,
        requirements: [{ type: 'strategy_created', target: 5, current: 0, description: 'Create 5 strategies' }],
        isHidden: false,
        isRepeatable: false,
        maxProgress: 5,
        currentProgress: 0,
        progressHistory: []
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  private initializeRanks(): void {
    // Ranks are initialized in getUserRank()
  }

  // User Profile Management
  getUserProfile(userId: string): UserGamification {
    if (!this.userProfiles.has(userId)) {
      const profile: UserGamification = {
        userId,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        totalPoints: 0,
        achievements: [],
        streaks: [
          { type: 'login', current: 0, longest: 0, lastUpdated: new Date() },
          { type: 'learning', current: 0, longest: 0, lastUpdated: new Date() },
          { type: 'trading', current: 0, longest: 0, lastUpdated: new Date() }
        ],
        dailyChallenges: [],
        weeklyGoals: [],
        leaderboardPosition: 0,
        rank: this.getRankForLevel(1),
        stats: {
          totalModulesCompleted: 0,
          totalQuizzesTaken: 0,
          averageQuizScore: 0,
          totalTradingVolume: 0,
          totalTradingProfit: 0,
          winRate: 0,
          longestLearningStreak: 0,
          totalTimeSpent: 0,
          socialInteractions: 0,
          strategiesCreated: 0
        }
      };
      this.userProfiles.set(userId, profile);
    }
    return this.userProfiles.get(userId)!;
  }

  // XP and Level System
  addXP(userId: string, xpAmount: number): { levelUp: boolean; newLevel?: number } {
    const profile = this.getUserProfile(userId);
    profile.xp += xpAmount;

    let levelUp = false;
    let newLevel = profile.level;

    while (profile.xp >= profile.xpToNextLevel) {
      profile.xp -= profile.xpToNextLevel;
      profile.level++;
      profile.xpToNextLevel = this.calculateXPForLevel(profile.level);
      levelUp = true;
      newLevel = profile.level;
    }

    this.userProfiles.set(userId, profile);

    if (levelUp) {
      this.emitEvent({
        type: 'level_up',
        userId,
        data: { newLevel },
        timestamp: new Date(),
        xp: xpAmount
      });
    }

    return { levelUp, newLevel: levelUp ? newLevel : undefined };
  }

  private calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  }

  // Achievement System
  updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number,
    description?: string
  ): { unlocked: boolean; achievement?: Achievement } {
    const profile = this.getUserProfile(userId);
    const achievement = this.achievements.get(achievementId);

    if (!achievement) return { unlocked: false };

    // Update progress
    achievement.currentProgress = Math.min(achievement.currentProgress + progress, achievement.maxProgress);

    // Record progress history
    if (description) {
      achievement.progressHistory.push({
        date: new Date(),
        progress: achievement.currentProgress,
        description
      });
    }

    // Check if achievement is unlocked
    const isComplete = achievement.currentProgress >= achievement.maxProgress;
    if (isComplete && !achievement.unlockedAt) {
      achievement.unlockedAt = new Date();
      profile.achievements.push(achievement);
      profile.totalPoints += achievement.points;

      // Award XP
      this.addXP(userId, achievement.xpReward);

      this.emitEvent({
        type: 'achievement_unlocked',
        userId,
        data: { achievement },
        timestamp: new Date(),
        points: achievement.points,
        xp: achievement.xpReward
      });

      return { unlocked: true, achievement };
    }

    return { unlocked: false };
  }

  // Streak Management
  updateStreak(userId: string, streakType: UserStreak['type']): void {
    const profile = this.getUserProfile(userId);
    const streak = profile.streaks.find(s => s.type === streakType);

    if (!streak) return;

    const now = new Date();
    const lastUpdate = new Date(streak.lastUpdated);
    const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day
      streak.current++;
      if (streak.current > streak.longest) {
        streak.longest = streak.current;
      }
    } else if (daysDiff > 1) {
      // Streak broken
      streak.current = 1;
    }

    streak.lastUpdated = now;
    this.userProfiles.set(userId, profile);

    // Check for streak achievements
    if (streak.current >= 7) {
      this.updateAchievementProgress(userId, 'learning_streak', 1, `${streak.current}-day ${streakType} streak`);
    }
  }

  // Daily Challenges
  generateDailyChallenges(userId: string): DailyChallenge[] {
    const profile = this.getUserProfile(userId);
    const challenges: DailyChallenge[] = [];

    // Learning challenge
    challenges.push({
      id: `daily-learning-${Date.now()}`,
      title: 'Daily Learning',
      description: 'Complete 2 learning modules today',
      type: 'learning',
      target: 2,
      current: 0,
      xpReward: 100,
      pointsReward: 20,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false,
      claimed: false
    });

    // Trading challenge
    challenges.push({
      id: `daily-trading-${Date.now()}`,
      title: 'Trading Practice',
      description: 'Execute 5 simulated trades',
      type: 'trading',
      target: 5,
      current: 0,
      xpReward: 150,
      pointsReward: 25,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false,
      claimed: false
    });

    profile.dailyChallenges = challenges;
    this.userProfiles.set(userId, profile);

    return challenges;
  }

  updateDailyChallenge(userId: string, challengeId: string, progress: number): boolean {
    const profile = this.getUserProfile(userId);
    const challenge = profile.dailyChallenges.find(c => c.id === challengeId);

    if (!challenge || challenge.completed) return false;

    challenge.current = Math.min(challenge.current + progress, challenge.target);

    if (challenge.current >= challenge.target) {
      challenge.completed = true;
      return true;
    }

    this.userProfiles.set(userId, profile);
    return false;
  }

  // Weekly Goals
  generateWeeklyGoals(userId: string): WeeklyGoal[] {
    const profile = this.getUserProfile(userId);
    const goals: WeeklyGoal[] = [];

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    goals.push({
      id: `weekly-learning-${Date.now()}`,
      title: 'Weekly Scholar',
      description: 'Complete 10 learning modules this week',
      category: 'learning',
      target: 10,
      current: 0,
      xpReward: 500,
      bonusMultiplier: 1.5,
      startDate: startOfWeek,
      endDate: endOfWeek,
      completed: false
    });

    profile.weeklyGoals = goals;
    this.userProfiles.set(userId, profile);

    return goals;
  }

  // Leaderboard Management
  updateLeaderboard(category: 'overall' | 'learning' | 'trading' | 'social' = 'overall'): void {
    const entries: LeaderboardEntry[] = [];

    this.userProfiles.forEach((profile, userId) => {
      let score = 0;

      switch (category) {
        case 'learning':
          score = profile.stats.totalModulesCompleted * 10 + profile.stats.averageQuizScore;
          break;
        case 'trading':
          score = profile.stats.totalTradingProfit + profile.stats.winRate * 100;
          break;
        case 'social':
          score = profile.stats.socialInteractions * 5;
          break;
        default:
          score = profile.xp + profile.totalPoints;
      }

      entries.push({
        userId,
        username: `User ${userId.slice(0, 8)}`,
        rank: profile.rank,
        level: profile.level,
        xp: profile.xp,
        points: profile.totalPoints,
        achievementsCount: profile.achievements.length,
        change: 0 // Would calculate based on previous period
      });
    });

    // Sort by score
    entries.sort((a, b) => {
      if (category === 'overall') {
        return (b.xp + b.points) - (a.xp + a.points);
      }
      return 0; // Would implement proper scoring
    });

    // Assign positions
    entries.forEach((entry, index) => {
      entry.rank = this.getUserRank(entry.level, entry.xp, entry.achievementsCount);
    });

    const leaderboard: Leaderboard = {
      period: 'weekly',
      category,
      entries,
      lastUpdated: new Date()
    };

    this.leaderboards.set(`${category}-weekly`, leaderboard);
  }

  getLeaderboard(category: string, period: string): Leaderboard | null {
    return this.leaderboards.get(`${category}-${period}`) || null;
  }

  // User Rank Calculation
  private getUserRank(level: number, xp: number, achievementsCount: number): UserRank {
    const ranks: UserRank[] = [
      {
        name: 'Novice',
        level: 1,
        icon: '🌱',
        color: '#8B5CF6',
        requirements: { minLevel: 1, minXP: 0, achievementsRequired: 0 }
      },
      {
        name: 'Apprentice',
        level: 5,
        icon: '📚',
        color: '#3B82F6',
        requirements: { minLevel: 5, minXP: 500, achievementsRequired: 3 }
      },
      {
        name: 'Trader',
        level: 10,
        icon: '📈',
        color: '#10B981',
        requirements: { minLevel: 10, minXP: 2000, achievementsRequired: 8 }
      },
      {
        name: 'Expert',
        level: 15,
        icon: '🎯',
        color: '#F59E0B',
        requirements: { minLevel: 15, minXP: 5000, achievementsRequired: 15 }
      },
      {
        name: 'Master',
        level: 20,
        icon: '👑',
        color: '#EF4444',
        requirements: { minLevel: 20, minXP: 10000, achievementsRequired: 25 }
      }
    ];

    for (let i = ranks.length - 1; i >= 0; i--) {
      const rank = ranks[i];
      if (level >= rank.requirements.minLevel &&
          xp >= rank.requirements.minXP &&
          achievementsCount >= rank.requirements.achievementsRequired) {
        return rank;
      }
    }

    return ranks[0];
  }

  // Get rank for level
  private getRankForLevel(level: number): UserRank {
    const ranks: UserRank[] = [
      {
        name: 'Novice',
        level: 1,
        icon: '🌱',
        color: '#10B981',
        requirements: { minLevel: 1, minXP: 0, achievementsRequired: 0 }
      },
      {
        name: 'Apprentice',
        level: 5,
        icon: '⚡',
        color: '#3B82F6',
        requirements: { minLevel: 5, minXP: 500, achievementsRequired: 3 }
      },
      {
        name: 'Expert',
        level: 10,
        icon: '⭐',
        color: '#F59E0B',
        requirements: { minLevel: 10, minXP: 2000, achievementsRequired: 8 }
      },
      {
        name: 'Master',
        level: 15,
        icon: '👑',
        color: '#8B5CF6',
        requirements: { minLevel: 15, minXP: 5000, achievementsRequired: 15 }
      }
    ];

    return ranks.find(rank => level >= rank.level) || ranks[0];
  }

  // Event System
  on(eventType: string, callback: (event: GamificationEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  private emitEvent(event: GamificationEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  // Statistics Tracking
  updateStats(userId: string, statType: keyof GamificationStats, value: number): void {
    const profile = this.getUserProfile(userId);
    profile.stats[statType] = (profile.stats[statType] || 0) + value;
    this.userProfiles.set(userId, profile);

    // Check for achievement progress
    this.checkStatBasedAchievements(userId, statType, profile.stats[statType]);
  }

  private checkStatBasedAchievements(userId: string, statType: keyof GamificationStats, value: number): void {
    switch (statType) {
      case 'totalModulesCompleted':
        if (value >= 1) {
          this.updateAchievementProgress(userId, 'first_module', 1, 'Completed first module');
        }
        break;
      case 'strategiesCreated':
        if (value >= 5) {
          this.updateAchievementProgress(userId, 'strategy_creator', 1, 'Created 5 strategies');
        }
        break;
    }
  }

  // Get all achievements
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  // Get user achievements
  getUserAchievements(userId: string): Achievement[] {
    const profile = this.getUserProfile(userId);
    return profile.achievements;
  }

  // Check achievements based on user actions
  checkAchievements(userId: string, action: string, data?: any): Achievement[] {
    const profile = this.getUserProfile(userId);
    const unlockedAchievements: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (profile.achievements.find(a => a.id === achievement.id)) {
        return; // Already unlocked
      }

      let shouldUnlock = false;

      switch (action) {
        case 'module_completed':
          if (achievement.id === 'first_module' && data?.modulesCompleted >= 1) {
            shouldUnlock = true;
          }
          break;
        case 'quiz_completed':
          if (achievement.id === 'quiz_master' && data?.score >= 90) {
            shouldUnlock = true;
          }
          break;
        case 'trading_profit':
          if (achievement.id === 'profit_hunter' && data?.profit >= 10) {
            shouldUnlock = true;
          }
          break;
        case 'social_help':
          if (achievement.id === 'community_helper' && data?.helps >= 10) {
            shouldUnlock = true;
          }
          break;
        case 'strategy_created':
          if (achievement.id === 'strategy_creator' && data?.strategies >= 5) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
        profile.achievements.push(unlockedAchievement);
        unlockedAchievements.push(unlockedAchievement);

        // Add rewards
        this.addXP(userId, achievement.xpReward);
        profile.totalPoints += achievement.points;
      }
    });

    this.userProfiles.set(userId, profile);
    return unlockedAchievements;
  }

  // Update progress for achievements
  updateProgress(userId: string, category: string, progress: number): void {
    const profile = this.getUserProfile(userId);

    this.achievements.forEach(achievement => {
      if (achievement.category === category) {
        const currentProgress = Math.min(achievement.currentProgress + progress, achievement.maxProgress);
        if (currentProgress !== achievement.currentProgress) {
          achievement.currentProgress = currentProgress;
          achievement.progressHistory.push({
            date: new Date(),
            progress: currentProgress,
            description: `Progress update: ${progress}`
          });

          if (currentProgress >= achievement.maxProgress && !profile.achievements.find(a => a.id === achievement.id)) {
            const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
            profile.achievements.push(unlockedAchievement);
            this.addXP(userId, achievement.xpReward);
            profile.totalPoints += achievement.points;
          }
        }
      }
    });

    this.userProfiles.set(userId, profile);
  }

  // Claim daily challenge reward
  claimDailyChallengeReward(userId: string, challengeId: string): boolean {
    const profile = this.getUserProfile(userId);
    const challenge = profile.dailyChallenges.find(c => c.id === challengeId);

    if (!challenge || !challenge.completed || challenge.claimed) {
      return false;
    }

    challenge.claimed = true;
    this.addXP(userId, challenge.xpReward);
    profile.totalPoints += challenge.pointsReward;

    this.userProfiles.set(userId, profile);
    return true;
  }
}

// Export singleton instance
export const gamificationEngine = new EnhancedGamificationEngine();
