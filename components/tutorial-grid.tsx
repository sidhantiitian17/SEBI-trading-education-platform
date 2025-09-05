"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, Star, Play, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

const tutorials = [
  {
    id: "stock-market-fundamentals",
    title: "Stock Market Fundamentals",
    description:
      "Learn the essential concepts of how stock markets operate, including key terminology, market participants, and basic trading mechanics.",
    duration: "45 minutes",
    lessons: 8,
    difficulty: "Beginner",
    rating: 4.8,
    enrolled: 1247,
    progress: 75,
    status: "in-progress",
    topics: ["Market Basics", "Stock Types", "Trading Hours", "Market Orders"],
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment Techniques",
    description:
      "Master various methods to evaluate investment risks, including volatility analysis, beta calculations, and risk-return relationships.",
    duration: "60 minutes",
    lessons: 10,
    difficulty: "Intermediate",
    rating: 4.9,
    enrolled: 892,
    progress: 0,
    status: "available",
    topics: ["Risk Metrics", "Volatility", "Beta Analysis", "Diversification"],
  },
  {
    id: "algorithmic-trading",
    title: "Algorithmic Trading & HFT",
    description:
      "Introduction to automated trading strategies, high-frequency trading concepts, and algorithmic decision-making processes.",
    duration: "90 minutes",
    lessons: 12,
    difficulty: "Advanced",
    rating: 4.7,
    enrolled: 634,
    progress: 0,
    status: "locked",
    topics: ["Trading Algorithms", "HFT Basics", "Market Making", "Execution Strategies"],
  },
  {
    id: "portfolio-diversification",
    title: "Portfolio Diversification",
    description:
      "Learn how to build balanced portfolios, manage asset allocation, and optimize risk-adjusted returns through diversification.",
    duration: "50 minutes",
    lessons: 9,
    difficulty: "Intermediate",
    rating: 4.6,
    enrolled: 1089,
    progress: 100,
    status: "completed",
    topics: ["Asset Allocation", "Correlation", "Modern Portfolio Theory", "Rebalancing"],
  },
]

export function TutorialGrid() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="font-serif text-xl">{tutorial.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        tutorial.difficulty === "Beginner"
                          ? "default"
                          : tutorial.difficulty === "Intermediate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {tutorial.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {tutorial.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {tutorial.status === "completed" && <CheckCircle className="h-6 w-6 text-chart-2" />}
                  {tutorial.status === "locked" && <Lock className="h-6 w-6 text-muted-foreground" />}
                </div>
              </div>
              <CardDescription className="text-balance">{tutorial.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {tutorial.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {tutorial.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {tutorial.enrolled.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {tutorial.topics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>

              {tutorial.progress > 0 && tutorial.status !== "completed" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{tutorial.progress}%</span>
                  </div>
                  <Progress value={tutorial.progress} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                <Link href={`/tutorials/${tutorial.id}`} className="flex-1">
                  <Button
                    className="w-full"
                    disabled={tutorial.status === "locked"}
                    variant={tutorial.status === "completed" ? "outline" : "default"}
                  >
                    {tutorial.status === "locked" && <Lock className="h-4 w-4 mr-2" />}
                    {tutorial.status === "in-progress" && <Play className="h-4 w-4 mr-2" />}
                    {tutorial.status === "completed" && <CheckCircle className="h-4 w-4 mr-2" />}
                    {tutorial.status === "available" && <Play className="h-4 w-4 mr-2" />}

                    {tutorial.status === "locked"
                      ? "Locked"
                      : tutorial.status === "in-progress"
                        ? "Continue"
                        : tutorial.status === "completed"
                          ? "Review"
                          : "Start Learning"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
