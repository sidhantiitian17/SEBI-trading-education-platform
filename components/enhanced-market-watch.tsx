"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw, Activity, AlertTriangle, BarChart3, Eye, EyeOff } from 'lucide-react';

// Mini Candlestick Chart Component
const MiniCandlestickChart = memo(({ symbol, currentPrice }: { symbol: string, currentPrice: number }) => {
  // Generate mock historical data for the chart
  const generateMarketData = (basePrice: number) => {
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < 10; i++) {
      const variation = (Math.random() - 0.5) * basePrice * 0.015;
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
              <line
                x1={`${x}%`}
                y1={`${wickTop}%`}
                x2={`${x}%`}
                y2={`${wickBottom}%`}
                stroke={isGreen ? "#10b981" : "#ef4444"}
                strokeWidth="0.5"
              />
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
});

MiniCandlestickChart.displayName = 'MiniCandlestickChart';

// Enhanced market item component
const MarketItem = memo(({ symbol, price, change, changePercent, showChart = false }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = change >= 0;
  
  return (
    <div 
      className="group flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
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
        {/* Mini chart - shown on hover or when enabled */}
        {(showChart || isHovered) && (
          <div className="transition-all duration-200">
            <MiniCandlestickChart symbol={symbol} currentPrice={price} />
          </div>
        )}
        
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

export function EnhancedMarketWatch() {
  const [marketData, setMarketData] = useState([
    { symbol: 'NIFTY 50', price: 21485.20, change: 125.50, changePercent: 0.59 },
    { symbol: 'SENSEX', price: 71186.85, change: -89.30, changePercent: -0.13 },
    { symbol: 'BANK NIFTY', price: 47723.45, change: 234.60, changePercent: 0.49 },
    { symbol: 'IT SECTOR', price: 3421.70, change: 45.20, changePercent: 1.33 },
    { symbol: 'PHARMA INDEX', price: 2887.30, change: -23.10, changePercent: -0.79 }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
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
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Simulate API retry
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdate(new Date());
    }, 1000);
  }, []);

  if (hasError) {
    return (
      <Card className="shadow-sm border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Market Watch
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load market data</h3>
            <p className="text-red-600 mb-4">Unable to fetch real-time prices</p>
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Market Overview
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
              Live
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCharts(!showCharts)}
              className="h-8 w-8 p-0"
            >
              {showCharts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-16 bg-gray-200 rounded mb-1" />
                  <div className="h-4 w-12 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {marketData.map((item, index) => (
              <MarketItem 
                key={`${item.symbol}-${index}`} 
                {...item} 
                showChart={showCharts}
              />
            ))}
          </div>
        )}
        
        {/* Market summary */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Market Status</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 font-medium">Market Open</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
