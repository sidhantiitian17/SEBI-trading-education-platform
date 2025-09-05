/**
 * Enhanced Gamification System
 * Dynamic achievements, leaderboards, and progress tracking
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'trading' | 'social' | 'streak' | 'special';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  xpReward: number;
  requirements: AchievementRequirement[];
  isHidden: boolean;
  isRepeatable: boolean;
  maxProgress: number;
  currentProgress: number;
  unlockedAt?: Date;
  progressHistory: AchievementProgress[];
}

export interface AchievementRequirement {
  type: 'module_complete' | 'quiz_score' | 'trading_profit' | 'streak_days' | 'social_interaction' | 'time_spent' | 'strategy_created';
  target: number;
  current: number;
  description: string;
}

export interface AchievementProgress {
  date: Date;
  progress: number;
  description: string;
}

export interface UserGamification {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalPoints: number;
  achievements: Achievement[];
  streaks: UserStreak[];
  dailyChallenges: DailyChallenge[];
  weeklyGoals: WeeklyGoal[];
  leaderboardPosition: number;
  rank: UserRank;
  stats: GamificationStats;
}

export interface UserStreak {
  type: 'login' | 'learning' | 'trading' | 'quiz';
  current: number;
  longest: number;
  lastUpdated: Date;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'learning' | 'trading' | 'social';
  target: number;
  current: number;
  xpReward: number;
  pointsReward: number;
  deadline: Date;
  completed: boolean;
  claimed: boolean;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'trading' | 'social';
  target: number;
  current: number;
  xpReward: number;
  bonusMultiplier: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

export interface UserRank {
  name: string;
  level: number;
  icon: string;
  color: string;
  requirements: {
    minLevel: number;
    minXP: number;
    achievementsRequired: number;
  };
}

export interface GamificationStats {
  totalModulesCompleted: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  totalTradingVolume: number;
  totalTradingProfit: number;
  winRate: number;
  longestLearningStreak: number;
  totalTimeSpent: number;
  socialInteractions: number;
  strategiesCreated: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  rank: UserRank;
  level: number;
  xp: number;
  points: number;
  achievementsCount: number;
  change: number; // Position change from last period
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  category: 'overall' | 'learning' | 'trading' | 'social';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface GamificationEvent {
  type: 'achievement_unlocked' | 'level_up' | 'streak_maintained' | 'challenge_completed' | 'goal_achieved';
  userId: string;
  data: any;
  timestamp: Date;
  points?: number;
  xp?: number;
}

export interface NotificationReward {
  id: string;
  type: 'achievement' | 'level_up' | 'streak' | 'challenge' | 'bonus';
  title: string;
  description: string;
  icon: string;
  xpReward?: number;
  pointsReward?: number;
  badge?: string;
  timestamp: Date;
  claimed: boolean;
}

export interface AchievementNotification {
  id: string;
  achievement: Achievement;
  timestamp: Date;
  isNew: boolean;
}
