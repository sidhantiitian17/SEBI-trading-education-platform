import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const marketData = [
  { symbol: "SPY", name: "S&P 500 ETF", price: "$428.50", change: "+1.2%", positive: true },
  { symbol: "QQQ", name: "NASDAQ ETF", price: "$367.80", change: "-0.8%", positive: false },
  { symbol: "AAPL", name: "Apple Inc.", price: "$175.25", change: "+2.1%", positive: true },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$248.90", change: "-1.5%", positive: false },
]

export function MarketOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <TrendingUp className="h-5 w-5 text-primary" />
          Market Overview
        </CardTitle>
        <CardDescription>Live market data for learning (15min delayed)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {marketData.map((stock, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-semibold text-sm">{stock.symbol}</div>
              <div className="text-xs text-muted-foreground">{stock.name}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{stock.price}</div>
              <Badge variant={stock.positive ? "default" : "destructive"} className="text-xs">
                {stock.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stock.change}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
