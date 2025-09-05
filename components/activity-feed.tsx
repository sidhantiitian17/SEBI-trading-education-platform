"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Trophy, BarChart3, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "achievement",
    title: "Earned 'Streak Keeper' badge",
    description: "Maintained 7-day learning streak",
    timestamp: "2 hours ago",
    icon: Trophy,
    color: "text-chart-3",
  },
  {
    id: 2,
    type: "quiz",
    title: "Completed Risk Assessment Quiz",
    description: "Scored 92% on advanced risk concepts",
    timestamp: "1 day ago",
    icon: Brain,
    color: "text-chart-1",
  },
  {
    id: 3,
    type: "lesson",
    title: "Finished Portfolio Theory Lesson",
    description: "Modern Portfolio Theory fundamentals",
    timestamp: "2 days ago",
    icon: BookOpen,
    color: "text-chart-2",
  },
  {
    id: 4,
    type: "trade",
    title: "Virtual Trade Executed",
    description: "Bought 50 shares of AAPL at $175.25",
    timestamp: "3 days ago",
    icon: BarChart3,
    color: "text-chart-4",
  },
  {
    id: 5,
    type: "achievement",
    title: "Earned 'Perfect Score' badge",
    description: "Achieved 100% on market basics quiz",
    timestamp: "5 days ago",
    icon: Trophy,
    color: "text-chart-3",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest learning achievements and milestones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <activity.icon className={`h-4 w-4 mt-0.5 ${activity.color}`} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{activity.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{activity.description}</div>
              <div className="text-xs text-muted-foreground mt-2">{activity.timestamp}</div>
            </div>
            <Badge variant="outline" className="text-xs">
              {activity.type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
