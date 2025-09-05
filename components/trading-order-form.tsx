'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';
import { Order, StockData } from '@/lib/types';

interface TradingOrderFormProps {
  selectedSymbol?: string;
  onOrderPlaced?: (order: Order) => void;
}

export default function TradingOrderForm({ selectedSymbol, onOrderPlaced }: TradingOrderFormProps) {
  const { portfolio, marketData, placeOrder, isLoading } = useTrading();

  const [symbol, setSymbol] = useState(selectedSymbol || '');
  const [type, setType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedStock = marketData?.find((stock: StockData) => stock.symbol === symbol);
  const currentPrice = selectedStock?.price || 0;
  const position = portfolio?.positions.find(p => p.symbol === symbol);

  useEffect(() => {
    if (selectedSymbol) {
      setSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  useEffect(() => {
    if (type === 'market' && currentPrice) {
      setPrice(currentPrice.toString());
    }
  }, [type, currentPrice]);

  const calculateTotal = () => {
    const qty = parseInt(quantity) || 0;
    const prc = parseFloat(price) || currentPrice;
    return qty * prc;
  };

  const calculateEstimatedFees = () => {
    return calculateTotal() * 0.0005; // 0.05% brokerage
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!symbol || !quantity || !price) {
      setError('Please fill in all required fields');
      return;
    }

    const qty = parseInt(quantity);
    const prc = parseFloat(price);

    if (qty <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (prc <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    // Check if user has enough cash for buy orders
    if (side === 'buy' && portfolio && calculateTotal() + calculateEstimatedFees() > portfolio.cash) {
      setError('Insufficient funds');
      return;
    }

    // Check if user has enough shares for sell orders
    if (side === 'sell' && position && qty > position.quantity) {
      setError('Insufficient shares');
      return;
    }

    try {
      await placeOrder({
        symbol,
        type,
        side,
        quantity: qty,
        price: prc,
      });

      setSuccess(`Order placed successfully! ${side.toUpperCase()} ${qty} shares of ${symbol}`);
      setQuantity('');
      setPrice(type === 'market' ? currentPrice.toString() : '');

      // Note: Since placeOrder doesn't return the order, we don't call onOrderPlaced
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    }
  };

  const getMaxQuantity = () => {
    if (side === 'buy') {
      return portfolio ? Math.floor(portfolio.cash / (parseFloat(price) || currentPrice)) : 0;
    } else {
      return position?.quantity || 0;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Place Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Symbol Selection */}
          <div className="space-y-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stock" />
              </SelectTrigger>
              <SelectContent>
                {marketData?.map((stock: StockData) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>{stock.symbol}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">₹{stock.price.toFixed(2)}</span>
                        <Badge
                          variant={stock.change >= 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Order Type</Label>
            <Select value={type} onValueChange={(value: 'market' | 'limit') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Order</SelectItem>
                <SelectItem value="limit">Limit Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buy/Sell Toggle */}
          <div className="space-y-2">
            <Label>Order Side</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={side === 'buy' ? 'default' : 'outline'}
                onClick={() => setSide('buy')}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Buy
              </Button>
              <Button
                type="button"
                variant={side === 'sell' ? 'default' : 'outline'}
                onClick={() => setSide('sell')}
                className="flex-1"
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Sell
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={getMaxQuantity()}
            />
            <div className="text-xs text-muted-foreground">
              Max: {getMaxQuantity()} shares
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              disabled={type === 'market'}
            />
            {type === 'market' && (
              <div className="text-xs text-muted-foreground">
                Market price: ₹{currentPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {quantity && price && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Value:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estimated Fees:</span>
                <span>₹{calculateEstimatedFees().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Total Cost:</span>
                <span>₹{(calculateTotal() + calculateEstimatedFees()).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !symbol || !quantity || !price}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              `Place ${side.toUpperCase()} Order`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
