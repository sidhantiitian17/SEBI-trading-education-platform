"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Search, Star, StarOff } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';
import { StockData } from '@/lib/types';

interface MarketWatchProps {
  onSymbolSelect?: (symbol: string) => void;
}

export default function MarketWatch({ onSymbolSelect }: MarketWatchProps) {
  const { marketData, watchlist, addToWatchlist, removeFromWatchlist, setSelectedSymbol } = useTrading();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'watchlist' | 'gainers' | 'losers'>('all');

  const filteredStocks = marketData?.filter((stock: StockData) => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (filter) {
      case 'watchlist':
        return watchlist.includes(stock.symbol);
      case 'gainers':
        return stock.changePercent > 0;
      case 'losers':
        return stock.changePercent < 0;
      default:
        return true;
    }
  });

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    if (onSymbolSelect) {
      onSymbolSelect(symbol);
    }
  };

  const toggleWatchlist = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (watchlist.includes(symbol)) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(symbol);
    }
  };

  const getTopMovers = () => {
    if (!marketData) return { gainers: [], losers: [] };

    const sorted = [...marketData].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    const gainers = sorted.filter(stock => stock.changePercent > 0).slice(0, 5);
    const losers = sorted.filter(stock => stock.changePercent < 0).slice(0, 5);

    return { gainers, losers };
  };

  const { gainers, losers } = getTopMovers();

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Market Watch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'watchlist' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('watchlist')}
            >
              Watchlist
            </Button>
            <Button
              variant={filter === 'gainers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('gainers')}
            >
              Gainers
            </Button>
            <Button
              variant={filter === 'losers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('losers')}
            >
              Losers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Movers */}
      {(gainers.length > 0 || losers.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Gainers */}
          {gainers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gainers.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleSymbolClick(stock.symbol)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stock.symbol}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleWatchlist(stock.symbol, e)}
                      >
                        {watchlist.includes(stock.symbol) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                      <div className="text-sm text-green-600">
                        +{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Top Losers */}
          {losers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {losers.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleSymbolClick(stock.symbol)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stock.symbol}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleWatchlist(stock.symbol, e)}
                      >
                        {watchlist.includes(stock.symbol) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                      <div className="text-sm text-red-600">
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stock List */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredStocks?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No stocks found matching your criteria
              </div>
            ) : (
              <div className="divide-y">
                {filteredStocks?.map((stock: StockData) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-4 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleSymbolClick(stock.symbol)}
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleWatchlist(stock.symbol, e)}
                        className="p-1"
                      >
                        {watchlist.includes(stock.symbol) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                      <div className="flex items-center gap-1">
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <Badge
                          variant={stock.change >= 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Vol: {stock.volume.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
