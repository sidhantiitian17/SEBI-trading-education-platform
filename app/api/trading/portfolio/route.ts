import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { VirtualPortfolio, ApiResponse } from '@/lib/types';

// Mock portfolio data
let portfolios: VirtualPortfolio[] = [
  {
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
    // Enhanced cache headers for better performance
    const headers = new Headers({
      'Cache-Control': 'public, max-age=45, stale-while-revalidate=90',
      'CDN-Cache-Control': 'public, max-age=45',
      'Content-Type': 'application/json',
      'Vary': 'Authorization',
    });

    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // Note: We'll allow unauthenticated access for demo purposes
    // if (!userId) {
    //   return NextResponse.json<ApiResponse<null>>({
    //     success: false,
    //     error: 'Unauthorized',
    //   }, { status: 401, headers });
    // }

    // For demo purposes, return the first portfolio
    // In a real app, you'd fetch by userId
    const portfolio = portfolios[0];

    // Add mock positions if empty for better demo experience
    if (portfolio.positions.length === 0) {
      portfolio.positions = [
        {
          symbol: 'RELIANCE',
          quantity: 100,
          averagePrice: 2500,
          currentPrice: 2550,
          marketValue: 255000,
          unrealizedPnL: 5000,
          unrealizedPnLPercent: 2.0,
        },
        {
          symbol: 'TCS',
          quantity: 50,
          averagePrice: 3800,
          currentPrice: 3900,
          marketValue: 195000,
          unrealizedPnL: 5000,
          unrealizedPnLPercent: 2.6,
        },
        {
          symbol: 'HDFC',
          quantity: 75,
          averagePrice: 2800,
          currentPrice: 2750,
          marketValue: 206250,
          unrealizedPnL: -3750,
          unrealizedPnLPercent: -1.8,
        },
      ];
    }

    // Calculate current total value (cash + positions) - optimized calculation
    const positionsValue = portfolio.positions.length > 0 
      ? portfolio.positions.reduce((total, position) => total + position.marketValue, 0)
      : 0;
    
    portfolio.totalValue = portfolio.cash + positionsValue;

    // Update performance metrics
    const totalUnrealizedPnL = portfolio.positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
    portfolio.performance.totalReturn = totalUnrealizedPnL;
    portfolio.performance.totalReturnPercent = positionsValue > 0 
      ? (totalUnrealizedPnL / (positionsValue - totalUnrealizedPnL)) * 100 
      : 0;

    const response: ApiResponse<VirtualPortfolio> = {
      success: true,
      data: portfolio,
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Get portfolio error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      }
    });
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

    // For demo purposes, update the first portfolio
    if (portfolios.length > 0) {
      portfolios[0] = { ...portfolios[0], ...updates };
    }

    const response: ApiResponse<VirtualPortfolio> = {
      success: true,
      data: portfolios[0],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update portfolio error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
