// Core User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  language: string;
  level: UserLevel;
  xp: number;
  createdAt: Date;
  lastLogin: Date;
  preferences: UserPreferences;
  progress: UserProgress;
  achievements: Achievement[];
  virtualPortfolio: VirtualPortfolio;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  currency: string;
  riskTolerance: RiskTolerance;
}

export interface UserProgress {
  completedModules: string[];
  currentModule: string;
  quizScores: QuizScore[];
  learningStreak: number;
  totalStudyTime: number;
  certificates: Certificate[];
}

export type UserLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';

// Learning Management System Types
export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quiz: Quiz;
  prerequisites: string[];
  estimatedTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: ModuleCategory;
}

export interface Lesson {
  id: string;
  title: string;
  content: LessonContent;
  type: 'video' | 'text' | 'interactive' | 'simulation';
  duration: number;
  resources: Resource[];
  completed: boolean;
}

export interface LessonContent {
  videoUrl?: string;
  textContent?: string;
  interactiveElements?: InteractiveElement[];
  simulationData?: any;
}

export interface InteractiveElement {
  type: 'drag-drop' | 'multiple-choice' | 'scenario' | 'chart-analysis' | 'simulation' | 'latency-simulator' | 'strategy-simulator' | 'risk-simulator' | 'system-builder' | 'ml-simulator' | 'backtest-engine' | 'live-simulator' | 'deployment-checklist';
  data: any;
  instructions: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'scenario' | 'multiple-select';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | boolean;
  correctAnswers?: number[];
  explanation: string;
  points: number;
}

export interface QuizScore {
  quizId: string;
  userId: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  completedAt: Date;
  attempts: number;
}

export type ModuleCategory =
  | 'fundamentals'
  | 'risk-management'
  | 'technical-analysis'
  | 'fundamental-analysis'
  | 'algorithmic-trading'
  | 'portfolio-management'
  | 'hft-trading';

// Virtual Trading Types
export interface VirtualPortfolio {
  id: string;
  userId: string;
  cash: number;
  totalValue: number;
  positions: Position[];
  orders: Order[];
  transactions: Transaction[];
  performance: PortfolioPerformance;
  createdAt: Date;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop-loss' | 'bracket';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  targetPrice?: number;
  status: 'pending' | 'executed' | 'cancelled' | 'rejected';
  createdAt: Date;
  executedAt?: Date;
}

export interface Transaction {
  id: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalValue: number;
  fees: number;
  timestamp: Date;
}

export interface PortfolioPerformance {
  totalReturn: number;
  totalReturnPercent: number;
  dailyReturn: number;
  dailyReturnPercent: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  benchmarkComparison: BenchmarkComparison;
}

export interface BenchmarkComparison {
  benchmark: string; // e.g., 'NIFTY_50'
  portfolioReturn: number;
  benchmarkReturn: number;
  alpha: number;
  beta: number;
}

// Market Data Types
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  pb: number;
  dividendYield: number;
  sector: string;
  lastUpdated: Date;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  constituents: string[];
  lastUpdated: Date;
}

export interface MarketNews {
  id: string;
  title: string;
  content: string;
  source: string;
  symbols: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  publishedAt: Date;
  impact: 'high' | 'medium' | 'low';
}

// Gamification Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  requirements: AchievementRequirement[];
  unlockedAt?: Date;
  progress: number; // 0-100
}

export interface AchievementRequirement {
  type: 'module_complete' | 'quiz_score' | 'trading_volume' | 'streak_days' | 'xp_earned' | 'level_reached';
  target: number;
  current: number;
  description: string;
}

export type AchievementCategory =
  | 'learning'
  | 'trading'
  | 'social'
  | 'consistency'
  | 'milestone'
  | 'special';

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface XPEvent {
  id: string;
  userId: string;
  type: XPEventType;
  amount: number;
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export type XPEventType =
  | 'module_completed'
  | 'quiz_passed'
  | 'quiz_perfect_score'
  | 'trading_order_executed'
  | 'daily_login'
  | 'learning_streak'
  | 'achievement_unlocked'
  | 'level_up'
  | 'referral_bonus'
  | 'social_share';

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
  description: string;
  rewards: LevelReward[];
}

