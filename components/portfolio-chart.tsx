"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BarChart3 } from "lucide-react"

export function PortfolioChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Portfolio Performance
            </CardTitle>
            <CardDescription>Track your portfolio value over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="1M">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="3M">3M</SelectItem>
                <SelectItem value="6M">6M</SelectItem>
                <SelectItem value="1Y">1Y</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="default" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +4.9%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          <div className="text-center space-y-2">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Portfolio Performance Chart</p>
            <p className="text-sm text-muted-foreground">Historical portfolio value and returns</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
