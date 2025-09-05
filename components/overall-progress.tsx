"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, BookOpen, BarChart3, Trophy } from "lucide-react"

const progressData = [
  {
    category: "Stock Market Fundamentals",
    progress: 85,
    completed: 17,
    total: 20,
    icon: BookOpen,
    color: "text-chart-1",
  },
  {
    category: "Risk Assessment",
    progress: 60,
    completed: 12,
    total: 20,
    icon: Target,
    color: "text-chart-2",
  },
  {
    category: "Algorithmic Trading",
    progress: 25,
    completed: 5,
    total: 20,
    icon: BarChart3,
    color: "text-chart-3",
  },
  {
    category: "Portfolio Management",
    progress: 70,
    completed: 14,
    total: 20,
    icon: Trophy,
    color: "text-chart-4",
  },
]

export function OverallProgress() {
  const overallProgress = Math.round(progressData.reduce((sum, item) => sum + item.progress, 0) / progressData.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Target className="h-5 w-5 text-primary" />
          Overall Learning Progress
        </CardTitle>
        <CardDescription>Your progress across all learning modules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-4xl font-bold text-primary">{overallProgress}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
          <Progress value={overallProgress} className="h-4" />
        </div>

        <div className="space-y-4">
          {progressData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="font-medium">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {item.completed}/{item.total}
                  </span>
                  <Badge variant="outline">{item.progress}%</Badge>
                </div>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