export interface LevelReward {
  type: 'badge' | 'title' | 'feature_unlock' | 'bonus_xp';
  value: string | number;
  description: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  rank: number;
  change?: number; // rank change from previous period
  level: number;
  achievements: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export type LeaderboardType =
  | 'xp_total'
  | 'xp_weekly'
  | 'xp_monthly'
  | 'learning_streak'
  | 'trading_performance'
  | 'quiz_scores'
  | 'achievements_count';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  target: number;
  xpReward: number;
  bonusReward?: ChallengeBonus;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  progress: number;
}

export type ChallengeType =
  | 'complete_modules'
  | 'pass_quizzes'
  | 'execute_trades'
  | 'maintain_streak'
  | 'earn_xp'
  | 'social_engagement';

export interface ChallengeBonus {
  type: 'multiplier' | 'extra_xp' | 'achievement_unlock';
  value: number;
  description: string;
}

export interface GamificationStats {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  levelProgress: number; // 0-100
  totalAchievements: number;
  unlockedAchievements: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number;
  totalTrades: number;
  winRate: number;
  leaderboardRank: number;
  weeklyXP: number;
  monthlyXP: number;
}

// Social Learning Types
export interface DiscussionForum {
  id: string;
  title: string;
  description: string;
  category: ForumCategory;
  posts: ForumPost[];
  moderators: string[];
  createdAt: Date;
  isActive: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  replies: ForumReply[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isLocked: boolean;
}

export interface ForumReply {
  id: string;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  parentReplyId?: string;
}

export type ForumCategory =
  | 'general'
  | 'technical-analysis'
  | 'fundamental-analysis'
  | 'trading-strategies'
  | 'market-news'
  | 'study-groups';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: StudyGroupMember[];
  schedule: StudySession[];
  goals: string[];
  createdBy: string;
  createdAt: Date;
  isPrivate: boolean;
}

export interface StudyGroupMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  contribution: number;
}

export interface StudySession {
  id: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number;
  attendees: string[];
  materials: Resource[];
  recording?: string;
}

// Translation & Content Types
export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  contentType: ContentType;
  contentId: string;
  quality: number; // 1-5 rating
  createdAt: Date;
  updatedAt: Date;
}

export type ContentType =
  | 'lesson'
  | 'quiz'
  | 'news'
  | 'forum-post'
  | 'achievement'
  | 'notification';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isActive: boolean;
  speakers: number;
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  sessionData: SessionData[];
  learningMetrics: LearningMetrics;
  tradingMetrics: TradingMetrics;
  engagementMetrics: EngagementMetrics;
  lastUpdated: Date;
}

export interface SessionData {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  pagesVisited: string[];
  actions: UserAction[];
}

export interface UserAction {
  type: string;
  timestamp: Date;
  data: any;
}

export interface LearningMetrics {
  totalStudyTime: number;
  modulesCompleted: number;
  averageQuizScore: number;
  learningStreak: number;
  weakTopics: string[];
  strongTopics: string[];
  progressRate: number;
}

export interface TradingMetrics {
  totalTrades: number;
  winRate: number;
  averageReturn: number;
  maxDrawdown: number;
  riskAdjustedReturn: number;
  favoriteStrategies: string[];
}

export interface EngagementMetrics {
  dailyActiveDays: number;
  weeklyActiveWeeks: number;
  monthlyActiveMonths: number;
  featureUsage: FeatureUsage[];
  retentionRate: number;
}

export interface FeatureUsage {
  feature: string;
  usageCount: number;
  lastUsed: Date;
  averageSessionTime: number;
}

// Utility Types
export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'image' | 'document';
  url: string;
  size?: number;
  duration?: number;
  language: string;
  tags: string[];
}

export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  title: string;
  description: string;
  issuedAt: Date;
  expiryDate?: Date;
  verificationCode: string;
  qrCode: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType =
  | 'achievement'
  | 'module_completed'
  | 'quiz_reminder'
  | 'market_news'
  | 'social'
  | 'system'
  | 'trading_alert';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  language: string;
  agreeToTerms: boolean;
}

export interface ProfileUpdateForm {
  name: string;
  avatar?: File;
  language: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  riskTolerance: RiskTolerance;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export type ErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_INSUFFICIENT_PERMISSIONS'
  | 'USER_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'RATE_LIMIT_EXCEEDED';
