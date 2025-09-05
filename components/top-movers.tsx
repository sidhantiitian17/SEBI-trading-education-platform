"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

const gainers = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 875.3, change: 45.67, changePercent: 5.5 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 165.45, change: 7.89, changePercent: 5.0 },
  { symbol: "TSLA", name: "Tesla Inc", price: 248.9, change: 11.23, changePercent: 4.7 },
  { symbol: "AAPL", name: "Apple Inc", price: 175.25, change: 7.45, changePercent: 4.4 },
  { symbol: "GOOGL", name: "Alphabet Inc", price: 138.45, change: 5.67, changePercent: 4.3 },
]

const losers = [
  { symbol: "META", name: "Meta Platforms", price: 298.5, change: -18.45, changePercent: -5.8 },
  { symbol: "NFLX", name: "Netflix Inc", price: 445.2, change: -22.3, changePercent: -4.8 },
  { symbol: "AMZN", name: "Amazon.com Inc", price: 145.8, change: -6.75, changePercent: -4.4 },
  { symbol: "MSFT", name: "Microsoft Corp", price: 378.9, change: -15.6, changePercent: -4.0 },
  { symbol: "CRM", name: "Salesforce Inc", price: 234.15, change: -9.25, changePercent: -3.8 },
]

const mostActive = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF", volume: "125.6M", price: 428.5, change: 1.2 },
  { symbol: "QQQ", name: "Invesco QQQ Trust", volume: "89.3M", price: 367.8, change: -0.8 },
  { symbol: "AAPL", name: "Apple Inc", volume: "67.8M", price: 175.25, change: 4.4 },
  { symbol: "TSLA", name: "Tesla Inc", volume: "54.2M", price: 248.9, change: 4.7 },
  { symbol: "NVDA", name: "NVIDIA Corp", volume: "45.9M", price: 875.3, change: 5.5 },
]

export function TopMovers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Top Movers
        </CardTitle>
        <CardDescription>Most active stocks and biggest movers today</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
            <TabsTrigger value="active">Most Active</TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="space-y-3 mt-4">
            {gainers.map((stock, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${stock.price}</div>
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />+{stock.changePercent}%
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="losers" className="space-y-3 mt-4">
            {losers.map((stock, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${stock.price}</div>
                  <Badge variant="destructive" className="text-xs">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {stock.changePercent}%
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-3 mt-4">
            {mostActive.map((stock, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${stock.price}</div>
                  <div className="text-xs text-muted-foreground">Vol: {stock.volume}</div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
