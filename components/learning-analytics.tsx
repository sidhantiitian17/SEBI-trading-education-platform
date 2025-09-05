"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, Calendar, TrendingUp, Brain, Target } from "lucide-react"

const analyticsData = {
  weeklyStats: {
    hoursLearned: 8.5,
    lessonsCompleted: 12,
    quizzesTaken: 5,
    averageScore: 87,
  },
  learningStreak: {
    current: 7,
    longest: 12,
    thisWeek: 5,
  },
  performance: {
    improvement: "+15%",
    strongestArea: "Stock Market Fundamentals",
    focusArea: "Algorithmic Trading",
  },
}

export function LearningAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <BarChart3 className="h-5 w-5 text-primary" />
          Learning Analytics
        </CardTitle>
        <CardDescription>Insights into your learning patterns and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <Clock className="h-5 w-5 text-chart-1 mx-auto mb-2" />
            <div className="text-xl font-bold">{analyticsData.weeklyStats.hoursLearned}h</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>

          <div className="text-center p-3 border rounded-lg">
            <Target className="h-5 w-5 text-chart-2 mx-auto mb-2" />
            <div className="text-xl font-bold">{analyticsData.weeklyStats.lessonsCompleted}</div>
            <div className="text-xs text-muted-foreground">Lessons Done</div>
          </div>

          <div className="text-center p-3 border rounded-lg">
            <Brain className="h-5 w-5 text-chart-3 mx-auto mb-2" />
            <div className="text-xl font-bold">{analyticsData.weeklyStats.quizzesTaken}</div>
            <div className="text-xs text-muted-foreground">Quizzes Taken</div>
          </div>

          <div className="text-center p-3 border rounded-lg">
            <TrendingUp className="h-5 w-5 text-chart-4 mx-auto mb-2" />
            <div className="text-xl font-bold">{analyticsData.weeklyStats.averageScore}%</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Learning Streak</div>
                <div className="text-sm text-muted-foreground">Keep up the momentum!</div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-1">
                {analyticsData.learningStreak.current} days
              </Badge>
              <div className="text-xs text-muted-foreground">Best: {analyticsData.learningStreak.longest} days</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-chart-2" />
              <div>
                <div className="font-medium">Performance Trend</div>
                <div className="text-sm text-muted-foreground">Your scores are improving</div>
              </div>
            </div>
            <Badge variant="default">{analyticsData.performance.improvement}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium text-chart-2 mb-1">Strongest Area</div>
              <div className="text-sm">{analyticsData.performance.strongestArea}</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium text-chart-4 mb-1">Focus Area</div>
              <div className="text-sm">{analyticsData.performance.focusArea}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
