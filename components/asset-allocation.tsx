"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart } from "lucide-react"

const allocations = [
  { category: "Technology", percentage: 65, value: 34092.5, color: "bg-chart-1" },
  { category: "Healthcare", percentage: 0, value: 0, color: "bg-chart-2" },
  { category: "Financial", percentage: 0, value: 0, color: "bg-chart-3" },
  { category: "Consumer", percentage: 35, value: 18357.5, color: "bg-chart-4" },
  { category: "Energy", percentage: 0, value: 0, color: "bg-chart-5" },
]

export function AssetAllocation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Asset Allocation
        </CardTitle>
        <CardDescription>Portfolio diversification by sector</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allocations.map((allocation) => (
          <div key={allocation.category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{allocation.category}</span>
              <span>{allocation.percentage}%</span>
            </div>
            <Progress value={allocation.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">${allocation.value.toLocaleString()}</div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">Diversification Score</div>
          <div className="flex items-center gap-2">
            <Progress value={35} className="flex-1 h-2" />
            <span className="text-sm font-medium">35/100</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Consider diversifying across more sectors</p>
        </div>
      </CardContent>
    </Card>
  )
}
