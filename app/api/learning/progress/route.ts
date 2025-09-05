import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserProgress, ApiResponse } from '@/lib/types';

// Mock user progress storage
let userProgress: UserProgress[] = [
  {
    completedModules: ['module-1'],
    currentModule: 'module-2',
    quizScores: [],
    learningStreak: 3,
    totalStudyTime: 120,
    certificates: [],
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
    // Note: We'll allow unauthenticated access for demo purposes
    // if (!userId) {
    //   return NextResponse.json<ApiResponse<null>>({
    //     success: false,
    //     error: 'Unauthorized',
    //   }, { status: 401 });
    // }

    // For demo purposes, return the first progress entry
    // In a real app, you'd fetch by userId
    const progress = userProgress[0];

    const response: ApiResponse<UserProgress> = {
      success: true,
      data: progress,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const updates = await request.json();

    // For demo purposes, update the first progress entry
    // In a real app, you'd find and update by userId
    if (userProgress.length > 0) {
      userProgress[0] = { ...userProgress[0], ...updates };
    }

    const response: ApiResponse<UserProgress> = {
      success: true,
      data: userProgress[0],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { action, data } = await request.json();

    // For demo purposes, work with the first progress entry
    let progress = userProgress[0];

    switch (action) {
      case 'complete_module':
        if (!progress.completedModules.includes(data.moduleId)) {
          progress.completedModules.push(data.moduleId);
          // Update current module to next one
          const moduleOrder = ['module-1', 'module-2', 'module-3', 'module-4', 'module-5', 'module-6'];
          const currentIndex = moduleOrder.indexOf(data.moduleId);
          if (currentIndex < moduleOrder.length - 1) {
            progress.currentModule = moduleOrder[currentIndex + 1];
          }
        }
        break;

      case 'update_study_time':
        progress.totalStudyTime += data.minutes;
        break;

      case 'update_streak':
        progress.learningStreak = data.streak;
        break;

      default:
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Invalid action',
        }, { status: 400 });
    }

    const response: ApiResponse<UserProgress> = {
      success: true,
      data: progress,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Progress action error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
