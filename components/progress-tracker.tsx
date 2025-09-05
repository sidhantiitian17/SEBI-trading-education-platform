import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

const achievements = [
  { name: "First Steps", description: "Complete your first tutorial", earned: true },
  { name: "Quiz Master", description: "Score 90% or higher on 5 quizzes", earned: true },
  { name: "Paper Trader", description: "Make your first virtual trade", earned: false },
  { name: "Risk Manager", description: "Complete risk assessment module", earned: false },
]

export function ProgressTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Target className="h-5 w-5 text-primary" />
          Learning Progress
        </CardTitle>
        <CardDescription>Track your journey to financial literacy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>65%</span>
          </div>
          <Progress value={65} className="h-3" />
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Award className="h-4 w-4 text-secondary" />
            Recent Achievements
          </h4>
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              <Badge variant={achievement.earned ? "default" : "outline"}>
                {achievement.earned ? "Earned" : "Locked"}
              </Badge>
            </div>
          ))}
        </div>

        <Link href="/progress">
          <Button variant="outline" className="w-full bg-transparent">
            View Detailed Progress
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
