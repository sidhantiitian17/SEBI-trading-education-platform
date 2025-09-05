"use client";

import { useState, Suspense, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, BarChart3, PlayCircle } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';
import { TradingDashboardSkeleton, PortfolioCardSkeleton, MarketWatchSkeleton } from '@/components/trading-skeleton';
import { FastPortfolioOverview, FastPositionsList } from '@/components/fast-portfolio';
import { EnhancedMarketWatch } from '@/components/enhanced-market-watch';
import dynamic from 'next/dynamic';

// Lazy load heavy components with better error handling
const TradingOrderForm = dynamic(() => import('@/components/trading-order-form'), {
  ssr: false,
  loading: () => (
    <Card>
      <CardHeader><div className="h-6 w-32 bg-gray-200 rounded animate-pulse" /></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
});

const VirtualTradingSimulator = dynamic(() => import('@/components/virtual-trading-simulator'), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  )
});

const PortfolioDashboard = dynamic(() => import('@/components/portfolio-overview').then(mod => ({ default: mod.PortfolioOverview })), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({length: 4}).map((_, i) => (
        <PortfolioCardSkeleton key={i} />
      ))}
    </div>
  )
});

// Optimized Portfolio Summary Component with memoization
const PortfolioSummary = memo(({ portfolio }: { portfolio: any }) => {
  if (!portfolio) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PortfolioCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Cash Balance</p>
              <p className="text-2xl font-bold">₹{portfolio.cash.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Invested</p>
              <p className="text-2xl font-bold">
                ₹{(portfolio.totalValue - portfolio.cash).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {portfolio.performance.totalReturnPercent >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <div>
              <p className="text-sm font-medium">Total Return</p>
              <p className={`text-2xl font-bold ${
                portfolio.performance.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{portfolio.performance.totalReturn.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Return %</p>
              <p className={`text-2xl font-bold ${
                portfolio.performance.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolio.performance.totalReturnPercent >= 0 ? '+' : ''}
                {portfolio.performance.totalReturnPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

PortfolioSummary.displayName = 'PortfolioSummary';

export function TradingDashboard() {
  const { portfolio, marketData, selectedSymbol, isLoading, error } = useTrading();
  const [activeTab, setActiveTab] = useState('virtual-simulator');

  const handleSymbolSelect = (symbol: string) => {
    setActiveTab('order');
  };

  // Show skeleton while initial loading, but allow progressive enhancement
  if (isLoading && !portfolio) {
    return <TradingDashboardSkeleton />;
  }

  // Show error state if there's an error and no portfolio data
  if (error && !portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Trading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="virtual-simulator" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            <PlayCircle className="h-4 w-4 mr-2" />
            Virtual Trading
          </TabsTrigger>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="order">
            <Activity className="h-4 w-4 mr-2" />
            Place Order
          </TabsTrigger>
          <TabsTrigger value="market-watch">
            <TrendingUp className="h-4 w-4 mr-2" />
            Market Watch
          </TabsTrigger>
          <TabsTrigger value="portfolio">
            <PieChart className="h-4 w-4 mr-2" />
            Portfolio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="virtual-simulator" className="space-y-6">
          <Suspense fallback={
            <div className="space-y-6">
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          }>
            <VirtualTradingSimulator />
          </Suspense>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Header - Show immediately with fallback values */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Portfolio Overview</h1>
              <p className="text-muted-foreground">Real-time performance metrics</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ₹{portfolio ? portfolio.totalValue.toLocaleString() : '1,000,000'}
              </div>
              <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
            </div>
          </div>

          {/* Portfolio Summary Cards - Progressive Enhancement */}
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-4 gap-4">{Array.from({length: 4}).map((_, i) => <PortfolioCardSkeleton key={i} />)}</div>}>
            <PortfolioSummary portfolio={portfolio} />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fast Portfolio Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading portfolio data...</div>}>
                  <FastPortfolioOverview />
                </Suspense>
              </CardContent>
            </Card>

            {/* Fast Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MarketWatchSkeleton />}>
                  <EnhancedMarketWatch />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Recent Positions - Fast Loading */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PortfolioCardSkeleton />}>
                <FastPositionsList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order" className="space-y-6">
          <Suspense fallback={<div className="p-8 text-center">Loading order form...</div>}>
            <TradingOrderForm />
          </Suspense>
        </TabsContent>

        <TabsContent value="market-watch" className="space-y-6">
          <Suspense fallback={<MarketWatchSkeleton />}>
            <EnhancedMarketWatch />
          </Suspense>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Suspense fallback={<div className="p-8 text-center">Loading portfolio details...</div>}>
            <PortfolioDashboard />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
