import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Achievement, ApiResponse } from '@/lib/types';

// Mock achievements data
const achievements: Achievement[] = [
  {
    id: 'first-login',
    title: 'Welcome to StockEdu!',
    description: 'Complete your first login',
    icon: '🎯',
    category: 'milestone',
    rarity: 'common',
    xpReward: 50,
    requirements: [
      {
        type: 'level_reached',
        target: 1,
        current: 1,
        description: 'Reach level 1'
      }
    ],
    unlockedAt: new Date('2024-01-01'),
    progress: 100
  },
  {
    id: 'first-module',
    title: 'Learning Journey Begins',
    description: 'Complete your first learning module',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    xpReward: 100,
    requirements: [
      {
        type: 'module_complete',
        target: 1,
        current: 1,
        description: 'Complete 1 module'
      }
    ],
    unlockedAt: new Date('2024-01-02'),
    progress: 100
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Score 100% on any quiz',
    icon: '🧠',
    category: 'learning',
    rarity: 'rare',
    xpReward: 200,
    requirements: [
      {
        type: 'quiz_score',
        target: 100,
        current: 95,
        description: 'Score 100% on a quiz'
      }
    ],
    progress: 95
  },
  {
    id: 'trading-novice',
    title: 'Trading Novice',
    description: 'Execute your first trade',
    icon: '📈',
    category: 'trading',
    rarity: 'common',
    xpReward: 150,
    requirements: [
      {
        type: 'trading_volume',
        target: 1,
        current: 0,
        description: 'Execute 1 trade'
      }
    ],
    progress: 0
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'consistency',
    rarity: 'uncommon',
    xpReward: 300,
    requirements: [
      {
        type: 'streak_days',
        target: 7,
        current: 3,
        description: '7-day learning streak'
      }
    ],
    progress: 43
  },
  {
    id: 'portfolio-100k',
    title: 'Wealth Builder',
    description: 'Grow your virtual portfolio to ₹100,000',
    icon: '💰',
    category: 'trading',
    rarity: 'epic',
    xpReward: 500,
    requirements: [
      {
        type: 'xp_earned',
        target: 100000,
        current: 25000,
        description: 'Portfolio value reaches ₹100,000'
      }
    ],
    progress: 25
  }
];

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

export async function GET(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // For demo purposes, use a default user ID if not authenticated
    const demoUserId = userId || 'demo-user-123';

    // For demo purposes, return all achievements
    // In a real app, you'd filter by user and check unlock status
    const response: ApiResponse<Achievement[]> = {
      success: true,
      data: achievements,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get achievements error:', error);
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

    const { achievementId } = await request.json();

    // Find the achievement
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Achievement not found',
      }, { status: 404 });
    }

    // Check if achievement is already unlocked
    if (achievement.unlockedAt) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Achievement already unlocked',
      }, { status: 400 });
    }

    // Unlock the achievement
    achievement.unlockedAt = new Date();
    achievement.progress = 100;

    const response: ApiResponse<Achievement> = {
      success: true,
      data: achievement,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unlock achievement error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
