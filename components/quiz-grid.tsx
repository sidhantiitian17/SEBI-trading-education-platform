"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, Users, Star, Play, Trophy, Target } from "lucide-react"
import Link from "next/link"

const quizzes = [
  {
    id: "market-basics",
    title: "Stock Market Basics",
    description:
      "Test your understanding of fundamental stock market concepts, terminology, and basic trading principles.",
    questions: 15,
    duration: "10 minutes",
    difficulty: "Beginner",
    category: "Fundamentals",
    attempts: 1247,
    averageScore: 78,
    yourBestScore: 85,
    topics: ["Market Structure", "Stock Types", "Trading Basics", "Market Orders"],
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment & Management",
    description: "Evaluate your knowledge of investment risks, volatility measures, and risk management strategies.",
    questions: 20,
    duration: "15 minutes",
    difficulty: "Intermediate",
    category: "Risk Management",
    attempts: 892,
    averageScore: 72,
    yourBestScore: null,
    topics: ["Risk Metrics", "Volatility", "Beta Analysis", "Portfolio Risk"],
  },
  {
    id: "algorithmic-trading",
    title: "Algorithmic Trading Concepts",
    description: "Challenge yourself with advanced concepts in automated trading, HFT, and algorithmic strategies.",
    questions: 25,
    duration: "20 minutes",
    difficulty: "Advanced",
    category: "Advanced Trading",
    attempts: 456,
    averageScore: 65,
    yourBestScore: null,
    topics: ["Trading Algorithms", "HFT", "Market Making", "Execution Strategies"],
  },
  {
    id: "portfolio-theory",
    title: "Portfolio Diversification",
    description:
      "Test your understanding of modern portfolio theory, asset allocation, and diversification strategies.",
    questions: 18,
    duration: "12 minutes",
    difficulty: "Intermediate",
    category: "Portfolio Management",
    attempts: 734,
    averageScore: 74,
    yourBestScore: 92,
    topics: ["Asset Allocation", "Correlation", "MPT", "Rebalancing"],
  },
  {
    id: "market-analysis",
    title: "Technical & Fundamental Analysis",
    description: "Assess your skills in analyzing stocks using both technical indicators and fundamental metrics.",
    questions: 22,
    duration: "18 minutes",
    difficulty: "Intermediate",
    category: "Analysis",
    attempts: 623,
    averageScore: 69,
    yourBestScore: null,
    topics: ["Technical Analysis", "Fundamental Analysis", "Chart Patterns", "Valuation"],
  },
  {
    id: "options-basics",
    title: "Options Trading Fundamentals",
    description: "Learn and test your knowledge of options contracts, strategies, and risk management.",
    questions: 16,
    duration: "14 minutes",
    difficulty: "Advanced",
    category: "Derivatives",
    attempts: 389,
    averageScore: 61,
    yourBestScore: null,
    topics: ["Options Basics", "Greeks", "Strategies", "Risk Management"],
  },
]

export function QuizGrid() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    {quiz.category}
                  </Badge>
                  <CardTitle className="font-serif text-xl">{quiz.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        quiz.difficulty === "Beginner"
                          ? "default"
                          : quiz.difficulty === "Intermediate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                    {quiz.yourBestScore && (
                      <div className="flex items-center gap-1 text-sm">
                        <Trophy className="h-3 w-3 text-chart-3" />
                        <span className="font-semibold">{quiz.yourBestScore}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardDescription className="text-balance">{quiz.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{quiz.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span>{quiz.attempts.toLocaleString()} attempts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-muted-foreground" />
                  <span>Avg: {quiz.averageScore}%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {quiz.topics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>

              <Link href={`/quizzes/${quiz.id}`} className="block">
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  {quiz.yourBestScore ? "Retake Quiz" : "Start Quiz"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
