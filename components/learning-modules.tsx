import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, ArrowRight } from "lucide-react"

const modules = [
  {
    title: "Stock Market Fundamentals",
    description: "Learn the basics of how stock markets work, key terminology, and market participants.",
    progress: 75,
    duration: "45 min",
    difficulty: "Beginner",
    rating: 4.8,
    status: "in-progress",
  },
  {
    title: "Risk Assessment Techniques",
    description: "Master various methods to evaluate and manage investment risks effectively.",
    progress: 0,
    duration: "60 min",
    difficulty: "Intermediate",
    rating: 4.9,
    status: "locked",
  },
  {
    title: "Algorithmic Trading Basics",
    description: "Introduction to automated trading strategies and high-frequency trading concepts.",
    progress: 0,
    duration: "90 min",
    difficulty: "Advanced",
    rating: 4.7,
    status: "locked",
  },
  {
    title: "Portfolio Diversification",
    description: "Learn how to build a balanced portfolio and manage asset allocation.",
    progress: 100,
    duration: "50 min",
    difficulty: "Intermediate",
    rating: 4.6,
    status: "completed",
  },
]

export function LearningModules() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <BookOpen className="h-5 w-5 text-primary" />
          Learning Modules
        </CardTitle>
        <CardDescription>Interactive tutorials to master stock market concepts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{module.title}</h3>
                <Badge
                  variant={
                    module.status === "completed"
                      ? "default"
                      : module.status === "in-progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {module.status === "completed"
                    ? "Completed"
                    : module.status === "in-progress"
                      ? "In Progress"
                      : "Locked"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{module.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {module.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  {module.rating}
                </div>
                <Badge variant="outline" className="text-xs">
                  {module.difficulty}
                </Badge>
              </div>
              {module.progress > 0 && (
                <div className="space-y-1">
                  <Progress value={module.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{module.progress}% complete</p>
                </div>
              )}
            </div>
            <Button
              variant={module.status === "locked" ? "outline" : "default"}
              size="sm"
              disabled={module.status === "locked"}
              className="ml-4"
            >
              {module.status === "completed" ? "Review" : module.status === "in-progress" ? "Continue" : "Start"}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
