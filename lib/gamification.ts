export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  xpReward: number
  category: "learning" | "trading" | "social" | "consistency"
  requirements: {
    type: "lessons_completed" | "quiz_score" | "trades_made" | "streak_days" | "xp_earned" | "modules_finished"
    target: number
    current?: number
  }
  earned: boolean
  earnedAt?: Date
}

export interface UserLevel {
  level: number
  currentXP: number
  xpToNext: number
  totalXP: number
  title: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  xp: number
  level: number
  rank: number
  weeklyXP: number
}

export interface Streak {
  current: number
  longest: number
  lastActivity: Date
  multiplier: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly"
  xpReward: number
  progress: number
  target: number
  expiresAt: Date
  completed: boolean
}

export const levelTitles = [
  "Market Novice",
  "Stock Explorer",
  "Trading Apprentice",
  "Market Analyst",
  "Portfolio Builder",
  "Risk Manager",
  "Trading Strategist",
  "Market Expert",
  "Investment Guru",
  "Financial Master",
]

export const calculateLevel = (totalXP: number): UserLevel => {
  const baseXP = 100
  const multiplier = 1.5

  let level = 1
  let xpRequired = baseXP
  let totalRequired = 0

  while (totalXP >= totalRequired + xpRequired) {
    totalRequired += xpRequired
    level++
    xpRequired = Math.floor(baseXP * Math.pow(multiplier, level - 1))
  }

  const currentXP = totalXP - totalRequired
  const xpToNext = xpRequired - currentXP

  return {
    level,
    currentXP,
    xpToNext,
    totalXP,
    title: levelTitles[Math.min(level - 1, levelTitles.length - 1)],
  }
}

export const achievements: Achievement[] = [
  // Learning Achievements
  {
    id: "first_lesson",
    name: "First Steps",
    description: "Complete your first tutorial lesson",
    icon: "🎯",
    rarity: "common",
    xpReward: 50,
    category: "learning",
    requirements: { type: "lessons_completed", target: 1, current: 1 },
    earned: true,
    earnedAt: new Date("2024-01-15"),
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Complete 10 tutorial lessons",
    icon: "📚",
    rarity: "rare",
    xpReward: 200,
    category: "learning",
    requirements: { type: "lessons_completed", target: 10, current: 7 },
    earned: false,
  },
  {
    id: "master_student",
    name: "Master Student",
    description: "Complete all tutorial modules",
    icon: "🎓",
    rarity: "epic",
    xpReward: 500,
    category: "learning",
    requirements: { type: "modules_finished", target: 4, current: 2 },
    earned: false,
  },

  // Quiz Achievements
  {
    id: "quiz_starter",
    name: "Quiz Master",
    description: "Score 90% or higher on 5 quizzes",
    icon: "🧠",
    rarity: "rare",
    xpReward: 150,
    category: "learning",
    requirements: { type: "quiz_score", target: 5, current: 3 },
    earned: false,
  },
  {
    id: "perfect_score",
    name: "Perfectionist",
    description: "Get 100% on any quiz",
    icon: "💯",
    rarity: "epic",
    xpReward: 300,
    category: "learning",
    requirements: { type: "quiz_score", target: 1, current: 0 },
    earned: false,
  },

  // Trading Achievements
  {
    id: "first_trade",
    name: "Paper Trader",
    description: "Make your first virtual trade",
    icon: "📈",
    rarity: "common",
    xpReward: 75,
    category: "trading",
    requirements: { type: "trades_made", target: 1, current: 0 },
    earned: false,
  },
  {
    id: "active_trader",
    name: "Active Trader",
    description: "Execute 50 trades",
    icon: "⚡",
    rarity: "rare",
    xpReward: 250,
    category: "trading",
    requirements: { type: "trades_made", target: 50, current: 0 },
    earned: false,
  },
  {
    id: "profit_maker",
    name: "Profit Maker",
    description: "Achieve 10% portfolio growth",
    icon: "💰",
    rarity: "epic",
    xpReward: 400,
    category: "trading",
    requirements: { type: "trades_made", target: 1, current: 0 },
    earned: false,
  },

  // Consistency Achievements
  {
    id: "consistent_learner",
    name: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    rarity: "rare",
    xpReward: 200,
    category: "consistency",
    requirements: { type: "streak_days", target: 7, current: 3 },
    earned: false,
  },
  {
    id: "dedication_master",
    name: "Dedication Master",
    description: "Maintain a 30-day learning streak",
    icon: "👑",
    rarity: "legendary",
    xpReward: 1000,
    category: "consistency",
    requirements: { type: "streak_days", target: 30, current: 3 },
    earned: false,
  },
]

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Arjun Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    xp: 2450,
    level: 8,
    rank: 1,
    weeklyXP: 320,
  },
  {
    id: "2",
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    xp: 2380,
    level: 8,
    rank: 2,
    weeklyXP: 280,
  },
  {
    id: "3",
    name: "Rahul Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    xp: 2200,
    level: 7,
    rank: 3,
    weeklyXP: 250,
  },
  {
    id: "4",
    name: "Sneha Gupta",
    avatar: "/placeholder.svg?height=40&width=40",
    xp: 2100,
    level: 7,
    rank: 4,
    weeklyXP: 220,
  },
  {
    id: "5",
    name: "Vikram Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    xp: 1950,
    level: 7,
    rank: 5,
    weeklyXP: 200,
  },
  {
    id: "6",
    name: "Anita Reddy",
    avatar: "/placeholder.svg?height=40&width=40",
    xp: 1850,
    level: 6,
    rank: 6,
    weeklyXP: 180,
  },
  {
    id: "7",
    name: "Karan Mehta",
    avatar: "/placeholder.svg?height=40&width=40",
    xp: 1750,
    level: 6,
    rank: 7,
    weeklyXP: 160,
  },
  { id: "8", name: "You", avatar: "/placeholder.svg?height=40&width=40", xp: 1650, level: 6, rank: 8, weeklyXP: 140 },
]

export const mockChallenges: Challenge[] = [
  {
    id: "daily_lesson",
    title: "Daily Learning",
    description: "Complete 1 lesson today",
    type: "daily",
    xpReward: 50,
    progress: 0,
    target: 1,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: "weekly_quiz",
    title: "Quiz Champion",
    description: "Complete 3 quizzes this week",
    type: "weekly",
    xpReward: 200,
    progress: 1,
    target: 3,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: "trading_practice",
    title: "Trading Practice",
    description: "Execute 5 trades this week",
    type: "weekly",
    xpReward: 150,
    progress: 2,
    target: 5,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
  },
]
