"use client";

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  RefreshCw,
  ShoppingCart,
  Eye,
  Target,
  Activity,
  Zap,
  Clock,
  Users,
  Award,
  Star,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Settings,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  LineChart,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

// Mock data generation utilities
const generateRandomPrice = (basePrice: number, volatility = 0.02) => {
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  return Math.max(basePrice + change, basePrice * 0.5);
};

const generateCandlestickData = (basePrice: number, points = 30) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < points; i++) {
    const open = currentPrice;
    const change = (Math.random() - 0.5) * basePrice * 0.03;
    const close = Math.max(open + change, open * 0.9);
    const high = Math.max(open, close) + Math.random() * basePrice * 0.015;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.015;
    
    data.push({
      timestamp: Date.now() - (points - i) * 60000,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 10000) + 1000
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Enhanced Candlestick Chart Component
const CandlestickChart = memo(({ data, height = 200, showVolume = false }: {
  data: any[];
  height?: number;
  showVolume?: boolean;
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  const prices = data.map(d => [d.high, d.low, d.open, d.close]).flat();
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice;
  const chartHeight = showVolume ? height * 0.7 : height;

  return (
    <div className="w-full bg-gray-900 rounded-lg border border-gray-700" style={{ height }}>
      <svg width="100%" height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height={chartHeight} fill="url(#grid)" opacity="0.5" />
        
        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 95 + 2.5;
          const bodyTop = ((maxPrice - Math.max(candle.open, candle.close)) / priceRange) * chartHeight;
          const bodyBottom = ((maxPrice - Math.min(candle.open, candle.close)) / priceRange) * chartHeight;
          const wickTop = ((maxPrice - candle.high) / priceRange) * chartHeight;
          const wickBottom = ((maxPrice - candle.low) / priceRange) * chartHeight;
          
          const isGreen = candle.close >= candle.open;
          const bodyHeight = Math.max(Math.abs(bodyBottom - bodyTop), 1);
          
          return (
            <g key={index} className="hover:opacity-80 transition-opacity">
              {/* Wick */}
              <line
                x1={`${x}%`}
                y1={wickTop}
                x2={`${x}%`}
                y2={wickBottom}
                stroke={isGreen ? "#10b981" : "#ef4444"}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={`${x - 0.8}%`}
                y={bodyTop}
                width="1.6%"
                height={bodyHeight}
                fill={isGreen ? "#10b981" : "#ef4444"}
                fillOpacity={isGreen ? 0.8 : 0.9}
                stroke={isGreen ? "#059669" : "#dc2626"}
                strokeWidth="0.5"
                rx="1"
              />
              
              {/* Volume bars (if enabled) */}
              {showVolume && (
                <rect
                  x={`${x - 0.4}%`}
                  y={chartHeight + 5}
                  width="0.8%"
                  height={(candle.volume / Math.max(...data.map(d => d.volume))) * (height - chartHeight - 10)}
                  fill={isGreen ? "#10b981" : "#ef4444"}
                  fillOpacity={0.3}
                />
              )}
            </g>
          );
        })}
        
        {/* Price labels */}
        <text x="2%" y="15" className="text-xs fill-gray-300" fontSize="10">
          ₹{maxPrice.toFixed(2)}
        </text>
        <text x="2%" y={chartHeight - 5} className="text-xs fill-gray-300" fontSize="10">
          ₹{minPrice.toFixed(2)}
        </text>
      </svg>
    </div>
  );
});

CandlestickChart.displayName = 'CandlestickChart';

