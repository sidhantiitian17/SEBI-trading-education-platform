"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, Square, Activity, DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface LiveAlgoTradingProps {
  activeStrategies: string[]
}

const liveStrategies = [
  {
    id: "rsi_mean_reversion",
    name: "RSI Mean Reversion",
    status: "running",
    pnl: 1250.75,
    pnlPercent: 2.5,
    trades: 23,
    lastTrade: "2 min ago",
    allocation: 25000,
  },
  {
    id: "momentum_breakout",
    name: "Momentum Breakout",
    status: "paused",
    pnl: -340.25,
    pnlPercent: -0.7,
    trades: 8,
    lastTrade: "1 hour ago",
    allocation: 50000,
  },
]

const recentTrades = [
  {
    id: 1,
    strategy: "RSI Mean Reversion",
    symbol: "AAPL",
    side: "BUY",
    quantity: 100,
    price: 175.25,
    time: "10:32:15",
    pnl: 125.5,
  },
  {
    id: 2,
    strategy: "RSI Mean Reversion",
    side: "SELL",
    symbol: "MSFT",
    quantity: 50,
    price: 378.9,
    time: "10:28:42",
    pnl: -45.2,
  },
  {
    id: 3,
    strategy: "Momentum Breakout",
    symbol: "GOOGL",
    side: "BUY",
    quantity: 25,
    price: 138.45,
    time: "09:45:18",
    pnl: 78.3,
  },
]

export function LiveAlgoTrading({ activeStrategies }: LiveAlgoTradingProps) {
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false)

  const totalPnL = liveStrategies.reduce((sum, strategy) => sum + strategy.pnl, 0)
  const totalTrades = liveStrategies.reduce((sum, strategy) => sum + strategy.trades, 0)

  const handleStrategyToggle = (strategyId: string, action: "start" | "pause" | "stop") => {
    console.log(`${action} strategy:`, strategyId)
    // Here you would implement the actual strategy control logic
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Algorithmic Trading
          </CardTitle>
          <CardDescription>Monitor and control your live trading strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Paper Trading Mode:</strong> All trades are simulated with virtual money for educational purposes.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">Auto Trading</div>
              <Switch checked={autoTradingEnabled} onCheckedChange={setAutoTradingEnabled} />
            </div>
            <Badge variant={autoTradingEnabled ? "default" : "secondary"}>
              {autoTradingEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total P&L Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{liveStrategies.filter((s) => s.status === "running").length}</div>
            <div className="text-sm text-muted-foreground">Active Strategies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{totalTrades}</div>
            <div className="text-sm text-muted-foreground">Trades Today</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Performance</CardTitle>
          <CardDescription>Monitor your live trading strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveStrategies.map((strategy) => (
              <div key={strategy.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{strategy.name}</h4>
                    <Badge variant={strategy.status === "running" ? "default" : "secondary"}>{strategy.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStrategyToggle(strategy.id, strategy.status === "running" ? "pause" : "start")
                      }
                    >
                      {strategy.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStrategyToggle(strategy.id, "stop")}>
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">P&L</div>
                    <div className={`font-semibold ${strategy.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {strategy.pnl >= 0 ? "+" : ""}${strategy.pnl.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">P&L %</div>
                    <div className={`font-semibold ${strategy.pnlPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {strategy.pnlPercent >= 0 ? "+" : ""}
                      {strategy.pnlPercent}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Trades</div>
                    <div className="font-semibold">{strategy.trades}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last Trade</div>
                    <div className="font-semibold">{strategy.lastTrade}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Allocation</div>
                    <div className="font-semibold">${strategy.allocation.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Latest algorithmic trades executed</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.time}</TableCell>
                  <TableCell>{trade.strategy}</TableCell>
                  <TableCell className="font-semibold">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.side === "BUY" ? "default" : "outline"}>
                      {trade.side === "BUY" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {trade.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{trade.quantity}</TableCell>
                  <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
