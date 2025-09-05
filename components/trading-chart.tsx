"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, BarChart3, Maximize2 } from "lucide-react"

export function TradingChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              AAPL - Apple Inc.
            </CardTitle>
            <CardDescription>Real-time price chart (15min delayed)</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">$175.25</div>
              <Badge variant="default" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +2.15 (+1.24%)
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="1D">
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1D</SelectItem>
              <SelectItem value="5D">5D</SelectItem>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="candlestick">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="candlestick">Candlestick</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          <div className="text-center space-y-2">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Interactive Trading Chart</p>
            <p className="text-sm text-muted-foreground">Real-time price data and technical indicators</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
