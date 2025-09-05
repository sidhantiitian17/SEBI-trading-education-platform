"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Lock, BookOpen, Clock } from "lucide-react"

interface TutorialNavigationProps {
  slug: string
}

const navigationData = {
  "stock-market-fundamentals": {
    title: "Stock Market Fundamentals",
    progress: 37.5,
    estimatedTime: "32 min remaining",
    lessons: [
      { id: 1, title: "What is the Stock Market?", completed: true, current: false },
      { id: 2, title: "Types of Stocks", completed: true, current: false },
      { id: 3, title: "Market Orders vs Limit Orders", completed: false, current: true },
      { id: 4, title: "Reading Stock Quotes", completed: false, current: false },
      { id: 5, title: "Market Hours & Trading Sessions", completed: false, current: false },
      { id: 6, title: "Bull vs Bear Markets", completed: false, current: false },
      { id: 7, title: "Market Indices Explained", completed: false, current: false },
      { id: 8, title: "Getting Started Checklist", completed: false, current: false },
    ],
  },
}

export function TutorialNavigation({ slug }: TutorialNavigationProps) {
  const data = navigationData[slug as keyof typeof navigationData]

  if (!data) {
    return <div>Navigation not available</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Course Progress</CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{data.progress}%</span>
            </div>
            <Progress value={data.progress} className="h-3" />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {data.estimatedTime}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-serif">
            <BookOpen className="h-5 w-5 text-primary" />
            Lessons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.lessons.map((lesson) => (
            <Button
              key={lesson.id}
              variant={lesson.current ? "default" : "ghost"}
              className="w-full justify-start h-auto p-3"
              disabled={!lesson.completed && !lesson.current}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {lesson.completed ? (
                    <CheckCircle className="h-4 w-4 text-chart-2" />
                  ) : lesson.current ? (
                    <Circle className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground">Lesson {lesson.id}</div>
                </div>
                {lesson.current && (
                  <Badge variant="secondary" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Take Quiz
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Download Notes
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Ask Question
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
