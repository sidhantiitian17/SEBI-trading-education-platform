"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlayCircle, BookOpen, Calculator, TrendingUp, Lightbulb, ArrowRight, ArrowLeft } from "lucide-react"
import { useState } from "react"

interface TutorialContentProps {
  slug: string
}

const tutorialData = {
  "stock-market-fundamentals": {
    title: "Stock Market Fundamentals",
    currentLesson: 3,
    totalLessons: 8,
    lessons: [
      {
        id: 1,
        title: "What is the Stock Market?",
        content: {
          theory:
            "The stock market is a collection of markets where stocks (pieces of ownership in businesses) are traded between investors. It's like a giant marketplace where people buy and sell shares of companies.",
          example:
            "Think of it like a farmers market, but instead of buying apples and vegetables, you're buying small pieces of companies like Apple or Tesla.",
          interactive: "Let's explore how a simple trade works...",
        },
      },
      {
        id: 2,
        title: "Types of Stocks",
        content: {
          theory:
            "There are two main types of stocks: Common stocks give you voting rights and potential dividends. Preferred stocks typically pay fixed dividends but have no voting rights.",
          example:
            "If you own common stock in Disney, you can vote on company decisions and might receive dividend payments when Disney makes profits.",
          interactive: "Compare different stock types with our interactive tool...",
        },
      },
      {
        id: 3,
        title: "Market Orders vs Limit Orders",
        content: {
          theory:
            "Market orders execute immediately at the current market price. Limit orders only execute when the stock reaches your specified price.",
          example:
            "If Apple stock is trading at $150, a market order buys immediately. A limit order at $145 waits until the price drops to $145.",
          interactive: "Practice placing different order types in our simulator...",
        },
      },
    ],
  },
}

export function TutorialContent({ slug }: TutorialContentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const tutorial = tutorialData[slug as keyof typeof tutorialData]

  if (!tutorial) {
    return <div>Tutorial not found</div>
  }

  const currentLesson = tutorial.lessons[currentStep]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">{currentLesson.title}</CardTitle>
              <CardDescription>
                Lesson {currentLesson.id} of {tutorial.totalLessons}
              </CardDescription>
            </div>
            <Badge variant="secondary">{Math.round((currentLesson.id / tutorial.totalLessons) * 100)}% Complete</Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="learn" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learn
          </TabsTrigger>
          <TabsTrigger value="example" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Example
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Practice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Theory
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed">{currentLesson.content.theory}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="example" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-chart-3" />
                Real-World Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="text-base">{currentLesson.content.example}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-chart-1" />
                Interactive Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <div className="text-center space-y-4">
                  <PlayCircle className="h-12 w-12 text-primary mx-auto" />
                  <p className="text-lg font-medium">{currentLesson.content.interactive}</p>
                  <Button size="lg" className="mt-4">
                    Launch Interactive Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Lesson
        </Button>

        <Button
          onClick={() => setCurrentStep(Math.min(tutorial.lessons.length - 1, currentStep + 1))}
          disabled={currentStep === tutorial.lessons.length - 1}
        >
          Next Lesson
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
