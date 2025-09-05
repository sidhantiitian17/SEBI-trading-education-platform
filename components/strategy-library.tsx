"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Library, Copy, Play, Star } from "lucide-react"

interface StrategyLibraryProps {
  onStrategySelect: (strategyId: string) => void
}

const predefinedStrategies = [
  {
    id: "sma_crossover",
    name: "SMA Crossover",
    description: "Buy when short SMA crosses above long SMA, sell when it crosses below",
    category: "Trend Following",
    difficulty: "Beginner",
    backtestReturn: 8.5,
    winRate: 65,
    maxDrawdown: 12.3,
    rating: 4.2,
    trades: 156,
    popular: true,
  },
  {
    id: "rsi_mean_reversion",
    name: "RSI Mean Reversion",
    description: "Buy when RSI < 30 (oversold), sell when RSI > 70 (overbought)",
    category: "Mean Reversion",
    difficulty: "Beginner",
    backtestReturn: 12.1,
    winRate: 58,
    maxDrawdown: 8.7,
    rating: 4.5,
    trades: 203,
    popular: true,
  },
  {
    id: "macd_momentum",
    name: "MACD Momentum",
    description: "Trade based on MACD line crossing signal line with volume confirmation",
    category: "Momentum",
    difficulty: "Intermediate",
    backtestReturn: 15.3,
    winRate: 62,
    maxDrawdown: 15.2,
    rating: 4.1,
    trades: 89,
    popular: false,
  },
  {
    id: "bollinger_squeeze",
    name: "Bollinger Band Squeeze",
    description: "Identify low volatility periods and trade breakouts from Bollinger Bands",
    category: "Volatility",
    difficulty: "Advanced",
    backtestReturn: 18.7,
    winRate: 55,
    maxDrawdown: 22.1,
    rating: 3.9,
    trades: 67,
    popular: false,
  },
  {
    id: "pairs_trading",
    name: "Statistical Arbitrage",
    description: "Trade correlated pairs when their price relationship deviates from the mean",
    category: "Arbitrage",
    difficulty: "Advanced",
    backtestReturn: 9.8,
    winRate: 72,
    maxDrawdown: 6.4,
    rating: 4.3,
    trades: 234,
    popular: true,
  },
  {
    id: "momentum_breakout",
    name: "Momentum Breakout",
    description: "Trade breakouts from consolidation patterns with volume and momentum filters",
    category: "Breakout",
    difficulty: "Intermediate",
    backtestReturn: 21.4,
    winRate: 48,
    maxDrawdown: 28.5,
    rating: 3.7,
    trades: 45,
    popular: false,
  },
]

const userStrategies = [
  {
    id: "my_custom_rsi",
    name: "My Custom RSI Strategy",
    description: "Modified RSI strategy with additional volume filters",
    category: "Custom",
    difficulty: "Intermediate",
    backtestReturn: 14.2,
    winRate: 61,
    maxDrawdown: 11.8,
    rating: 0,
    trades: 78,
    created: "2024-01-15",
  },
]

export function StrategyLibrary({ onStrategySelect }: StrategyLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  const categories = ["all", "Trend Following", "Mean Reversion", "Momentum", "Volatility", "Arbitrage", "Breakout"]
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]

  const filteredStrategies = predefinedStrategies.filter((strategy) => {
    const matchesSearch =
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || strategy.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || strategy.difficulty === difficultyFilter

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
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
            <Library className="h-5 w-5 text-primary" />
            Strategy Library
          </CardTitle>
          <CardDescription>Browse and use pre-built algorithmic trading strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Levels" : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="predefined" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="predefined">Pre-built Strategies</TabsTrigger>
          <TabsTrigger value="custom">My Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="relative">
                {strategy.popular && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{strategy.category}</Badge>
                        <Badge className={`${getDifficultyColor(strategy.difficulty)} text-white border-0`}>
                          {strategy.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className={`font-bold ${strategy.backtestReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {strategy.backtestReturn >= 0 ? "+" : ""}
                        {strategy.backtestReturn}%
                      </div>
                      <div className="text-xs text-muted-foreground">Return</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-bold">{strategy.winRate}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-bold text-red-600">-{strategy.maxDrawdown}%</div>
                      <div className="text-xs text-muted-foreground">Max DD</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-bold">{strategy.trades}</div>
                      <div className="text-xs text-muted-foreground">Trades</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(strategy.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">({strategy.rating})</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => onStrategySelect(strategy.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Clone
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => onStrategySelect(strategy.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{strategy.category}</Badge>
                    <Badge className={`${getDifficultyColor(strategy.difficulty)} text-white border-0`}>
                      {strategy.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className={`font-bold ${strategy.backtestReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {strategy.backtestReturn >= 0 ? "+" : ""}
                        {strategy.backtestReturn}%
                      </div>
                      <div className="text-xs text-muted-foreground">Return</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-bold">{strategy.winRate}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">Created: {strategy.created}</div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => onStrategySelect(strategy.id)}
                    >
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => onStrategySelect(strategy.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
