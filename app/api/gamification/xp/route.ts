import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { XPEvent, ApiResponse, GamificationStats } from '@/lib/types';

// Mock XP events data
let xpEvents: XPEvent[] = [
  {
    id: 'xp-1',
    userId: '1',
    type: 'daily_login',
    amount: 50,
    description: 'Daily login bonus',
    metadata: {},
    timestamp: new Date('2024-01-01'),
  },
  {
    id: 'xp-2',
    userId: '1',
    type: 'module_completed',
    amount: 100,
    description: 'Completed "Introduction to Stock Market" module',
    metadata: { moduleId: 'intro-stocks' },
    timestamp: new Date('2024-01-02'),
  },
  {
    id: 'xp-3',
    userId: '1',
    type: 'quiz_passed',
    amount: 75,
    description: 'Passed "Basic Stock Concepts" quiz',
    metadata: { quizId: 'basic-concepts', score: 85 },
    timestamp: new Date('2024-01-02'),
  },
];

// Mock user stats
const userStats: GamificationStats = {
  totalXP: 225,
  currentLevel: 2,
  xpToNextLevel: 75,
  levelProgress: 75,
  totalAchievements: 6,
  unlockedAchievements: 2,
  currentStreak: 3,
  longestStreak: 7,
  totalStudyTime: 480, // minutes
  totalTrades: 0,
  winRate: 0,
  leaderboardRank: 15,
  weeklyXP: 225,
  monthlyXP: 225,
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserFromToken(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Calculate level from XP
function calculateLevel(xp: number): { level: number; xpForNext: number; progress: number } {
  let level = 1;
  let xpRequired = 100;

  while (xp >= xpRequired) {
    xp -= xpRequired;
    level++;
    xpRequired = level * 100; // Each level requires more XP
  }

  const progress = (xp / xpRequired) * 100;
  return { level, xpForNext: xpRequired - xp, progress };
}

export async function GET(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // For demo purposes, use a default user ID if not authenticated
    const demoUserId = userId || 'demo-user-123';

    // Calculate current stats
    const totalXP = xpEvents.reduce((sum, event) => sum + event.amount, 0);
    const levelInfo = calculateLevel(totalXP);

    const currentStats: GamificationStats = {
      ...userStats,
      totalXP,
      currentLevel: levelInfo.level,
      xpToNextLevel: levelInfo.xpForNext,
      levelProgress: levelInfo.progress,
    };

    const response: ApiResponse<GamificationStats> = {
      success: true,
      data: currentStats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get XP stats error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // For demo purposes, use a default user ID if not authenticated
    const demoUserId = userId || 'demo-user-123';

    const { type, amount, description, metadata } = await request.json();

    if (!type || !amount || !description) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Missing required fields: type, amount, description',
      }, { status: 400 });
    }

    // Create new XP event
    const newEvent: XPEvent = {
      id: `xp-${Date.now()}`,
      userId: demoUserId,
      type,
      amount,
      description,
      metadata: metadata || {},
      timestamp: new Date(),
    };

    // Add to events
    xpEvents.push(newEvent);

    // Update user stats
    userStats.totalXP += amount;
    const levelInfo = calculateLevel(userStats.totalXP);
    userStats.currentLevel = levelInfo.level;
    userStats.xpToNextLevel = levelInfo.xpForNext;
    userStats.levelProgress = levelInfo.progress;

    // Check for level up
    if (levelInfo.level > userStats.currentLevel) {
      // Create level up XP event
      const levelUpEvent: XPEvent = {
        id: `xp-levelup-${Date.now()}`,
        userId: demoUserId,
        type: 'level_up',
        amount: levelInfo.level * 50, // Bonus XP for leveling up
        description: `Reached level ${levelInfo.level}!`,
        metadata: { newLevel: levelInfo.level },
        timestamp: new Date(),
      };
      xpEvents.push(levelUpEvent);
      userStats.totalXP += levelUpEvent.amount;
    }

    const response: ApiResponse<XPEvent> = {
      success: true,
      data: newEvent,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Add XP error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
