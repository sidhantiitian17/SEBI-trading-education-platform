"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, Globe, Clock } from "lucide-react"

export function MarketHeader() {
  const marketStatus = {
    isOpen: true,
    nextClose: "4:00 PM EST",
    timezone: "Eastern Time",
  }

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary">Market Center</h1>
            <p className="text-muted-foreground">Real-time market data and analysis</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{marketStatus.timezone}</span>
            </div>
            <Badge variant={marketStatus.isOpen ? "default" : "secondary"} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? "bg-green-500" : "bg-red-500"}`} />
              {marketStatus.isOpen ? "Market Open" : "Market Closed"}
            </Badge>
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              Global Markets
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">S&P 500</p>
                  <p className="text-2xl font-bold">4,567.89</p>
                </div>
                <Badge variant="default" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.8%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">NASDAQ</p>
                  <p className="text-2xl font-bold">14,234.56</p>
                </div>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -0.3%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dow Jones</p>
                  <p className="text-2xl font-bold">35,678.90</p>
                </div>
                <Badge variant="default" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.5%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">VIX</p>
                  <p className="text-2xl font-bold">18.45</p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Low Vol
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
