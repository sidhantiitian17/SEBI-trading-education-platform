"use client";

import { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, Eye } from 'lucide-react';
import { useMarketData } from '@/hooks/useSWR';

// Mini Candlestick Chart Component for market items
const MiniCandlestickChart = ({ symbol, currentPrice }: { symbol: string, currentPrice: number }) => {
  // Generate mock historical data for the chart
  const generateMarketData = (basePrice: number) => {
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < 10; i++) {
      const variation = (Math.random() - 0.5) * basePrice * 0.015; // ±1.5% variation
      const open = price;
      const close = price + variation;
      const high = Math.max(open, close) + Math.random() * basePrice * 0.008;
      const low = Math.min(open, close) - Math.random() * basePrice * 0.008;
      
      data.push({ open, high, low, close });
      price = close;
    }
    
    return data;
  };

  const data = generateMarketData(currentPrice);
  const maxPrice = Math.max(...data.map(d => Math.max(d.high, d.open, d.close, d.low)));
  const minPrice = Math.min(...data.map(d => Math.min(d.high, d.open, d.close, d.low)));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="w-16 h-8">
      <svg width="100%" height="100%" className="overflow-visible">
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
                strokeWidth="0.5"
              />
              {/* Body */}
              <rect
                x={`${x - 2}%`}
                y={`${bodyTop}%`}
                width="4%"
                height={`${Math.max(bodyHeight, 2)}%`}
                fill={isGreen ? "#10b981" : "#ef4444"}
                opacity={0.7}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Enhanced market item component with better visual design
const MarketItem = memo(({ symbol, price, change, changePercent }: any) => {
  const [showChart, setShowChart] = useState(false);
  const isPositive = change >= 0;
  
  return (
    <div 
      className="group flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onMouseEnter={() => setShowChart(true)}
      onMouseLeave={() => setShowChart(false)}
    >
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        
        <div>
          <div className="font-semibold text-gray-900">{symbol}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isPositive ? (
              <TrendingUp className="inline h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="inline h-3 w-3 text-red-600" />
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              ₹{Math.abs(change).toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Mini chart - shown on hover */}
        <div className={`transition-all duration-200 ${showChart ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <MiniCandlestickChart symbol={symbol} currentPrice={price} />
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            ₹{price.toFixed(2)}
          </div>
          <Badge 
            variant={isPositive ? "default" : "destructive"}
            className={`text-xs ${
              isPositive 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
          </Badge>
        </div>
      </div>
    </div>
  );
});

MarketItem.displayName = 'MarketItem';

// Enhanced skeleton with better visual feedback
const MarketSkeleton = memo(() => (
  <div className="space-y-4">
    <div className="flex items-center justify-between p-4">
      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-gray-100 rounded animate-pulse" />
          <div className="text-right">
            <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
));

MarketSkeleton.displayName = 'MarketSkeleton';

export const FastMarketWatch = memo(() => {
  const { data: marketData, isLoading, error, mutate } = useMarketData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900">Market Watch</CardTitle>
            <Badge variant="secondary" className="animate-pulse">Loading...</Badge>
          </div>
          <p className="text-sm text-gray-600">Real-time market data with trends</p>
        </CardHeader>
        <CardContent className="p-0">
          <MarketSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-fit border-red-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-gray-900">Market Watch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <div className="text-red-600 font-medium mb-2">Failed to load market data</div>
            <p className="text-red-500 text-sm mb-4">Unable to fetch real-time prices</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketData || !marketData.indices) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-gray-900">Market Watch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <div className="font-medium text-gray-900 mb-2">No market data available</div>
            <p className="text-gray-600 text-sm">Please check your connection and try again</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = marketData.indices?.length || 0;
  const gainers = marketData.indices?.filter((item: any) => item.change > 0).length || 0;
  const losers = marketData.indices?.filter((item: any) => item.change < 0).length || 0;

  return (
    <Card className="h-fit shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900">Market Watch</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Live market data with candlestick trends</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Badge variant="secondary" className="text-xs animate-pulse">
              Live
            </Badge>
          </div>
        </div>
        
        {/* Market summary */}
        <div className="flex items-center gap-4 text-sm mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-600">Gainers: </span>
            <span className="font-medium text-green-600">{gainers}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-gray-600">Losers: </span>
            <span className="font-medium text-red-600">{losers}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span className="text-gray-600">Total: </span>
            <span className="font-medium text-gray-700">{totalItems}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {marketData.indices.map((item: any, index: number) => (
            <MarketItem
              key={`${item.symbol}-${index}`}
              symbol={item.symbol}
              price={item.price}
              change={item.change}
              changePercent={item.changePercent}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

FastMarketWatch.displayName = 'FastMarketWatch';
