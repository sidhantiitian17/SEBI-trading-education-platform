"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const positions = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 50,
    avgCost: 168.5,
    currentPrice: 175.25,
    marketValue: 8762.5,
    totalCost: 8425.0,
    gainLoss: 337.5,
    gainLossPercent: 4.01,
    positive: true,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    shares: 25,
    avgCost: 385.2,
    currentPrice: 378.9,
    marketValue: 9472.5,
    totalCost: 9630.0,
    gainLoss: -157.5,
    gainLossPercent: -1.64,
    positive: false,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 30,
    avgCost: 142.8,
    currentPrice: 138.45,
    marketValue: 4153.5,
    totalCost: 4284.0,
    gainLoss: -130.5,
    gainLossPercent: -3.05,
    positive: false,
  },
]

export function PositionsTable() {
  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0)
  const totalCost = positions.reduce((sum, pos) => sum + pos.totalCost, 0)
  const totalGainLoss = totalValue - totalCost
  const totalGainLossPercent = (totalGainLoss / totalCost) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Positions</CardTitle>
        <CardDescription>Your virtual stock holdings and performance</CardDescription>
        <div className="flex items-center gap-4 pt-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Total Value: </span>
            <span className="font-semibold">${totalValue.toLocaleString()}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Total Gain/Loss: </span>
            <Badge variant={totalGainLoss >= 0 ? "default" : "destructive"}>
              {totalGainLoss >= 0 ? "+" : ""}${totalGainLoss.toFixed(2)} ({totalGainLossPercent >= 0 ? "+" : ""}
              {totalGainLossPercent.toFixed(2)}%)
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Avg Cost</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead className="text-right">Gain/Loss</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.symbol}>
                <TableCell>
                  <div>
                    <div className="font-semibold">{position.symbol}</div>
                    <div className="text-xs text-muted-foreground">{position.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{position.shares}</TableCell>
                <TableCell className="text-right">${position.avgCost.toFixed(2)}</TableCell>
                <TableCell className="text-right">${position.currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">${position.marketValue.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="space-y-1">
                    <div className={`font-semibold ${position.positive ? "text-chart-2" : "text-chart-4"}`}>
                      {position.positive ? "+" : ""}${position.gainLoss.toFixed(2)}
                    </div>
                    <Badge variant={position.positive ? "default" : "destructive"} className="text-xs">
                      {position.positive ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {position.positive ? "+" : ""}
                      {position.gainLossPercent.toFixed(2)}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Minus className="h-3 w-3 mr-1" />
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
