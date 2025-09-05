"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, TrendingDown, Play, Calendar, DollarSign, Target, AlertTriangle } from "lucide-react"

interface BacktestResultsProps {
  strategy: string | null
  isRunning: boolean
  onRunBacktest: () => void
}

export function BacktestResults({ strategy, isRunning, onRunBacktest }: BacktestResultsProps) {
  const [backtestProgress, setBacktestProgress] = useState(0)
  const [backtestComplete, setBacktestComplete] = useState(false)

  useEffect(() => {
    if (isRunning) {
      setBacktestComplete(false)
      const interval = setInterval(() => {
        setBacktestProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setBacktestComplete(true)
            return 100
          }
          return prev + 10
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isRunning])

  const backtestResults = {
    totalReturn: 15.3,
    annualizedReturn: 12.8,
    volatility: 18.5,
    sharpeRatio: 0.69,
    maxDrawdown: 22.1,
    winRate: 62,
    totalTrades: 89,
    profitFactor: 1.45,
    avgWin: 3.2,
    avgLoss: -2.1,
    largestWin: 12.5,
    largestLoss: -8.3,
  }

  const monthlyReturns = [
    { month: "Jan", return: 2.1 },
    { month: "Feb", return: -1.5 },
    { month: "Mar", return: 3.8 },
    { month: "Apr", return: 1.2 },
    { month: "May", return: -0.8 },
    { month: "Jun", return: 4.5 },
    { month: "Jul", return: 2.3 },
    { month: "Aug", return: -2.1 },
    { month: "Sep", return: 1.9 },
    { month: "Oct", return: 3.2 },
    { month: "Nov", return: 0.7 },
    { month: "Dec", return: 1.8 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Backtesting Engine
          </CardTitle>
          <CardDescription>Test your strategies against historical market data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select defaultValue="1y">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last 1 Year</SelectItem>
                  <SelectItem value="2y">Last 2 Years</SelectItem>
                  <SelectItem value="5y">Last 5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Capital</label>
              <Select defaultValue="100000">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">$10,000</SelectItem>
                  <SelectItem value="50000">$50,000</SelectItem>
                  <SelectItem value="100000">$100,000</SelectItem>
                  <SelectItem value="500000">$500,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Commission</label>
              <Select defaultValue="0.1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">$0 (No Commission)</SelectItem>
                  <SelectItem value="0.1">0.1% per trade</SelectItem>
                  <SelectItem value="1">$1 per trade</SelectItem>
                  <SelectItem value="5">$5 per trade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!strategy ? (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                Select a strategy from the Strategy Builder or Library to run a backtest.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  Ready to backtest strategy: <strong>{strategy}</strong>
                </AlertDescription>
              </Alert>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Running backtest...</span>
                    <span>{backtestProgress}%</span>
                  </div>
                  <Progress value={backtestProgress} className="h-2" />
                </div>
              )}

              <Button onClick={onRunBacktest} disabled={isRunning} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running Backtest..." : "Run Backtest"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {backtestComplete && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trades">Trade Analysis</TabsTrigger>
            <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-green-600">+{backtestResults.totalReturn}%</div>
                  <div className="text-sm text-muted-foreground">Total Return</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{backtestResults.annualizedReturn}%</div>
                  <div className="text-sm text-muted-foreground">Annualized Return</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{backtestResults.sharpeRatio}</div>
                  <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold text-red-600">-{backtestResults.maxDrawdown}%</div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>Portfolio value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Interactive Equity Curve Chart</p>
                    <p className="text-sm text-muted-foreground">Shows portfolio growth over the backtest period</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Return</span>
                    <Badge variant="default">+{backtestResults.totalReturn}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Annualized Return</span>
                    <span className="font-medium">{backtestResults.annualizedReturn}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volatility</span>
                    <span className="font-medium">{backtestResults.volatility}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sharpe Ratio</span>
                    <span className="font-medium">{backtestResults.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Drawdown</span>
                    <Badge variant="destructive">-{backtestResults.maxDrawdown}%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {monthlyReturns.map((month) => (
                      <div key={month.month} className="text-center p-2 rounded">
                        <div className="text-xs text-muted-foreground">{month.month}</div>
                        <div className={`text-sm font-medium ${month.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {month.return >= 0 ? "+" : ""}
                          {month.return}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{backtestResults.totalTrades}</div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{backtestResults.winRate}%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{backtestResults.profitFactor}</div>
                  <div className="text-sm text-muted-foreground">Profit Factor</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Trade Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Average Win</span>
                  <span className="font-medium text-green-600">+{backtestResults.avgWin}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Loss</span>
                  <span className="font-medium text-red-600">{backtestResults.avgLoss}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Largest Win</span>
                  <span className="font-medium text-green-600">+{backtestResults.largestWin}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Largest Loss</span>
                  <span className="font-medium text-red-600">{backtestResults.largestLoss}%</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Risk Analysis
                </CardTitle>
                <CardDescription>Comprehensive risk assessment of the strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Drawdown Analysis</h4>
                    <div className="flex justify-between">
                      <span>Maximum Drawdown</span>
                      <Badge variant="destructive">-{backtestResults.maxDrawdown}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Drawdown</span>
                      <span className="font-medium">-8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recovery Time</span>
                      <span className="font-medium">45 days</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Risk Metrics</h4>
                    <div className="flex justify-between">
                      <span>Value at Risk (95%)</span>
                      <span className="font-medium">-3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conditional VaR</span>
                      <span className="font-medium">-5.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beta</span>
                      <span className="font-medium">0.85</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
