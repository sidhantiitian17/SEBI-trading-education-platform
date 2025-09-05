"use client";

import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import {
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Zap,
  Target,
  DollarSign,
  Code,
  Save,
  Download,
  Upload,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Activity,
  Lightbulb,
  Brain,
  BookOpen,
  Trophy,
  Star,
  Layers,
  GitBranch,
  Database,
  Cpu,
  Flame,
  Rocket,
  PlusCircle,
  MinusCircle,
  ArrowUpDown,
  ArrowLeftRight,
  MoreHorizontal,
  Trash2,
  Copy,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Users,
  Crown,
  Medal,
  Award,
  Volume2,
  Monitor,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  RefreshCw,
  Info,
  HelpCircle
} from 'lucide-react';

// Enhanced interfaces for the interactive simulator
interface PriceData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Trade {
  id: string;
  timestamp: Date;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  reason: string;
  pnl?: number;
  status: 'pending' | 'executed' | 'cancelled';
  confidence: number;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  category: 'momentum' | 'mean_reversion' | 'arbitrage' | 'breakout' | 'grid';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  parameters: { [key: string]: number };
  isActive: boolean;
  createdAt: Date;
  performance: StrategyPerformance;
  author: string;
  rating: number;
  downloads: number;
}

interface StrategyPerformance {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  profitableTrades: number;
  avgProfit: number;
  avgLoss: number;
  calmarRatio: number;
  volatility: number;
  beta: number;
  alpha: number;
}

interface LiveStrategy {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped';
  capital: number;
  currentPnL: number;
  trades: number;
  winRate: number;
  startTime: Date;
  riskLevel: 'low' | 'medium' | 'high';
}

interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  profitableTrades: number;
  avgProfit: number;
  avgLoss: number;
  volatility: number;
  calmarRatio: number;
  beta: number;
  alpha: number;
  dailyReturns: number[];
  monthlyReturns: number[];
  trades: Trade[];
  equityCurve: { date: Date; value: number }[];
  drawdownSeries: { date: Date; drawdown: number }[];
}

interface TechnicalIndicator {
  id: string;
  name: string;
  category: 'trend' | 'momentum' | 'volatility' | 'volume';
  icon: any;
  color: string;
  description: string;
  parameters: { [key: string]: any };
}

interface StrategyComponent {
  id: string;
  type: 'indicator' | 'condition' | 'action';
  name: string;
  category: string;
  icon: any;
  color: string;
  parameters: { [key: string]: any };
  position: { x: number; y: number };
  connections: string[];
}

