"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Eye, EyeOff } from 'lucide-react';
import { usePortfolio, useMarketData } from '@/hooks/useSWR';

// Candlestick Chart Component
const CandlestickChart = ({ data, height = 60 }: { data: any[], height?: number }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full bg-gray-100 rounded animate-pulse`} style={{ height }}>
        <div className="flex items-center justify-center h-full text-xs text-gray-400">
          Loading chart...
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...data.map(d => Math.max(d.high, d.open, d.close, d.low)));
  const minPrice = Math.min(...data.map(d => Math.min(d.high, d.open, d.close, d.low)));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height={height} className="overflow-visible">
        {data.map((candle, index) => {
          const x = (index / (data.length - 1)) * 100;
          const bodyTop = ((maxPrice - Math.max(candle.open, candle.close)) / priceRange) * 100;
          const bodyBottom = ((maxPrice - Math.min(candle.open, candle.close)) / priceRange) * 100;
          const wickTop = ((maxPrice - candle.high) / priceRange) * 100;
          const wickBottom = ((maxPrice - candle.low) / priceRange) * 100;
          
          const isGreen = candle.close > candle.open;
          const bodyHeight = Math.abs(bodyBottom - bodyTop);
          
          return (
            <g key={index}>
              {/* Wick */}
              <line
                x1={`${x}%`}
                y1={`${wickTop}%`}
                x2={`${x}%`}
                y2={`${wickBottom}%`}
                stroke={isGreen ? "#10b981" : "#ef4444"}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={`${x - 1}%`}
                y={`${bodyTop}%`}
                width="2%"
                height={`${Math.max(bodyHeight, 1)}%`}
                fill={isGreen ? "#10b981" : "#ef4444"}
                opacity={0.8}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Generate mock candlestick data
const generateCandlestickData = (basePrice: number, days: number = 30) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < days; i++) {
    const variation = (Math.random() - 0.5) * basePrice * 0.02; // ±2% variation
    const open = currentPrice;
    const close = currentPrice + variation;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01;
    
    data.push({ open, high, low, close, date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000) });
    currentPrice = close;
  }
  
  return data;
};

// Enhanced Portfolio Card with mini chart
const PortfolioCard = ({ title, value, icon: Icon, color, change, trend, chartData, subtitle }: any) => {
  const [showChart, setShowChart] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: color.replace('text-', '') === 'green-600' ? '#10b981' : color.replace('text-', '') === 'blue-600' ? '#3b82f6' : color.replace('text-', '') === 'purple-600' ? '#8b5cf6' : '#ef4444' }}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
              {change && (
                <div className="flex items-center gap-1">
                  <p className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? '+' : ''}{change}%
                  </p>
                  {trend && (
                    <div className="flex items-center">
                      {trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {chartData && (
            <div className="flex flex-col items-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {showChart ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              
              {showChart ? (
                <div className="w-24">
                  <CandlestickChart data={chartData} height={40} />
                </div>
              ) : (
                <div className="w-24">
                  <CandlestickChart data={chartData.slice(-7)} height={40} />
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function FastPortfolioOverview() {
  const { data: portfolio, isLoading, error } = usePortfolio();
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Memoize calculations and chart data to prevent unnecessary re-renders
  const portfolioStats = useMemo(() => {
    if (!portfolio) return null;
    
    const chartData = {
      totalValue: generateCandlestickData(portfolio.totalValue, 30),
      cash: generateCandlestickData(portfolio.cash, 30),
      invested: generateCandlestickData(portfolio.totalValue - portfolio.cash, 30),
      returns: generateCandlestickData(Math.abs(portfolio.performance.totalReturn), 30),
    };
    
    return {
      totalValue: portfolio.totalValue.toLocaleString(),
      cashBalance: portfolio.cash.toLocaleString(),
      invested: (portfolio.totalValue - portfolio.cash).toLocaleString(),
      totalReturn: portfolio.performance.totalReturn.toLocaleString(),
      returnPercent: portfolio.performance.totalReturnPercent.toFixed(2),
      chartData,
    };
  }, [portfolio]);

  if (isLoading || !portfolioStats) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Overview</h3>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-l-4 border-l-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-24 h-10 bg-gray-100 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600 font-medium">Failed to load portfolio data</div>
        <p className="text-red-500 text-sm mt-1">Please refresh the page to try again</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Portfolio Overview</h3>
          <p className="text-sm text-gray-600 mt-1">Real-time performance metrics with trend analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showDetailedView ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="text-xs"
          >
            {showDetailedView ? "Simple View" : "Detailed View"}
          </Button>
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </div>
      </div>

      {/* Portfolio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PortfolioCard
          title="Total Portfolio Value"
          value={`₹${portfolioStats.totalValue}`}
          subtitle="Including cash & investments"
          icon={DollarSign}
          color="text-green-600"
          chartData={portfolioStats.chartData.totalValue}
          trend="up"
        />
        <PortfolioCard
          title="Available Cash"
          value={`₹${portfolioStats.cashBalance}`}
          subtitle="Ready for investment"
          icon={PieChart}
          color="text-blue-600"
          chartData={portfolioStats.chartData.cash}
        />
        <PortfolioCard
          title="Invested Amount"
          value={`₹${portfolioStats.invested}`}
          subtitle="Active positions"
          icon={BarChart3}
          color="text-purple-600"
          chartData={portfolioStats.chartData.invested}
          trend="up"
        />
        <PortfolioCard
          title="Total Returns"
          value={`₹${portfolioStats.totalReturn}`}
          subtitle={`${portfolioStats.returnPercent}% overall`}
          icon={portfolio.performance.totalReturnPercent >= 0 ? TrendingUp : TrendingDown}
          color={portfolio.performance.totalReturnPercent >= 0 ? "text-green-600" : "text-red-600"}
          change={portfolioStats.returnPercent}
          chartData={portfolioStats.chartData.returns}
          trend={portfolio.performance.totalReturnPercent >= 0 ? "up" : "down"}
        />
      </div>

      {/* Detailed metrics (shown when detailed view is enabled) */}
      {showDetailedView && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Asset Allocation:</span>
              <div className="font-medium">{((portfolio.totalValue - portfolio.cash) / portfolio.totalValue * 100).toFixed(1)}% Invested</div>
            </div>
            <div>
              <span className="text-gray-600">Cash Ratio:</span>
              <div className="font-medium">{(portfolio.cash / portfolio.totalValue * 100).toFixed(1)}% Cash</div>
            </div>
            <div>
              <span className="text-gray-600">Portfolio Beta:</span>
              <div className="font-medium">1.2</div>
            </div>
            <div>
              <span className="text-gray-600">Risk Level:</span>
              <div className="font-medium text-orange-600">Moderate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FastPositionsList() {
  const { data: portfolio, isLoading } = usePortfolio();
  const [sortBy, setSortBy] = useState<'symbol' | 'value' | 'pnl'>('value');
  const [showAll, setShowAll] = useState(false);

  // Enhanced position card with mini candlestick chart
  const PositionCard = ({ position, index }: { position: any, index: number }) => {
    const chartData = generateCandlestickData(position.currentPrice, 14);
    const isProfit = position.unrealizedPnL >= 0;
    
    return (
      <div className="group relative p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-white border-l-4" 
           style={{ borderLeftColor: isProfit ? '#10b981' : '#ef4444' }}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <div>
                <div className="font-semibold text-lg text-gray-900">{position.symbol}</div>
                <div className="text-sm text-gray-600">
                  {position.quantity} shares @ ₹{position.averagePrice.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Current: ₹{position.currentPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mini candlestick chart */}
          <div className="hidden md:block w-20 mx-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <CandlestickChart data={chartData.slice(-7)} height={30} />
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-lg text-gray-900">
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
              {position.unrealizedPnL >= 0 ? '+' : ''}₹{Math.abs(position.unrealizedPnL).toFixed(2)}
              <span className="ml-1 text-xs">
                ({position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent?.toFixed(1) || '0'}%)
              </span>
            </Badge>
          </div>
        </div>
        
        {/* Performance indicator bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${
              isProfit ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ 
              width: `${Math.min(Math.abs(position.unrealizedPnLPercent || 0) * 10, 100)}%` 
            }}
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Your Positions</h4>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg border-l-4 border-l-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                  <div>
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!portfolio || !portfolio.positions.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <PieChart className="h-8 w-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No positions yet</h4>
        <p className="text-gray-600 mb-4">Start trading to see your portfolio here</p>
        <Button variant="outline" size="sm">
          Explore Markets
        </Button>
      </div>
    );
  }

  // Sort positions based on selected criteria
  const sortedPositions = [...portfolio.positions].sort((a, b) => {
    switch (sortBy) {
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'value':
        return b.marketValue - a.marketValue;
      case 'pnl':
        return b.unrealizedPnL - a.unrealizedPnL;
      default:
        return 0;
    }
  });

  const displayPositions = showAll ? sortedPositions : sortedPositions.slice(0, 5);
  const totalPositions = portfolio.positions.length;

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Your Positions</h4>
          <p className="text-sm text-gray-600">{totalPositions} active position{totalPositions !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="value">Sort by Value</option>
            <option value="symbol">Sort by Symbol</option>
            <option value="pnl">Sort by P&L</option>
          </select>
        </div>
      </div>

      {/* Positions grid */}
      <div className="space-y-3">
        {displayPositions.map((position: any, index: number) => (
          <PositionCard key={`${position.symbol}-${index}`} position={position} index={index} />
        ))}
      </div>

      {/* Show more/less button */}
      {totalPositions > 5 && (
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showAll ? 'Show Less' : `Show All ${totalPositions} Positions`}
          </Button>
        </div>
      )}

      {/* Summary stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              ₹{portfolio.positions.reduce((sum: number, pos: any) => sum + pos.marketValue, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Value</div>
          </div>
          <div className="text-center">
            <div className={`font-semibold ${
              portfolio.positions.reduce((sum: number, pos: any) => sum + pos.unrealizedPnL, 0) >= 0 
                ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{portfolio.positions.reduce((sum: number, pos: any) => sum + pos.unrealizedPnL, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Unrealized P&L</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{totalPositions}</div>
            <div className="text-gray-600">Active Positions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
