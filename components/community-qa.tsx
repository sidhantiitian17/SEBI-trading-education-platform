"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, ThumbsUp, ThumbsDown, MessageSquare, Search, Plus, CheckCircle, Clock } from "lucide-react"

const questions = [
  {
    id: 1,
    title: "What's the difference between market cap and enterprise value?",
    content:
      "I'm trying to understand fundamental analysis better. Can someone explain the key differences between market capitalization and enterprise value? When should I use each metric?",
    author: {
      name: "NewTrader123",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Beginner",
    },
    category: "Fundamental Analysis",
    tags: ["market-cap", "enterprise-value", "valuation"],
    votes: 15,
    answers: 3,
    views: 234,
    timeAgo: "2 hours ago",
    hasAcceptedAnswer: true,
    bounty: null,
  },
  {
    id: 2,
    title: "How to backtest a momentum strategy effectively?",
    content:
      "I've built a momentum-based trading strategy but I'm not sure if my backtesting approach is correct. What are the key things to consider when backtesting momentum strategies to avoid overfitting?",
    author: {
      name: "AlgoEnthusiast",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Intermediate",
    },
    category: "Algorithmic Trading",
    tags: ["backtesting", "momentum", "strategy-testing"],
    votes: 8,
    answers: 2,
    views: 156,
    timeAgo: "4 hours ago",
    hasAcceptedAnswer: false,
    bounty: 100,
  },
  {
    id: 3,
    title: "Best risk management practices for swing trading?",
    content:
      "I'm new to swing trading and want to make sure I have proper risk management in place. What position sizing and stop-loss strategies work best for swing trades?",
    author: {
      name: "SwingTrader99",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Beginner",
    },
    category: "Risk Management",
    tags: ["swing-trading", "risk-management", "position-sizing"],
    votes: 12,
    answers: 5,
    views: 345,
    timeAgo: "6 hours ago",
    hasAcceptedAnswer: true,
    bounty: null,
  },
]

const myQuestions = [
  {
    id: 4,
    title: "How to interpret RSI divergence patterns?",
    content:
      "I've been studying RSI divergence but I'm having trouble identifying reliable patterns. Can someone share examples of bullish and bearish divergences?",
    category: "Technical Analysis",
    votes: 6,
    answers: 2,
    views: 89,
    timeAgo: "1 day ago",
    status: "Open",
  },
]

export function CommunityQA() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [showAskForm, setShowAskForm] = useState(false)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-orange-500"
      case "Expert":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Community Q&A
          </CardTitle>
          <CardDescription>Ask questions and get answers from the trading community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fundamental">Fundamental Analysis</SelectItem>
                <SelectItem value="technical">Technical Analysis</SelectItem>
                <SelectItem value="algo">Algorithmic Trading</SelectItem>
                <SelectItem value="risk">Risk Management</SelectItem>
                <SelectItem value="portfolio">Portfolio Management</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="votes">Most Voted</SelectItem>
                <SelectItem value="answers">Most Answers</SelectItem>
                <SelectItem value="bounty">Bounty</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAskForm(!showAskForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </div>

          {showAskForm && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Ask a Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Title</label>
                  <Input placeholder="What's your trading question?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fundamental">Fundamental Analysis</SelectItem>
                      <SelectItem value="technical">Technical Analysis</SelectItem>
                      <SelectItem value="algo">Algorithmic Trading</SelectItem>
                      <SelectItem value="risk">Risk Management</SelectItem>
                      <SelectItem value="portfolio">Portfolio Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Details</label>
                  <Textarea placeholder="Provide more details about your question..." rows={4} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input placeholder="Add tags separated by commas" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowAskForm(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button>Post Question</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Questions</TabsTrigger>
          <TabsTrigger value="my-questions">My Questions</TabsTrigger>
          <TabsTrigger value="my-answers">My Answers</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 text-center min-w-16">
                      <div className="flex flex-col items-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{question.votes}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg line-clamp-2">{question.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {question.bounty && (
                            <Badge variant="default" className="bg-yellow-500 text-yellow-900">
                              +{question.bounty} XP
                            </Badge>
                          )}
                          {question.hasAcceptedAnswer && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Solved
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{question.content}</p>

                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {question.author.name.split("").slice(0, 2).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{question.author.name}</span>
                        <Badge className={`${getLevelColor(question.author.level)} text-white border-0 text-xs`}>
                          {question.author.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">• {question.timeAgo}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {question.answers} answers
                          </div>
                          <div>{question.views} views</div>
                          <Badge variant="outline">{question.category}</Badge>
                        </div>
                        <div className="flex gap-1">
                          {question.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="my-questions" className="space-y-4">
          {myQuestions.map((question) => (
            <Card key={question.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{question.title}</h3>
                  <Badge variant={question.status === "Open" ? "secondary" : "default"}>
                    <Clock className="h-3 w-3 mr-1" />
                    {question.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{question.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>{question.votes} votes</div>
                    <div>{question.answers} answers</div>
                    <div>{question.views} views</div>
                    <div>{question.timeAgo}</div>
                  </div>
                  <Badge variant="outline">{question.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="my-answers" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No answers yet</h3>
              <p className="text-muted-foreground mb-4">Start helping the community by answering questions!</p>
              <Button>Browse Questions to Answer</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