// Sample data and configurations
const SAMPLE_STRATEGIES: Strategy[] = [
  {
    id: 'ma-crossover-pro',
    name: 'Moving Average Crossover Pro',
    description: 'Advanced dual MA crossover with trend confirmation and volume filter',
    category: 'momentum',
    difficulty: 'intermediate',
    parameters: { 
      fastPeriod: 9, 
      slowPeriod: 21, 
      volumeThreshold: 1.2, 
      trendFilter: 50, 
      stopLoss: 2.5, 
      takeProfit: 5.0 
    },
    isActive: true,
    createdAt: new Date(),
    performance: {
      totalReturn: 12.5,
      sharpeRatio: 1.8,
      maxDrawdown: 8.2,
      winRate: 67.3,
      totalTrades: 156,
      profitableTrades: 105,
      avgProfit: 2.1,
      avgLoss: 1.4,
      calmarRatio: 1.5,
      volatility: 12.3,
      beta: 0.85,
      alpha: 3.2
    },
    author: 'AlgoTrader Pro',
    rating: 4.8,
    downloads: 2847
  },
  {
    id: 'rsi-divergence-advanced',
    name: 'RSI Divergence with Multi-Timeframe',
    description: 'RSI strategy with divergence detection and multiple timeframe confirmation',
    category: 'momentum',
    difficulty: 'advanced',
    parameters: { 
      rsiPeriod: 14, 
      overbought: 70, 
      oversold: 30, 
      divergenceLookback: 10,
      confirmationPeriod: 5,
      stopLoss: 3.0,
      takeProfit: 6.0
    },
    isActive: true,
    createdAt: new Date(),
    performance: {
      totalReturn: 18.7,
      sharpeRatio: 2.1,
      maxDrawdown: 6.5,
      winRate: 72.1,
      totalTrades: 89,
      profitableTrades: 64,
      avgProfit: 3.2,
      avgLoss: 1.8,
      calmarRatio: 2.9,
      volatility: 10.8,
      beta: 0.92,
      alpha: 4.1
    },
    author: 'Quant Master',
    rating: 4.9,
    downloads: 1923
  },
  {
    id: 'bollinger-squeeze',
    name: 'Bollinger Band Squeeze Breakout',
    description: 'Volatility breakout strategy using Bollinger Band squeeze patterns',
    category: 'breakout',
    difficulty: 'intermediate',
    parameters: { 
      period: 20, 
      stdDev: 2, 
      squeezeThreshold: 0.15,
      breakoutThreshold: 1.5,
      stopLoss: 2.0,
      takeProfit: 4.0
    },
    isActive: true,
    createdAt: new Date(),
    performance: {
      totalReturn: 15.3,
      sharpeRatio: 1.9,
      maxDrawdown: 7.8,
      winRate: 58.9,
      totalTrades: 73,
      profitableTrades: 43,
      avgProfit: 4.1,
      avgLoss: 2.3,
      calmarRatio: 2.0,
      volatility: 14.6,
      beta: 1.15,
      alpha: 2.8
    },
    author: 'Volatility Expert',
    rating: 4.6,
    downloads: 1456
  }
];

const TECHNICAL_INDICATORS: TechnicalIndicator[] = [
  {
    id: 'sma',
    name: 'Simple Moving Average',
    category: 'trend',
    icon: TrendingUp,
    color: '#3B82F6',
    description: 'Average price over a specific period',
    parameters: { period: 20 }
  },
  {
    id: 'ema',
    name: 'Exponential Moving Average',
    category: 'trend',
    icon: Activity,
    color: '#10B981',
    description: 'Weighted average giving more importance to recent prices',
    parameters: { period: 12 }
  },
  {
    id: 'rsi',
    name: 'Relative Strength Index',
    category: 'momentum',
    icon: Gauge,
    color: '#F59E0B',
    description: 'Momentum oscillator measuring speed and change of price movements',
    parameters: { period: 14, overbought: 70, oversold: 30 }
  },
  {
    id: 'macd',
    name: 'MACD',
    category: 'momentum',
    icon: BarChart3,
    color: '#8B5CF6',
    description: 'Trend-following momentum indicator',
    parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
  },
  {
    id: 'bollinger',
    name: 'Bollinger Bands',
    category: 'volatility',
    icon: Layers,
    color: '#EF4444',
    description: 'Volatility indicator with upper and lower bands',
    parameters: { period: 20, stdDev: 2 }
  },
  {
    id: 'volume',
    name: 'Volume',
    category: 'volume',
    icon: Volume2,
    color: '#6B7280',
    description: 'Trading volume indicator',
    parameters: { period: 20 }
  }
];

const STRATEGY_CONDITIONS = [
  {
    id: 'cross-above',
    name: 'Cross Above',
    description: 'When one line crosses above another',
    icon: TrendingUp,
    color: '#10B981'
  },
  {
    id: 'cross-below',
    name: 'Cross Below',
    description: 'When one line crosses below another',
    icon: TrendingDown,
    color: '#EF4444'
  },
  {
    id: 'greater-than',
    name: 'Greater Than',
    description: 'When value is greater than threshold',
    icon: ArrowUpDown,
    color: '#3B82F6'
  },
  {
    id: 'less-than',
    name: 'Less Than',
    description: 'When value is less than threshold',
    icon: ArrowUpDown,
    color: '#F59E0B'
  }
];

