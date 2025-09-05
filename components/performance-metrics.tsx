"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react"

const metrics = [
  {
    title: "Total Return",
    value: "+4.9%",
    description: "Since inception",
    icon: TrendingUp,
    positive: true,
  },
  {
    title: "Annualized Return",
    value: "+12.3%",
    description: "Based on current performance",
    icon: BarChart3,
    positive: true,
  },
  {
    title: "Max Drawdown",
    value: "-2.1%",
    description: "Largest peak-to-trough decline",
    icon: TrendingDown,
    positive: false,
  },
  {
    title: "Sharpe Ratio",
    value: "1.45",
    description: "Risk-adjusted returns",
    icon: Target,
    positive: true,
  },
]

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key statistics about your portfolio performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-4 border rounded-lg">
              <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.positive ? "text-chart-2" : "text-chart-4"}`} />
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm font-medium mb-1">{metric.title}</div>
              <div className="text-xs text-muted-foreground">{metric.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
