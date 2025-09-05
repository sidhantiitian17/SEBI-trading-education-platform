import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { StockData, MarketIndex, ApiResponse } from '@/lib/types';

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Indian stock symbols mapping to global equivalents for demo
const INDIAN_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', globalSymbol: 'RELIANCE.BSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', globalSymbol: 'TCS.BSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', globalSymbol: 'HDFCBANK.BSE' },
  { symbol: 'INFY', name: 'Infosys Ltd', globalSymbol: 'INFY.BSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', globalSymbol: 'ICICIBANK.BSE' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', globalSymbol: 'BAJFINANCE.BSE' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', globalSymbol: 'HINDUNILVR.BSE' },
  { symbol: 'ITC', name: 'ITC Ltd', globalSymbol: 'ITC.BSE' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', globalSymbol: 'KOTAKBANK.BSE' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', globalSymbol: 'LT.BSE' },
];

// Fallback mock data for when API is unavailable
const fallbackStockData: StockData[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    price: 2456.75,
    change: 23.45,
    changePercent: 0.96,
    volume: 2456789,
    marketCap: 1800000,
    pe: 28.5,
    pb: 3.2,
    dividendYield: 0.35,
    sector: 'Energy',
    lastUpdated: new Date(),
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    price: 3876.90,
    change: -12.30,
    changePercent: -0.32,
    volume: 1234567,
    marketCap: 1400000,
    pe: 32.1,
    pb: 12.8,
    dividendYield: 1.2,
    sector: 'Technology',
    lastUpdated: new Date(),
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    price: 1689.25,
    change: 15.80,
    changePercent: 0.94,
    volume: 3456789,
    marketCap: 1200000,
    pe: 18.7,
    pb: 2.9,
    dividendYield: 1.1,
    sector: 'Banking',
    lastUpdated: new Date(),
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    price: 1567.40,
    change: 8.95,
    changePercent: 0.57,
    volume: 987654,
    marketCap: 650000,
    pe: 25.3,
    pb: 7.8,
    dividendYield: 2.1,
    sector: 'Technology',
    lastUpdated: new Date(),
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    price: 987.65,
    change: -5.20,
    changePercent: -0.52,
    volume: 4567890,
    marketCap: 700000,
    pe: 16.2,
    pb: 2.1,
    dividendYield: 0.8,
    sector: 'Banking',
    lastUpdated: new Date(),
  },
];

