"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3 } from "lucide-react"

const heatmapData = [
  { symbol: "AAPL", change: 4.4, size: "large" },
  { symbol: "MSFT", change: -4.0, size: "large" },
  { symbol: "GOOGL", change: 4.3, size: "medium" },
  { symbol: "AMZN", change: -4.4, size: "medium" },
  { symbol: "TSLA", change: 4.7, size: "medium" },
  { symbol: "META", change: -5.8, size: "medium" },
  { symbol: "NVDA", change: 5.5, size: "small" },
  { symbol: "AMD", change: 5.0, size: "small" },
  { symbol: "NFLX", change: -4.8, size: "small" },
  { symbol: "CRM", change: -3.8, size: "small" },
  { symbol: "ORCL", change: 2.1, size: "small" },
  { symbol: "ADBE", change: -1.2, size: "small" },
]

export function MarketHeatmap() {
  const getColorClass = (change: number) => {
    if (change > 3) return "bg-green-500 text-white"
    if (change > 1) return "bg-green-400 text-white"
    if (change > 0) return "bg-green-200 text-green-800"
    if (change > -1) return "bg-red-200 text-red-800"
    if (change > -3) return "bg-red-400 text-white"
    return "bg-red-500 text-white"
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large":
        return "col-span-2 row-span-2 text-lg"
      case "medium":
        return "col-span-2 text-base"
      default:
        return "text-sm"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-primary" />
          Market Heatmap
        </CardTitle>
        <CardDescription>Visual representation of stock performance by market cap</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2 h-80">
          {heatmapData.map((stock, index) => (
            <div
              key={index}
              className={`
                ${getSizeClass(stock.size)}
                ${getColorClass(stock.change)}
                rounded-lg p-3 flex flex-col justify-center items-center
                hover:scale-105 transition-transform cursor-pointer
              `}
            >
              <div className="font-bold">{stock.symbol}</div>
              <div className="text-xs opacity-90">
                {stock.change > 0 ? "+" : ""}
                {stock.change}%
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Strong Gains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Moderate Gains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span>Moderate Losses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Strong Losses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
