import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Order, Transaction, VirtualPortfolio, ApiResponse } from '@/lib/types';

// Mock data
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

let orderCounter = 1;

// Mock current prices (in a real app, this would come from market data API)
const currentPrices: { [symbol: string]: number } = {
  'RELIANCE': 2456.75,
  'TCS': 3876.90,
  'HDFCBANK': 1689.25,
  'INFY': 1567.40,
  'ICICIBANK': 987.65,
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

    // For demo purposes, return orders from the first portfolio
    const portfolio = portfolios[0];
    const orders = portfolio.orders;

    const response: ApiResponse<Order[]> = {
      success: true,
      data: orders,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get orders error:', error);
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
    // Note: We'll allow unauthenticated access for demo purposes
    // if (!userId) {
    //   return NextResponse.json<ApiResponse<null>>({
    //     success: false,
    //     error: 'Unauthorized',
    //   }, { status: 401 });
    // }

    const { symbol, type, side, quantity, price } = await request.json();

    // For demo purposes, work with the first portfolio
    const portfolio = portfolios[0];

    // Validate order
    if (!currentPrices[symbol]) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid stock symbol',
      }, { status: 400 });
    }

    const orderPrice = price || currentPrices[symbol];
    const orderValue = orderPrice * quantity;

    // Check if user has enough cash for buy orders
    if (side === 'buy' && orderValue > portfolio.cash) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Insufficient funds',
      }, { status: 400 });
    }

    // Check if user has enough shares for sell orders
    if (side === 'sell') {
      const position = portfolio.positions.find(p => p.symbol === symbol);
      if (!position || position.quantity < quantity) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Insufficient shares',
        }, { status: 400 });
      }
    }

    // Create order
    const order: Order = {
      id: `order-${orderCounter++}`,
      symbol,
      type,
      side,
      quantity,
      price: orderPrice,
      status: 'executed', // For demo, orders execute immediately
      createdAt: new Date(),
      executedAt: new Date(),
    };

    // Execute order immediately (in a real app, this would be handled by order matching)
    const transaction: Transaction = {
      id: `txn-${orderCounter}`,
      orderId: order.id,
      symbol,
      side,
      quantity,
      price: orderPrice,
      totalValue: orderValue,
      fees: orderValue * 0.0005, // 0.05% brokerage
      timestamp: new Date(),
    };

    // Update portfolio
    if (side === 'buy') {
      portfolio.cash -= orderValue + transaction.fees;

      // Update or create position
      const existingPosition = portfolio.positions.find(p => p.symbol === symbol);
      if (existingPosition) {
        const totalQuantity = existingPosition.quantity + quantity;
        const totalCost = (existingPosition.averagePrice * existingPosition.quantity) + orderValue;
        existingPosition.averagePrice = totalCost / totalQuantity;
        existingPosition.quantity = totalQuantity;
        existingPosition.currentPrice = orderPrice;
        existingPosition.marketValue = totalQuantity * orderPrice;
        existingPosition.unrealizedPnL = existingPosition.marketValue - totalCost;
        existingPosition.unrealizedPnLPercent = (existingPosition.unrealizedPnL / totalCost) * 100;
      } else {
        portfolio.positions.push({
          symbol,
          quantity,
          averagePrice: orderPrice,
          currentPrice: orderPrice,
          marketValue: orderValue,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
        });
      }
    } else {
      portfolio.cash += orderValue - transaction.fees;

      // Update position
      const position = portfolio.positions.find(p => p.symbol === symbol);
      if (position) {
        const realizedPnL = (orderPrice - position.averagePrice) * quantity;
        position.quantity -= quantity;
        position.currentPrice = orderPrice;
        position.marketValue = position.quantity * orderPrice;

        if (position.quantity === 0) {
          // Remove position if fully sold
          portfolio.positions = portfolio.positions.filter(p => p.symbol !== symbol);
        } else {
          const remainingCost = position.averagePrice * position.quantity;
          position.unrealizedPnL = position.marketValue - remainingCost;
          position.unrealizedPnLPercent = (position.unrealizedPnL / remainingCost) * 100;
        }
      }
    }

    // Add order and transaction
    portfolio.orders.push(order);
    portfolio.transactions.push(transaction);

    // Update total value
    const positionsValue = portfolio.positions.reduce(
      (total, position) => total + position.marketValue,
      0
    );
    portfolio.totalValue = portfolio.cash + positionsValue;

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
