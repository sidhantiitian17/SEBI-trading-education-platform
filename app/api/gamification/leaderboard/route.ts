import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { LeaderboardEntry, ApiResponse } from '@/lib/types';

// Mock leaderboard data
let leaderboardData: LeaderboardEntry[] = [
  {
    userId: '1',
    userName: 'StockMaster2024',
    avatar: '/avatars/user1.jpg',
    score: 2250,
    level: 5,
    rank: 1,
    change: 0,
    achievements: 12,
  },
  {
    userId: '2',
    userName: 'TradePro',
    avatar: '/avatars/user2.jpg',
    score: 2100,
    level: 4,
    rank: 2,
    change: 1,
    achievements: 10,
  },
  {
    userId: '3',
    userName: 'MarketWizard',
    avatar: '/avatars/user3.jpg',
    score: 1950,
    level: 4,
    rank: 3,
    change: -1,
    achievements: 8,
  },
  {
    userId: '4',
    userName: 'BullBear',
    avatar: '/avatars/user4.jpg',
    score: 1800,
    level: 4,
    rank: 4,
    change: 2,
    achievements: 9,
  },
  {
    userId: '5',
    userName: 'CryptoKing',
    avatar: '/avatars/user5.jpg',
    score: 1650,
    level: 3,
    rank: 5,
    change: 0,
    achievements: 7,
  },
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overall'; // overall, weekly, monthly
    const limit = parseInt(searchParams.get('limit') || '10');

    // Sort leaderboard based on type
    let sortedLeaderboard = [...leaderboardData];

    switch (type) {
      case 'weekly':
        // For now, sort by score (could be enhanced with actual weekly data)
        sortedLeaderboard.sort((a, b) => b.score - a.score);
        break;
      case 'monthly':
        // For now, sort by score (could be enhanced with actual monthly data)
        sortedLeaderboard.sort((a, b) => b.score - a.score);
        break;
      default: // overall
        sortedLeaderboard.sort((a, b) => b.score - a.score);
    }

    // Update ranks
    sortedLeaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Limit results
    const limitedLeaderboard = sortedLeaderboard.slice(0, limit);

    // Find current user's position
    const currentUserEntry = sortedLeaderboard.find(entry => entry.userId === userId);
    const currentUserRank = currentUserEntry ? currentUserEntry.rank : null;

    const response: ApiResponse<{
      leaderboard: LeaderboardEntry[];
      currentUserRank: number | null;
      totalUsers: number;
      type: string;
    }> = {
      success: true,
      data: {
        leaderboard: limitedLeaderboard,
        currentUserRank,
        totalUsers: leaderboardData.length,
        type,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// Update leaderboard (admin function or automated)
export async function POST(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // For demo purposes, use a default user ID if not authenticated
    const demoUserId = userId || 'demo-user-123';

    const { userId: targetUserId, score, achievements, streak } = await request.json();

    if (!targetUserId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Missing target user ID',
      }, { status: 400 });
    }

    // Find or create entry
    let entry = leaderboardData.find(e => e.userId === targetUserId);
    if (!entry) {
      entry = {
        userId: targetUserId,
        userName: `User${targetUserId}`,
        avatar: `/avatars/user${targetUserId}.jpg`,
        score: 0,
        level: 1,
        rank: leaderboardData.length + 1,
        change: 0,
        achievements: 0,
      };
      leaderboardData.push(entry);
    }

    // Update entry
    if (score !== undefined) entry.score = score;
    if (achievements !== undefined) entry.achievements = achievements;

    // Recalculate level (simple calculation)
    entry.level = Math.floor(entry.score / 500) + 1;

    // Sort and update ranks
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData.forEach((e, index) => {
      e.rank = index + 1;
    });

    const response: ApiResponse<LeaderboardEntry> = {
      success: true,
      data: entry,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update leaderboard error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
