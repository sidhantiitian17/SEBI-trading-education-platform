"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

const indices = [
  { name: "S&P 500", symbol: "SPX", value: 4567.89, change: 36.45, changePercent: 0.8, positive: true },
  { name: "NASDAQ Composite", symbol: "IXIC", value: 14234.56, change: -42.78, changePercent: -0.3, positive: false },
  { name: "Dow Jones", symbol: "DJI", value: 35678.9, change: 178.23, changePercent: 0.5, positive: true },
  { name: "Russell 2000", symbol: "RUT", value: 1987.45, change: 12.34, changePercent: 0.6, positive: true },
  { name: "VIX", symbol: "VIX", value: 18.45, change: -1.23, changePercent: -6.3, positive: false },
  { name: "10-Year Treasury", symbol: "TNX", value: 4.25, change: 0.05, changePercent: 1.2, positive: true },
]

export function MarketIndices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Market Indices
        </CardTitle>
        <CardDescription>Major market indices and key indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indices.map((index) => (
            <div key={index.symbol} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{index.symbol}</h3>
                  <p className="text-xs text-muted-foreground">{index.name}</p>
                </div>
                <Badge variant={index.positive ? "default" : "destructive"} className="text-xs">
                  {index.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {index.changePercent > 0 ? "+" : ""}
                  {index.changePercent}%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold">{index.value.toLocaleString()}</p>
                <p className={`text-sm ${index.positive ? "text-green-600" : "text-red-600"}`}>
                  {index.change > 0 ? "+" : ""}
                  {index.change.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