const mockMarketIndices: MarketIndex[] = [
  {
    name: 'NIFTY_50',
    value: 19567.85,
    change: 123.45,
    changePercent: 0.63,
    constituents: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
    lastUpdated: new Date(),
  },
  {
    name: 'SENSEX',
    value: 65234.56,
    change: 456.78,
    changePercent: 0.71,
    constituents: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
    lastUpdated: new Date(),
  },
  {
    name: 'BANKNIFTY',
    value: 45678.90,
    change: -89.12,
    changePercent: -0.19,
    constituents: ['HDFCBANK', 'ICICIBANK', 'KOTAKBANK'],
    lastUpdated: new Date(),
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

// Fetch real-time delayed data from Alpha Vantage
async function fetchStockData(symbol: string): Promise<StockData | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes (delayed data)
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const quote = data['Global Quote'];
      const price = parseFloat(quote['05. price']);
      const previousClose = parseFloat(quote['08. previous close']);
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;

      // Find Indian stock info
      const stockInfo = INDIAN_STOCKS.find(s => s.globalSymbol === symbol) ||
                       INDIAN_STOCKS.find(s => s.symbol === symbol);

      return {
        symbol: stockInfo?.symbol || symbol,
        name: stockInfo?.name || symbol,
        price: price,
        change: change,
        changePercent: changePercent,
        volume: parseInt(quote['06. volume']) || 0,
        marketCap: 0, // Not available in free API
        pe: 0, // Not available in free API
        pb: 0, // Not available in free API
        dividendYield: 0, // Not available in free API
        sector: stockInfo ? getSectorFromSymbol(stockInfo.symbol) : 'Unknown',
        lastUpdated: new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

// Get sector based on stock symbol
function getSectorFromSymbol(symbol: string): string {
  const sectorMap: { [key: string]: string } = {
    'RELIANCE': 'Energy',
    'TCS': 'Technology',
    'HDFCBANK': 'Banking',
    'INFY': 'Technology',
    'ICICIBANK': 'Banking',
    'BAJFINANCE': 'Financial Services',
    'HINDUNILVR': 'Consumer Goods',
    'ITC': 'Consumer Goods',
    'KOTAKBANK': 'Banking',
    'LT': 'Construction',
  };
  return sectorMap[symbol] || 'Unknown';
}

// Fetch all stock data with fallback to mock data
async function fetchAllStockData(): Promise<StockData[]> {
  const realDataPromises = INDIAN_STOCKS.map(stock => fetchStockData(stock.globalSymbol));
  const realDataResults = await Promise.all(realDataPromises);

  const realData = realDataResults.filter((data): data is StockData => data !== null);

  // If we have at least some real data, use it; otherwise fall back to mock data
  if (realData.length > 0) {
    // Add some mock data for stocks not available in free API
    const mockData = fallbackStockData.filter(stock =>
      !realData.some(real => real.symbol === stock.symbol)
    );

    // Add slight randomization to mock data for realism
    const randomizedMockData = mockData.map(stock => ({
      ...stock,
      price: stock.price * (0.98 + Math.random() * 0.04), // ±2% variation
      change: stock.change * (0.5 + Math.random()), // Random change
      changePercent: stock.changePercent * (0.5 + Math.random()),
      lastUpdated: new Date(),
    }));

    return [...realData, ...randomizedMockData];
  }

  // Fallback to mock data with randomization
  return fallbackStockData.map(stock => ({
    ...stock,
    price: stock.price * (0.98 + Math.random() * 0.04),
    change: stock.change * (0.5 + Math.random()),
    changePercent: stock.changePercent * (0.5 + Math.random()),
    lastUpdated: new Date(),
  }));
}

// Simulate price movements for demo purposes
function updatePrices(stocks: StockData[]): StockData[] {
  return stocks.map(stock => {
    // Small random price movement for demo
    const changePercent = (Math.random() - 0.5) * 0.5; // ±0.25%
    const change = stock.price * (changePercent / 100);
    return {
      ...stock,
      price: stock.price + change,
      change: stock.change + change,
      changePercent: stock.changePercent + changePercent,
      lastUpdated: new Date(),
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    // Enhanced cache headers for better performance
    const headers = new Headers({
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'CDN-Cache-Control': 'public, max-age=30',
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const symbol = searchParams.get('symbol');

    if (type === 'indices') {
      // Update indices with slight movements for demo
      const updatedIndices = mockMarketIndices.map(index => ({
        ...index,
        value: index.value + (Math.random() - 0.5) * index.value * 0.002, // ±0.2%
        change: index.change + (Math.random() - 0.5) * 10,
        changePercent: index.changePercent + (Math.random() - 0.5) * 0.1,
        lastUpdated: new Date(),
      }));

      const response: ApiResponse<MarketIndex[]> = {
        success: true,
        data: updatedIndices,
      };
      return NextResponse.json(response, { headers });
    }

    if (symbol) {
      // Try to fetch real data for specific symbol
      const stockInfo = INDIAN_STOCKS.find(s => s.symbol === symbol);
      if (stockInfo) {
        const realData = await fetchStockData(stockInfo.globalSymbol);
        if (realData) {
          const response: ApiResponse<StockData> = {
            success: true,
            data: realData,
          };
          return NextResponse.json(response);
        }
      }

      // Fallback to mock data
      const stock = fallbackStockData.find(s => s.symbol === symbol);
      if (!stock) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Stock not found',
        }, { status: 404 });
      }

      const response: ApiResponse<StockData> = {
        success: true,
        data: stock,
      };
      return NextResponse.json(response);
    }

    // Return all stocks with real data where available
    const allStocks = await fetchAllStockData();
    const updatedStocks = updatePrices(allStocks);

    const response: ApiResponse<StockData[]> = {
      success: true,
      data: updatedStocks,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get market data error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
