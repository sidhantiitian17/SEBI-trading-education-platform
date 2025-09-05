"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, Lightbulb } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface QuizInterfaceProps {
  slug: string
}

const quizData = {
  "market-basics": {
    title: "Stock Market Basics",
    description: "Test your understanding of fundamental stock market concepts",
    totalQuestions: 15,
    timeLimit: 600, // 10 minutes in seconds
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "What does it mean when you buy a stock?",
        options: [
          "You are lending money to the company",
          "You own a small piece of the company",
          "You are buying the company's debt",
          "You are purchasing the company's products",
        ],
        correctAnswer: 1,
        explanation:
          "When you buy a stock, you are purchasing a share of ownership in the company. This makes you a shareholder with certain rights, such as voting on company matters and potentially receiving dividends.",
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "What is the difference between a market order and a limit order?",
        options: [
          "Market orders are faster, limit orders are slower",
          "Market orders execute immediately at current price, limit orders execute only at specified price",
          "Market orders are for buying, limit orders are for selling",
          "There is no difference between them",
        ],
        correctAnswer: 1,
        explanation:
          "A market order executes immediately at the current market price, while a limit order only executes when the stock reaches your specified price or better.",
      },
      {
        id: 3,
        type: "true-false",
        question: "The stock market is open 24 hours a day, 7 days a week.",
        correctAnswer: false,
        explanation:
          "The stock market has specific trading hours. In the US, regular trading hours are typically 9:30 AM to 4:00 PM Eastern Time, Monday through Friday, excluding holidays.",
      },
      {
        id: 4,
        type: "multiple-select",
        question: "Which of the following are major stock exchanges? (Select all that apply)",
        options: ["New York Stock Exchange (NYSE)", "NASDAQ", "London Stock Exchange", "Federal Reserve"],
        correctAnswers: [0, 1, 2],
        explanation:
          "The NYSE, NASDAQ, and London Stock Exchange are all major stock exchanges. The Federal Reserve is the central bank of the United States, not a stock exchange.",
      },
    ],
  },
}

export function QuizInterface({ slug }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [timeLeft, setTimeLeft] = useState(600)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const quiz = quizData[slug as keyof typeof quizData]

  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz()
    }
  }, [quizStarted, quizCompleted, timeLeft])

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (question.type === "multiple-choice" || question.type === "true-false") {
        if (userAnswer === question.correctAnswer) correct++
      } else if (question.type === "multiple-select") {
        const correctAnswers = question.correctAnswers || []
        const userAnswers = userAnswer || []
        if (JSON.stringify(correctAnswers.sort()) === JSON.stringify(userAnswers.sort())) {
          correct++
        }
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setQuizCompleted(true)
    setShowResults(true)
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(quiz.timeLimit)
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link href="/quizzes">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Quizzes
                </Button>
              </Link>
            </div>
            <CardTitle className="font-serif text-2xl">{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{quiz.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{formatTime(quiz.timeLimit)}</div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </div>
            </div>

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Instructions:</strong> Answer all questions to the best of your ability. You can navigate
                between questions, but once you submit, you cannot change your answers. Good luck!
              </AlertDescription>
            </Alert>

            <Button onClick={startQuiz} size="lg" className="w-full">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
              <Badge
                variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Learning!"}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-chart-2">
                  {Math.round((score / 100) * quiz.questions.length)}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-chart-4">
                  {quiz.questions.length - Math.round((score / 100) * quiz.questions.length)}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{formatTime(quiz.timeLimit - timeLeft)}</div>
                <div className="text-sm text-muted-foreground">Time Used</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Answers</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect =
                  question.type === "multiple-choice" || question.type === "true-false"
                    ? userAnswer === question.correctAnswer
                    : JSON.stringify((question.correctAnswers || []).sort()) ===
                      JSON.stringify((userAnswer || []).sort())

                return (
                  <Card
                    key={question.id}
                    className={`border-l-4 ${isCorrect ? "border-l-chart-2" : "border-l-chart-4"}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-chart-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-chart-4" />
                        )}
                        <CardTitle className="text-base">Question {index + 1}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="flex gap-4">
              <Link href="/quizzes" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Quizzes
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif">{quiz.title}</CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`font-mono ${timeLeft < 60 ? "text-destructive" : ""}`}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ.type === "multiple-choice" && (
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
            >
              {currentQ.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === "true-false" && (
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value === "true")}
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="flex-1 cursor-pointer">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="flex-1 cursor-pointer">
                  False
                </Label>
              </div>
            </RadioGroup>
          )}

          {currentQ.type === "multiple-select" && (
            <div className="space-y-2">
              {currentQ.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={`checkbox-${index}`}
                    checked={(answers[currentQ.id] || []).includes(index)}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answers[currentQ.id] || []
                      if (checked) {
                        handleAnswerChange(currentQ.id, [...currentAnswers, index])
                      } else {
                        handleAnswerChange(
                          currentQ.id,
                          currentAnswers.filter((i: number) => i !== index),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
        ) : (
          <Button onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
