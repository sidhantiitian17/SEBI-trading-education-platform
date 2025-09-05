import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DailyChallenge, ApiResponse } from '@/lib/types';

// Mock daily challenges data
let dailyChallenges: DailyChallenge[] = [
  {
    id: 'daily-1',
    title: 'Complete 3 Modules',
    description: 'Finish any 3 learning modules today',
    type: 'complete_modules',
    target: 3,
    xpReward: 150,
    bonusReward: {
      type: 'extra_xp',
      value: 50,
      description: 'Bonus XP for completing daily learning goal',
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    isCompleted: false,
    progress: 0,
  },
  {
    id: 'daily-2',
    title: 'Score 80% on Quiz',
    description: 'Get at least 80% on any quiz',
    type: 'pass_quizzes',
    target: 80,
    xpReward: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    progress: 0,
  },
  {
    id: 'daily-3',
    title: 'Watch 30 Minutes of Content',
    description: 'Spend at least 30 minutes learning',
    type: 'earn_xp',
    target: 30,
    xpReward: 75,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    progress: 0,
  },
];

// User progress is stored directly in the challenge objects
// We'll use a simple approach where each user has their own copy of challenges

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

    // Get today's challenges
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysChallenges = dailyChallenges.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      startDate.setHours(0, 0, 0, 0);
      return startDate.getTime() === today.getTime();
    });

    const response: ApiResponse<{
      challenges: DailyChallenge[];
      totalCompleted: number;
      totalXP: number;
    }> = {
      success: true,
      data: {
        challenges: todaysChallenges,
        totalCompleted: todaysChallenges.filter(c => c.isCompleted).length,
        totalXP: todaysChallenges
          .filter(c => c.isCompleted)
          .reduce((sum, c) => sum + c.xpReward, 0),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get daily challenges error:', error);
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

    const { challengeId, progress } = await request.json();

    if (!challengeId || progress === undefined) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Missing required fields: challengeId, progress',
      }, { status: 400 });
    }

    // Find the challenge
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Challenge not found',
      }, { status: 404 });
    }

    // Update progress
    challenge.progress = Math.min(progress, challenge.target);

    // Check if completed
    if (challenge.progress >= challenge.target && !challenge.isCompleted) {
      challenge.isCompleted = true;
    }

    const response: ApiResponse<DailyChallenge> = {
      success: true,
      data: challenge,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update challenge progress error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
