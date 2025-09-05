"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Users, Clock, TrendingUp, Pin, Plus, Search } from "lucide-react"

const forumCategories = [
  {
    id: "beginners",
    name: "Beginner's Corner",
    description: "New to trading? Start your journey here",
    icon: "🌱",
    posts: 1247,
    members: 3456,
    color: "bg-green-500",
  },
  {
    id: "technical-analysis",
    name: "Technical Analysis",
    description: "Charts, patterns, and technical indicators",
    icon: "📊",
    posts: 2891,
    members: 2134,
    color: "bg-blue-500",
  },
  {
    id: "fundamental-analysis",
    name: "Fundamental Analysis",
    description: "Company research and valuation discussions",
    icon: "📈",
    posts: 1567,
    members: 1876,
    color: "bg-purple-500",
  },
  {
    id: "algo-trading",
    name: "Algorithmic Trading",
    description: "Automated strategies and backtesting",
    icon: "🤖",
    posts: 892,
    members: 567,
    color: "bg-orange-500",
  },
  {
    id: "portfolio-management",
    name: "Portfolio Management",
    description: "Asset allocation and risk management",
    icon: "💼",
    posts: 1234,
    members: 1543,
    color: "bg-teal-500",
  },
  {
    id: "market-news",
    name: "Market News & Events",
    description: "Latest market developments and analysis",
    icon: "📰",
    posts: 3456,
    members: 4321,
    color: "bg-red-500",
  },
]

const recentDiscussions = [
  {
    id: 1,
    title: "Best indicators for swing trading in current market?",
    category: "Technical Analysis",
    author: {
      name: "TradingPro123",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Advanced",
    },
    replies: 23,
    views: 456,
    lastActivity: "2 hours ago",
    isPinned: false,
    tags: ["swing-trading", "indicators", "market-analysis"],
  },
  {
    id: 2,
    title: "How to analyze quarterly results for stock picking?",
    category: "Fundamental Analysis",
    author: {
      name: "ValueInvestor",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Expert",
    },
    replies: 18,
    views: 234,
    lastActivity: "4 hours ago",
    isPinned: true,
    tags: ["quarterly-results", "stock-picking", "analysis"],
  },
  {
    id: 3,
    title: "Beginner's guide to reading candlestick patterns",
    category: "Beginner's Corner",
    author: {
      name: "MarketMentor",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Mentor",
    },
    replies: 45,
    views: 1234,
    lastActivity: "6 hours ago",
    isPinned: true,
    tags: ["candlesticks", "patterns", "beginner"],
  },
  {
    id: 4,
    title: "Python libraries for backtesting strategies",
    category: "Algorithmic Trading",
    author: {
      name: "AlgoTrader99",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Intermediate",
    },
    replies: 12,
    views: 189,
    lastActivity: "8 hours ago",
    isPinned: false,
    tags: ["python", "backtesting", "libraries"],
  },
]

export function DiscussionForums() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

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
      case "Mentor":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Discussion Forums
          </CardTitle>
          <CardDescription>Join conversations with fellow traders and learn from the community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {forumCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forumCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${category.color} text-white text-xl`}>{category.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {category.posts.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {category.members.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Discussions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDiscussions.map((discussion) => (
              <div
                key={discussion.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {discussion.isPinned && <Pin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{discussion.title}</h4>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {discussion.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {discussion.author.name.split("").slice(0, 2).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{discussion.author.name}</span>
                        <Badge className={`${getLevelColor(discussion.author.level)} text-white border-0 text-xs`}>
                          {discussion.author.level}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {discussion.replies} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {discussion.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {discussion.lastActivity}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {discussion.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