const STRATEGY_ACTIONS = [
  {
    id: 'buy',
    name: 'Buy',
    description: 'Enter long position',
    icon: TrendingUp,
    color: '#10B981'
  },
  {
    id: 'sell',
    name: 'Sell',
    description: 'Enter short position or exit long',
    icon: TrendingDown,
    color: '#EF4444'
  },
  {
    id: 'hold',
    name: 'Hold',
    description: 'Do nothing',
    icon: Clock,
    color: '#6B7280'
  }
];

// Memoized components for performance
const StrategyCard = memo(({ strategy, onSelect, isSelected }: { 
  strategy: Strategy; 
  onSelect: (strategy: Strategy) => void;
  isSelected: boolean;
}) => (
  <Card 
    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500 border-blue-200' : 'hover:border-gray-300'
    }`}
    onClick={() => onSelect(strategy)}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-gray-900">{strategy.name}</CardTitle>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{strategy.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Badge 
            variant={strategy.difficulty === 'beginner' ? 'secondary' : 
                    strategy.difficulty === 'intermediate' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {strategy.difficulty}
          </Badge>
          {strategy.isActive && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="pt-0">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-xl font-bold ${
            strategy.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {strategy.performance.totalReturn.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Total Return</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">
            {strategy.performance.winRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Win Rate</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{strategy.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>{strategy.downloads.toLocaleString()}</span>
        </div>
        <div className="text-xs">
          by {strategy.author}
        </div>
      </div>
    </CardContent>
  </Card>
));

StrategyCard.displayName = 'StrategyCard';

const TechnicalIndicatorCard = memo(({ indicator, onAdd }: { 
  indicator: TechnicalIndicator; 
  onAdd: (indicator: TechnicalIndicator) => void;
}) => (
  <Card className="cursor-pointer hover:shadow-md transition-all duration-200">
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: indicator.color + '20' }}
        >
          <indicator.icon className="h-5 w-5" style={{ color: indicator.color }} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{indicator.name}</h4>
          <Badge variant="outline" className="text-xs mt-1">
            {indicator.category}
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onAdd(indicator)}
          className="h-8 w-8 p-0"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-600">{indicator.description}</p>
    </CardContent>
  </Card>
));

TechnicalIndicatorCard.displayName = 'TechnicalIndicatorCard';

const LiveStrategyCard = memo(({ strategy }: { strategy: LiveStrategy }) => (
  <Card className="border-l-4 border-l-green-500">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
        <Badge 
          variant={strategy.status === 'running' ? 'default' : 
                  strategy.status === 'paused' ? 'secondary' : 'destructive'}
        >
          {strategy.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className={`text-lg font-bold ${
            strategy.currentPnL >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${strategy.currentPnL.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">Current P&L</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600">
            {strategy.trades}
          </div>
          <div className="text-xs text-gray-500">Trades</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Win Rate: {strategy.winRate}%</span>
        <Badge 
          variant={strategy.riskLevel === 'low' ? 'secondary' : 
                  strategy.riskLevel === 'medium' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {strategy.riskLevel} risk
        </Badge>
      </div>
    </CardContent>
  </Card>
));

LiveStrategyCard.displayName = 'LiveStrategyCard';

export function InteractiveAlgoTradingSimulator() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(SAMPLE_STRATEGIES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const [selectedIndicators, setSelectedIndicators] = useState<TechnicalIndicator[]>([]);
  const [strategyComponents, setStrategyComponents] = useState<StrategyComponent[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [realTimeData, setRealTimeData] = useState<{ return: number; trades: number }>({ return: 0, trades: 0 });

  // Sample live strategies
  const [liveStrategies] = useState<LiveStrategy[]>([
    {
      id: 'live-1',
      name: 'Momentum Scanner',
      status: 'running',
      capital: 50000,
      currentPnL: 1250.75,
      trades: 23,
      winRate: 65.2,
      startTime: new Date(Date.now() - 86400000 * 7),
      riskLevel: 'medium'
    },
    {
      id: 'live-2',
      name: 'Mean Reversion Bot',
      status: 'paused',
      capital: 25000,
      currentPnL: -340.20,
      trades: 12,
      winRate: 58.3,
      startTime: new Date(Date.now() - 86400000 * 3),
      riskLevel: 'low'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        return: prev.return + (Math.random() - 0.5) * 0.1,
        trades: prev.trades + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const runBacktest = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate backtest with progress updates
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }

    // Simulate results
    const mockResult: BacktestResult = {
      totalReturn: selectedStrategy.performance.totalReturn,
      sharpeRatio: selectedStrategy.performance.sharpeRatio,
      maxDrawdown: selectedStrategy.performance.maxDrawdown,
      winRate: selectedStrategy.performance.winRate,
      totalTrades: selectedStrategy.performance.totalTrades,
      profitableTrades: selectedStrategy.performance.profitableTrades,
      avgProfit: selectedStrategy.performance.avgProfit,
      avgLoss: selectedStrategy.performance.avgLoss,
      volatility: selectedStrategy.performance.volatility,
      calmarRatio: selectedStrategy.performance.calmarRatio,
      beta: selectedStrategy.performance.beta,
      alpha: selectedStrategy.performance.alpha,
      dailyReturns: Array.from({ length: 252 }, () => (Math.random() - 0.5) * 2),
      monthlyReturns: Array.from({ length: 12 }, () => (Math.random() - 0.5) * 10),
      trades: [],
      equityCurve: [],
      drawdownSeries: []
    };

    setBacktestResult(mockResult);
    setIsRunning(false);
    
    toast({
      title: "Backtest Complete!",
      description: `Strategy tested with ${mockResult.totalTrades} trades and ${mockResult.winRate.toFixed(1)}% win rate.`,
    });
  }, [selectedStrategy]);

  const addIndicator = useCallback((indicator: TechnicalIndicator) => {
    setSelectedIndicators(prev => [...prev, indicator]);
    toast({
      title: "Indicator Added",
      description: `${indicator.name} added to your strategy.`,
    });
  }, []);

  const generateStrategy = useCallback(() => {
    const randomStrategy = SAMPLE_STRATEGIES[Math.floor(Math.random() * SAMPLE_STRATEGIES.length)];
    setSelectedStrategy(randomStrategy);
    toast({
      title: "Strategy Generated!",
      description: `Generated "${randomStrategy.name}" strategy.`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Algorithmic Trading Simulator
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Learn algorithmic trading, build strategies, and test them with historical data
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Active Strategies</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <div className="text-sm text-gray-600">Best Strategy Return</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">47</div>
                <div className="text-sm text-gray-600">Backtests Run</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Live Strategies</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Strategy Builder
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Strategy Library
            </TabsTrigger>
            <TabsTrigger value="backtesting" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Backtesting
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Live Trading
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strategy Performance Overview */}
              <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Strategy Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {realTimeData.return.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Total Return</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1.8</div>
                      <div className="text-sm text-gray-600">Sharpe Ratio</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">-8.2%</div>
                      <div className="text-sm text-gray-600">Max Drawdown</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {realTimeData.trades}
                      </div>
                      <div className="text-sm text-gray-600">Total Trades</div>
                    </div>
                  </div>
                  
                  {/* Real-time Chart Placeholder */}
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Real-time Performance Chart</p>
                      <p className="text-sm text-gray-400">Interactive chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Strategies */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-green-500" />
                    Live Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {liveStrategies.map(strategy => (
                    <LiveStrategyCard key={strategy.id} strategy={strategy} />
                  ))}
                  <Button className="w-full" variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Deploy New Strategy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategy Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Component Library */}
              <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-500" />
                    Component Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="indicators">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="indicators" className="text-xs">Indicators</TabsTrigger>
                      <TabsTrigger value="conditions" className="text-xs">Conditions</TabsTrigger>
                      <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="indicators" className="space-y-3 mt-4">
                      <h4 className="font-semibold text-sm text-gray-700">Technical Indicators</h4>
                      {TECHNICAL_INDICATORS.map(indicator => (
                        <div 
                          key={indicator.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => addIndicator(indicator)}
                        >
                          <div className="flex items-center gap-2">
                            <indicator.icon className="h-4 w-4" style={{ color: indicator.color }} />
                            <div>
                              <div className="font-medium text-sm">{indicator.name}</div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {indicator.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="conditions" className="space-y-3 mt-4">
                      <h4 className="font-semibold text-sm text-gray-700">Conditions</h4>
                      {STRATEGY_CONDITIONS.map(condition => (
                        <div 
                          key={condition.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <condition.icon className="h-4 w-4" style={{ color: condition.color }} />
                            <div>
                              <div className="font-medium text-sm">{condition.name}</div>
                              <div className="text-xs text-gray-500">{condition.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="actions" className="space-y-3 mt-4">
                      <h4 className="font-semibold text-sm text-gray-700">Actions</h4>
                      {STRATEGY_ACTIONS.map(action => (
                        <div 
                          key={action.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <action.icon className="h-4 w-4" style={{ color: action.color }} />
                            <div>
                              <div className="font-medium text-sm">{action.name}</div>
                              <div className="text-xs text-gray-500">{action.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Visual Strategy Builder */}
              <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-purple-500" />
                      Visual Strategy Builder
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={generateStrategy}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Strategy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Save Strategy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Strategy Canvas */}
                  <div className="relative bg-gray-50 rounded-lg h-96 overflow-hidden border-2 border-dashed border-gray-300">
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setCanvasZoom(zoom => Math.min(200, zoom + 25))}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setCanvasZoom(zoom => Math.max(50, zoom - 25))}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setCanvasZoom(100)}>
                        <Maximize className="h-4 w-4" />
                        Fit to Screen
                      </Button>
                      <span className="text-sm text-gray-500">{canvasZoom}%</span>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Strategy Canvas</h3>
                        <p className="text-gray-500 mb-4">Drag and drop components to build your strategy</p>
                        <Button onClick={() => setIsBuilderOpen(true)}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Start Building
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Properties Panel */}
              <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-500" />
                    Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Select an element to view its properties
                    </p>
                  </div>
                  
                  {/* Real-time Preview */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-3">Real-time Preview</h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {realTimeData.return.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-500">Total Return</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategy Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Strategy Library</h2>
                <p className="text-gray-600">Browse and discover proven trading strategies</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search strategies..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAMPLE_STRATEGIES.map(strategy => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onSelect={setSelectedStrategy}
                  isSelected={selectedStrategy.id === strategy.id}
                />
              ))}
            </div>
          </TabsContent>

          {/* Backtesting Tab */}
          <TabsContent value="backtesting" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Backtesting Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Strategy Selection and Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold">Selected Strategy</Label>
                    <Card className="mt-2 p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-3">
                        <Brain className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">{selectedStrategy.name}</h4>
                          <p className="text-sm text-gray-600">{selectedStrategy.description}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <Label className="text-base font-semibold">Backtest Parameters</Label>
                    <div className="mt-2 space-y-3">
                      <div>
                        <Label>Initial Capital</Label>
                        <Input type="number" defaultValue="100000" className="mt-1" />
                      </div>
                      <div>
                        <Label>Time Period</Label>
                        <Select defaultValue="1year">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3months">3 Months</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="1year">1 Year</SelectItem>
                            <SelectItem value="2years">2 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Run Backtest Button */}
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={runBacktest} 
                    disabled={isRunning}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Running Backtest...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Backtest
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Progress Bar */}
                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Backtesting in progress...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Backtest Results */}
                {backtestResult && (
                  <div className="space-y-6">
                    <Separator />
                    <h3 className="text-lg font-semibold">Backtest Results</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="text-center p-4">
                        <div className={`text-2xl font-bold ${
                          backtestResult.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {backtestResult.totalReturn.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-500">Total Return</div>
                      </Card>
                      
                      <Card className="text-center p-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {backtestResult.sharpeRatio.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Sharpe Ratio</div>
                      </Card>
                      
                      <Card className="text-center p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {backtestResult.winRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Win Rate</div>
                      </Card>
                      
                      <Card className="text-center p-4">
                        <div className="text-2xl font-bold text-red-600">
                          -{backtestResult.maxDrawdown.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Max Drawdown</div>
                      </Card>
                    </div>
                    
                    {/* Additional Metrics */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Detailed Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Trades:</span>
                          <span className="ml-2">{backtestResult.totalTrades}</span>
                        </div>
                        <div>
                          <span className="font-medium">Profitable Trades:</span>
                          <span className="ml-2">{backtestResult.profitableTrades}</span>
                        </div>
                        <div>
                          <span className="font-medium">Average Profit:</span>
                          <span className="ml-2 text-green-600">${backtestResult.avgProfit.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Average Loss:</span>
                          <span className="ml-2 text-red-600">${backtestResult.avgLoss.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Volatility:</span>
                          <span className="ml-2">{backtestResult.volatility.toFixed(2)}%</span>
                        </div>
                        <div>
                          <span className="font-medium">Calmar Ratio:</span>
                          <span className="ml-2">{backtestResult.calmarRatio.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Beta:</span>
                          <span className="ml-2">{backtestResult.beta.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Alpha:</span>
                          <span className="ml-2">{backtestResult.alpha.toFixed(2)}%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Trading Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Deploy to Live Trading
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Paper Trading Mode</h4>
                        <p className="text-sm text-yellow-700">
                          Start with paper trading to test your strategy without real money.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label>Strategy to Deploy</Label>
                      <Card className="mt-2 p-3 bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{selectedStrategy.name}</span>
                        </div>
                      </Card>
                    </div>
                    
                    <div>
                      <Label>Trading Capital</Label>
                      <Input type="number" defaultValue="10000" className="mt-1" />
                    </div>
                    
                    <div>
                      <Label>Risk Level</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk (1-2%)</SelectItem>
                          <SelectItem value="medium">Medium Risk (3-5%)</SelectItem>
                          <SelectItem value="high">High Risk (6-10%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Enable trade notifications</Label>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy Strategy
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Community Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: "QuantMaster", return: 28.5, icon: Crown },
                      { rank: 2, name: "AlgoWizard", return: 24.2, icon: Medal },
                      { rank: 3, name: "TradingBot", return: 19.8, icon: Award },
                      { rank: 4, name: "You", return: selectedStrategy.performance.totalReturn, icon: Star }
                    ].map((trader, index) => (
                      <div 
                        key={trader.rank}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          trader.name === 'You' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <trader.icon className={`h-4 w-4 ${
                              trader.rank === 1 ? 'text-yellow-500' :
                              trader.rank === 2 ? 'text-gray-400' :
                              trader.rank === 3 ? 'text-amber-600' : 'text-blue-500'
                            }`} />
                            <span className="font-medium">#{trader.rank}</span>
                          </div>
                          <span className={trader.name === 'You' ? 'font-semibold text-blue-600' : ''}>
                            {trader.name}
                          </span>
                        </div>
                        <span className="font-bold text-green-600">
                          +{trader.return.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Full Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Educational Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900">Learn Algorithmic Trading</h3>
                <p className="text-purple-700 text-sm">
                  Master the fundamentals with our comprehensive educational resources
                </p>
              </div>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Strategy Builder Modal */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Advanced Strategy Builder</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex">
            <div className="w-1/4 border-r p-4">
              <h4 className="font-semibold mb-3">Components</h4>
              <ScrollArea className="h-full">
                {TECHNICAL_INDICATORS.map(indicator => (
                  <TechnicalIndicatorCard
                    key={indicator.id}
                    indicator={indicator}
                    onAdd={addIndicator}
                  />
                ))}
              </ScrollArea>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Visual Strategy Canvas</h3>
                  <p className="text-gray-500">Drag components here to build your strategy</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
