import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User, ApiResponse } from '@/lib/types';

// Mock user database - In production, this would be a real database
let users: User[] = [
  {
    id: '1',
    email: 'demo@stocklearn.com',
    name: 'Demo User',
    avatar: '',
    language: 'en',
    level: 'beginner',
    xp: 150,
    createdAt: new Date(),
    lastLogin: new Date(),
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en',
      currency: 'INR',
      riskTolerance: 'moderate',
    },
    progress: {
      completedModules: ['module-1'],
      currentModule: 'module-2',
      quizScores: [],
      learningStreak: 3,
      totalStudyTime: 120,
      certificates: [],
    },
    achievements: [],
    virtualPortfolio: {
      id: '1',
      userId: '1',
      cash: 1000000,
      totalValue: 1000000,
      positions: [],
      orders: [],
      transactions: [],
      performance: {
        totalReturn: 0,
        totalReturnPercent: 0,
        dailyReturn: 0,
        dailyReturnPercent: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        benchmarkComparison: {
          benchmark: 'NIFTY_50',
          portfolioReturn: 0,
          benchmarkReturn: 0,
          alpha: 0,
          beta: 1,
        },
      },
      createdAt: new Date(),
    },
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserFromToken(request: NextRequest): User | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    return users.find(u => u.id === decoded.userId) || null;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const user = getUserFromToken(request);
    // For demo purposes, return a mock user profile if not authenticated
    const demoUser = user || {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: '',
      language: 'en',
      level: 'beginner',
      xp: 150,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
        currency: 'USD',
        riskTolerance: 'moderate',
      },
      progress: {
        completedModules: ['module-1'],
        currentModule: 'module-2',
        quizScores: [],
        learningStreak: 3,
        totalStudyTime: 120,
        certificates: [],
      },
      achievements: [],
      virtualPortfolio: {
        id: 'demo-portfolio',
        userId: 'demo-user-123',
        cash: 10000,
        totalValue: 10000,
        positions: [],
        orders: [],
        transactions: [],
        performance: {
          totalReturn: 0,
          totalReturnPercent: 0,
          dailyReturn: 0,
          dailyReturnPercent: 0,
          volatility: 0,
          sharpeRatio: 0,
          maxDrawdown: 0,
          benchmarkComparison: {
            benchmark: 'NIFTY_50',
            portfolioReturn: 0,
            benchmarkReturn: 0,
            outperformance: 0,
            alpha: 0,
            beta: 1,
          },
        },
        createdAt: new Date('2024-01-01'),
      },
    };

    const response: ApiResponse<User> = {
      success: true,
      data: demoUser,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const user = getUserFromToken(request);
    // For demo purposes, use the demo user if not authenticated
    const currentUser = user || users[0];

    const updates = await request.json();

    // Update user data (excluding sensitive fields)
    const allowedFields = [
      'name', 'avatar', 'language', 'preferences'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        (user as any)[field] = updates[field];
      }
    });

    const response: ApiResponse<User> = {
      success: true,
      data: currentUser,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
