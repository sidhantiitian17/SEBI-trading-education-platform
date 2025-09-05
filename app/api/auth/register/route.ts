import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RegisterForm, ApiResponse } from '@/lib/types';

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

export async function POST(request: NextRequest) {
  try {
    const body: RegisterForm = await request.json();

    // Check if user already exists
    const existingUser = users.find(u => u.email === body.email);
    if (existingUser) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'User with this email already exists',
      }, { status: 409 });
    }

    // Hash password (though not used in demo)
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      email: body.email,
      name: body.name,
      avatar: '',
      language: 'en',
      level: 'beginner',
      xp: 0,
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
        completedModules: [],
        currentModule: 'module-1',
        quizScores: [],
        learningStreak: 0,
        totalStudyTime: 0,
        certificates: [],
      },
      achievements: [],
      virtualPortfolio: {
        id: (users.length + 1).toString(),
        userId: (users.length + 1).toString(),
        cash: 1000000, // Starting with ₹10,00,000 virtual money
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
    };

    // Add user to database
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response: ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string; expiresIn: number; tokenType: string } }> = {
      success: true,
      data: {
        user: newUser,
        tokens: {
          accessToken: token,
          refreshToken: token, // In production, generate separate refresh token
          expiresIn: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
          tokenType: 'Bearer',
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
