'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';

export function PortfolioOverview() {
  const { portfolio } = useTrading();

  if (!portfolio) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading portfolio...</p>
      </div>
    );
  }

  const investedAmount = portfolio.totalValue - portfolio.cash;
  const totalReturn = portfolio.performance.totalReturn;
  const totalReturnPercent = portfolio.performance.totalReturnPercent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold">₹{portfolio.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
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
            <PieChart className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Invested</p>
              <p className="text-2xl font-bold">₹{investedAmount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {totalReturnPercent >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <div>
              <p className="text-sm font-medium">Total Return</p>
              <div className="flex items-center gap-2">
                <p className={`text-xl font-bold ${
                  totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{totalReturn.toFixed(2)}
                </p>
                <Badge variant={totalReturnPercent >= 0 ? 'default' : 'destructive'}>
                  {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PositionsList() {
  const { portfolio } = useTrading();

  if (!portfolio || portfolio.positions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No positions in your portfolio</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {portfolio.positions.map((position) => (
            <div key={position.symbol} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{position.symbol}</h3>
                <p className="text-sm text-muted-foreground">
                  {position.quantity} shares @ ₹{position.averagePrice.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{position.marketValue.toFixed(2)}</p>
                <div className="flex items-center gap-1">
                  {position.unrealizedPnL >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <Badge variant={position.unrealizedPnL >= 0 ? 'default' : 'destructive'}>
                    {position.unrealizedPnL >= 0 ? '+' : ''}₹{position.unrealizedPnL.toFixed(2)}
                    ({position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%)
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioDashboard() {
  return (
    <div className="space-y-6">
      <PortfolioOverview />
      <PositionsList />
    </div>
  );
}
