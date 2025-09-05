"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, PieChart } from "lucide-react"

const sectors = [
  { name: "Technology", change: 2.4, positive: true, volume: 85 },
  { name: "Healthcare", change: 1.8, positive: true, volume: 72 },
  { name: "Financial Services", change: 1.2, positive: true, volume: 68 },
  { name: "Consumer Cyclical", change: 0.9, positive: true, volume: 61 },
  { name: "Communication Services", change: 0.3, positive: true, volume: 45 },
  { name: "Industrials", change: -0.2, positive: false, volume: 38 },
  { name: "Consumer Defensive", change: -0.8, positive: false, volume: 42 },
  { name: "Energy", change: -1.5, positive: false, volume: 55 },
  { name: "Utilities", change: -2.1, positive: false, volume: 28 },
  { name: "Real Estate", change: -2.8, positive: false, volume: 33 },
]

export function SectorPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Sector Performance
        </CardTitle>
        <CardDescription>Today's sector performance and trading volume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sectors.map((sector, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{sector.name}</span>
                  <Badge variant={sector.positive ? "default" : "destructive"} className="text-xs">
                    {sector.positive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {sector.change > 0 ? "+" : ""}
                    {sector.change}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={sector.volume} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground w-8">{sector.volume}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
