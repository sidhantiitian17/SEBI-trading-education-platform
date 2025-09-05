"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface OrderBookEntry {
  price: number;
  quantity: number;
  type: 'bid' | 'ask';
}

interface HFTSimulatorProps {
  scenario?: 'market-making' | 'arbitrage' | 'momentum' | 'order-flow';
}

export function HFTSimulator({ scenario = 'market-making' }: HFTSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pnl, setPnl] = useState(0);
  const [trades, setTrades] = useState(0);
  const [orderBook, setOrderBook] = useState<OrderBookEntry[]>([]);
  const [lastTrade, setLastTrade] = useState<{ price: number; quantity: number; timestamp: Date } | null>(null);

  // Initialize order book
  useEffect(() => {
    const initialBids: OrderBookEntry[] = [];
    const initialAsks: OrderBookEntry[] = [];

    for (let i = 0; i < 10; i++) {
      initialBids.push({
        price: 100 - i * 0.1,
        quantity: Math.floor(Math.random() * 100) + 10,
        type: 'bid'
      });
      initialAsks.push({
        price: 100.1 + i * 0.1,
        quantity: Math.floor(Math.random() * 100) + 10,
        type: 'ask'
      });
    }

    setOrderBook([...initialBids, ...initialAsks]);
  }, []);

  // Simulate HFT activity
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Simulate market movements
      setOrderBook(prev => {
        const newBook = prev.map(entry => ({
          ...entry,
          quantity: Math.max(0, entry.quantity + (Math.random() - 0.5) * 20)
        }));

        // Add some HFT trades
        if (Math.random() < 0.3) { // 30% chance of trade
          const bidIndex = Math.floor(Math.random() * 10);
          const askIndex = 10 + Math.floor(Math.random() * 10);

          if (newBook[bidIndex] && newBook[askIndex]) {
            const tradePrice = (newBook[bidIndex].price + newBook[askIndex].price) / 2;
            const tradeQuantity = Math.min(
              newBook[bidIndex].quantity,
              newBook[askIndex].quantity,
              Math.floor(Math.random() * 50) + 1
            );

            // Update quantities
            newBook[bidIndex].quantity -= tradeQuantity;
            newBook[askIndex].quantity -= tradeQuantity;

            // Record trade
            setLastTrade({
              price: tradePrice,
              quantity: tradeQuantity,
              timestamp: new Date()
            });

            setTrades(prev => prev + 1);

            // Update P&L based on scenario
            if (scenario === 'market-making') {
              setPnl(prev => prev + (tradePrice - 100) * tradeQuantity * 0.001); // Small spread capture
            }
          }
        }

        return newBook;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, scenario]);

  const reset = () => {
    setIsRunning(false);
    setPnl(0);
    setTrades(0);
    setLastTrade(null);
    // Reinitialize order book
    const initialBids: OrderBookEntry[] = [];
    const initialAsks: OrderBookEntry[] = [];

    for (let i = 0; i < 10; i++) {
      initialBids.push({
        price: 100 - i * 0.1,
        quantity: Math.floor(Math.random() * 100) + 10,
        type: 'bid'
      });
      initialAsks.push({
        price: 100.1 + i * 0.1,
        quantity: Math.floor(Math.random() * 100) + 10,
        type: 'ask'
      });
    }

    setOrderBook([...initialBids, ...initialAsks]);
  };

  const bids = orderBook.filter(entry => entry.type === 'bid').slice(0, 10);
  const asks = orderBook.filter(entry => entry.type === 'ask').slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            HFT Simulator - {scenario.replace('-', ' ').toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm">Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{pnl.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">P&L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{trades}</div>
              <div className="text-sm text-muted-foreground">Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {lastTrade ? lastTrade.price.toFixed(2) : '--'}
              </div>
              <div className="text-sm text-muted-foreground">Last Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {lastTrade ? lastTrade.quantity : '--'}
              </div>
              <div className="text-sm text-muted-foreground">Last Qty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Book */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bids */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {bids.map((bid, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-mono">{bid.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(bid.quantity / 200) * 100}
                      className="w-16 h-2"
                    />
                    <span className="text-sm">{bid.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
              Asks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {asks.map((ask, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-mono">{ask.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(ask.quantity / 200) * 100}
                      className="w-16 h-2"
                    />
                    <span className="text-sm">{ask.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Explanation */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-semibold">Current Scenario: {scenario.replace('-', ' ').toUpperCase()}</h4>
            <p className="text-sm text-muted-foreground">
              {scenario === 'market-making' && 'Providing liquidity by continuously quoting bid and ask prices, profiting from the spread.'}
              {scenario === 'arbitrage' && 'Exploiting price differences between related securities or markets.'}
              {scenario === 'momentum' && 'Detecting and following short-term price trends in the market.'}
              {scenario === 'order-flow' && 'Analyzing the flow of buy and sell orders to predict price movements.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