// Virtual Trading Simulator Component
const VirtualTradingSimulator = () => {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [virtualBalance, setVirtualBalance] = useState(50000);
  const [portfolioValue, setPortfolioValue] = useState(52450);
  const [positions, setPositions] = useState([
    {
      symbol: 'RELIANCE',
      shares: 100,
      avgPrice: 2500,
      currentPrice: 2550,
      change: 50,
      changePercent: 2.0,
      marketValue: 255000,
      chartData: generateCandlestickData(2550, 20)
    },
    {
      symbol: 'HDFC',
      shares: 75,
      avgPrice: 2800,
      currentPrice: 2750,
      change: -50,
      changePercent: -1.8,
      marketValue: 206250,
      chartData: generateCandlestickData(2750, 20)
    },
    {
      symbol: 'TCS',
      shares: 50,
      avgPrice: 3800,
      currentPrice: 3900,
      change: 100,
      changePercent: 2.6,
      marketValue: 195000,
      chartData: generateCandlestickData(3900, 20)
    }
  ]);

  const [marketData, setMarketData] = useState([
    { symbol: 'NIFTY 50', price: 21500, change: 125.50, changePercent: 0.59 },
    { symbol: 'SENSEX', price: 71200, change: -89.30, changePercent: -0.13 },
    { symbol: 'BANK NIFTY', price: 47800, change: 234.60, changePercent: 0.49 },
    { symbol: 'IT SECTOR', price: 3450, change: 45.20, changePercent: 1.33 },
    { symbol: 'PHARMA SECTOR', price: 2890, change: -23.10, changePercent: -0.79 }
  ]);

  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [orderType, setOrderType] = useState('BUY');
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [marketDataError, setMarketDataError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time data simulation
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      // Update market data
      setMarketData(prev => prev.map(item => {
        const priceChange = (Math.random() - 0.5) * item.price * 0.002;
        const newPrice = Math.max(item.price + priceChange, item.price * 0.95);
        const changePercent = ((newPrice - item.price) / item.price) * 100;
        
        return {
          ...item,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(priceChange * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100
        };
      }));

      // Update positions
      setPositions(prev => prev.map(position => {
        const priceChange = (Math.random() - 0.5) * position.currentPrice * 0.001;
        const newPrice = Math.max(position.currentPrice + priceChange, position.avgPrice * 0.9);
        const changePercent = ((newPrice - position.avgPrice) / position.avgPrice) * 100;
        const marketValue = newPrice * position.shares;
        
        return {
          ...position,
          currentPrice: Math.round(newPrice * 100) / 100,
          change: Math.round((newPrice - position.avgPrice) * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          marketValue: Math.round(marketValue)
        };
      }));

      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  // Calculate portfolio statistics
  const portfolioStats = useMemo(() => {
    const totalInvested = positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.shares), 0);
    const totalMarketValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalPnL = totalMarketValue - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const totalPortfolioValue = virtualBalance + totalMarketValue;

    return {
      totalInvested,
      totalMarketValue,
      totalPnL,
      totalPnLPercent,
      totalPortfolioValue,
      cashBalance: virtualBalance,
      positionCount: positions.length
    };
  }, [positions, virtualBalance]);

  // Place order function
  const placeOrder = useCallback(() => {
    const selectedPosition = positions.find(p => p.symbol === selectedStock);
    if (!selectedPosition) return;

    const orderValue = selectedPosition.currentPrice * orderQuantity;
    
    if (orderType === 'BUY' && orderValue > virtualBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough cash to place this order.",
        variant: "destructive"
      });
      return;
    }

    if (orderType === 'SELL') {
      const existingPosition = positions.find(p => p.symbol === selectedStock);
      if (!existingPosition || existingPosition.shares < orderQuantity) {
        toast({
          title: "Insufficient Shares",
          description: "You don't have enough shares to sell.",
          variant: "destructive"
        });
        return;
      }
    }

    // Execute the order
    if (orderType === 'BUY') {
      setVirtualBalance(prev => prev - orderValue);
      setPositions(prev => prev.map(pos => {
        if (pos.symbol === selectedStock) {
          const newShares = pos.shares + orderQuantity;
          const newAvgPrice = ((pos.avgPrice * pos.shares) + (pos.currentPrice * orderQuantity)) / newShares;
          return {
            ...pos,
            shares: newShares,
            avgPrice: Math.round(newAvgPrice * 100) / 100,
            marketValue: pos.currentPrice * newShares
          };
        }
        return pos;
      }));
    } else {
      setVirtualBalance(prev => prev + orderValue);
      setPositions(prev => prev.map(pos => {
        if (pos.symbol === selectedStock) {
          const newShares = pos.shares - orderQuantity;
          return {
            ...pos,
            shares: newShares,
            marketValue: pos.currentPrice * newShares
          };
        }
        return pos;
      }).filter(pos => pos.shares > 0));
    }

    toast({
      title: "Order Executed",
      description: `Successfully ${orderType.toLowerCase()}ed ${orderQuantity} shares of ${selectedStock}`,
      variant: "default"
    });
  }, [selectedStock, orderType, orderQuantity, positions, virtualBalance]);

  // Retry market data function
  const retryMarketData = useCallback(() => {
    setMarketDataError(false);
    // Simulate successful data fetch after retry
    setTimeout(() => {
      setLastUpdate(new Date());
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <PlayCircle className="h-8 w-8 text-white" />
              </div>
              Virtual Trading Simulator
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Practice trading with real market data (15min delayed)
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Activity className="h-3 w-3 mr-1" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Badge>
            <Button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              className={`${isSimulationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isSimulationRunning ? (
                <>
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Pause Simulation
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Virtual Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Virtual Balance</p>
                  <p className="text-3xl font-bold">${virtualBalance.toLocaleString()}</p>
                  <p className="text-green-100 text-sm mt-1">Available for trading</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Wallet className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Portfolio Value</p>
                  <p className="text-3xl font-bold">${portfolioStats.totalPortfolioValue.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-100" />
                    <span className="text-blue-100 text-sm">+{portfolioStats.totalPnLPercent.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <LineChart className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Interface */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900 data-[state=active]:text-blue-300 text-gray-300 hover:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="place-order" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300 text-gray-300 hover:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Place Order
            </TabsTrigger>
            <TabsTrigger value="market-watch" className="data-[state=active]:bg-purple-900 data-[state=active]:text-purple-300 text-gray-300 hover:text-white">
              <Globe className="h-4 w-4 mr-2" />
              Market Watch
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-orange-900 data-[state=active]:text-orange-300 text-gray-300 hover:text-white">
              <PieChart className="h-4 w-4 mr-2" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Portfolio Performance */}
              <Card className="lg:col-span-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Portfolio Performance
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Real-time
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-900/20 border border-green-700/50 rounded-lg backdrop-blur-sm">
                      <p className="text-2xl font-bold text-green-300">₹{portfolioStats.totalPortfolioValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-300">Total Portfolio Value</p>
                      <p className="text-xs text-green-400 mt-1">Including cash & investments</p>
                    </div>
                    <div className="text-center p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg backdrop-blur-sm">
                      <p className="text-2xl font-bold text-blue-300">₹{virtualBalance.toLocaleString()}</p>
                      <p className="text-sm text-gray-300">Available Cash</p>
                      <p className="text-xs text-blue-400 mt-1">Ready for investment</p>
                    </div>
                    <div className="text-center p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg backdrop-blur-sm">
                      <p className="text-2xl font-bold text-purple-300">₹{portfolioStats.totalMarketValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-300">Invested Amount</p>
                      <p className="text-xs text-purple-400 mt-1">Active positions</p>
                    </div>
                    <div className="text-center p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg backdrop-blur-sm">
                      <p className={`text-2xl font-bold ${portfolioStats.totalPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        ₹{Math.abs(portfolioStats.totalPnL).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-300">Total Returns</p>
                      <p className={`text-xs mt-1 ${portfolioStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {portfolioStats.totalPnL >= 0 ? '+' : ''}{portfolioStats.totalPnLPercent.toFixed(2)}% overall
                      </p>
                    </div>
                  </div>
                  
                  {/* Portfolio allocation chart placeholder */}
                  <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <PieChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-300">Portfolio Allocation Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Virtual Trading Info */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Virtual Trading
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg border border-gray-600 backdrop-blur-sm">
                    <p className="text-sm text-gray-300 mb-2">Practice trading with virtual money</p>
                    <p className="text-3xl font-bold text-blue-300">₹1,000,000</p>
                    <p className="text-xs text-blue-400 mt-1">Starting virtual balance</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700/50 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-gray-200">Risk-free learning</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-gray-200">Real market data</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-gray-200">Track performance</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Place Order Tab */}
          <TabsContent value="place-order" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Place Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="stock-select">Select Stock</Label>
                    <Select value={selectedStock} onValueChange={setSelectedStock}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos.symbol} value={pos.symbol}>
                            {pos.symbol} - ₹{pos.currentPrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="order-type">Order Type</Label>
                    <Select value={orderType} onValueChange={setOrderType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUY">BUY</SelectItem>
                        <SelectItem value="SELL">SELL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={placeOrder}
                      className={`w-full ${orderType === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {orderType === 'BUY' ? 'Buy Shares' : 'Sell Shares'}
                    </Button>
                  </div>
                </div>
                
                {/* Order preview */}
                {selectedStock && (
                  <div className="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-lg backdrop-blur-sm">
                    <h4 className="font-semibold mb-2 text-gray-200">Order Preview</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Stock:</span>
                        <span className="ml-2 font-medium text-gray-200">{selectedStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Price:</span>
                        <span className="ml-2 font-medium text-gray-200">
                          ₹{positions.find(p => p.symbol === selectedStock)?.currentPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Quantity:</span>
                        <span className="ml-2 font-medium text-gray-200">{orderQuantity} shares</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Value:</span>
                        <span className="ml-2 font-medium text-gray-200">
                          ₹{((positions.find(p => p.symbol === selectedStock)?.currentPrice || 0) * orderQuantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Watch Tab */}
          <TabsContent value="market-watch" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Market Overview
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryMarketData}
                    disabled={!marketDataError}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {marketDataError ? (
                  <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load market data</h3>
                    <p className="text-red-600 mb-4">Unable to fetch real-time prices</p>
                    <Button onClick={retryMarketData} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {marketData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors bg-gray-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                          <div>
                            <p className="font-semibold text-gray-200">{item.symbol}</p>
                            <div className="flex items-center gap-2 text-sm">
                              {item.changePercent >= 0 ? (
                                <ArrowUpRight className="h-3 w-3 text-green-600" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-600" />
                              )}
                              <span className={item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                                ₹{Math.abs(item.change).toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-200">₹{item.price.toLocaleString()}</p>
                          <Badge 
                            variant={item.changePercent >= 0 ? "default" : "destructive"}
                            className={`${item.changePercent >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-orange-600" />
                    Recent Positions
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{positions.length} active positions</Badge>
                    <Select defaultValue="value">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value">Sort by Value</SelectItem>
                        <SelectItem value="symbol">Sort by Symbol</SelectItem>
                        <SelectItem value="pnl">Sort by P&L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {positions.map((position, index) => {
                    const isProfit = position.changePercent >= 0;
                    return (
                      <div key={index} className="group p-4 border border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 bg-gray-800/50 backdrop-blur-sm border-l-4" 
                           style={{ borderLeftColor: isProfit ? '#10b981' : '#ef4444' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                              <div>
                                <div className="font-semibold text-lg text-gray-200">{position.symbol}</div>
                                <div className="text-sm text-gray-400">
                                  {position.shares} shares @ ₹{position.avgPrice.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Current: ₹{position.currentPrice.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Mini chart */}
                          <div className="hidden lg:block w-24 mx-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CandlestickChart data={position.chartData} height={40} />
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold text-lg text-gray-200">
                              ₹{position.marketValue.toLocaleString()}
                            </div>
                            <Badge 
                              variant={isProfit ? "default" : "destructive"}
                              className={`text-sm font-medium ${
                                isProfit 
                                  ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {position.change >= 0 ? '+' : ''}₹{Math.abs(position.change * position.shares).toFixed(2)}
                              <span className="ml-1 text-xs">
                                ({position.changePercent >= 0 ? '+' : ''}{position.changePercent.toFixed(1)}%)
                              </span>
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Performance bar */}
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              isProfit ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.min(Math.abs(position.changePercent) * 5, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Portfolio Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600 backdrop-blur-sm">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-200 text-lg">
                        ₹{portfolioStats.totalMarketValue.toLocaleString()}
                      </div>
                      <div className="text-gray-400">Total Value</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold text-lg ${
                        portfolioStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ₹{Math.abs(portfolioStats.totalPnL).toLocaleString()}
                      </div>
                      <div className="text-gray-400">Unrealized P&L</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-200 text-lg">{portfolioStats.positionCount}</div>
                      <div className="text-gray-400">Active Positions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VirtualTradingSimulator;
