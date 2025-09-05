"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Plus, CheckCircle, Clock } from "lucide-react"

const goals = [
  {
    id: 1,
    title: "Complete Risk Assessment Module",
    description: "Finish all lessons and quizzes in risk management",
    progress: 60,
    deadline: "2024-02-01",
    priority: "high",
    status: "active",
  },
  {
    id: 2,
    title: "Achieve 90% Quiz Average",
    description: "Maintain high performance across all quizzes",
    progress: 85,
    deadline: "2024-01-25",
    priority: "medium",
    status: "active",
  },
  {
    id: 3,
    title: "Make First Virtual Trade",
    description: "Execute your first trade in the simulator",
    progress: 0,
    deadline: "2024-01-30",
    priority: "low",
    status: "pending",
  },
]

export function LearningGoals() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Target className="h-5 w-5 text-primary" />
              Learning Goals
            </CardTitle>
            <CardDescription>Set and track your learning objectives</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-3 p-3 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm">{goal.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{goal.description}</div>
              </div>
              <Badge
                variant={
                  goal.priority === "high" ? "destructive" : goal.priority === "medium" ? "secondary" : "outline"
                }
                className="text-xs"
              >
                {goal.priority}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-1.5" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                Due {new Date(goal.deadline).toLocaleDateString()}
              </div>
              {goal.progress === 100 && <CheckCircle className="h-3 w-3 text-chart-2" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
