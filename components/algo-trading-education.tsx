"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, TrendingUp, Zap, Brain, Target, AlertTriangle } from "lucide-react"

const educationModules = [
  {
    id: "algo_basics",
    title: "Algorithmic Trading Fundamentals",
    description: "Learn the basics of algorithmic trading, types of algorithms, and market structure",
    duration: "45 min",
    difficulty: "Beginner",
    progress: 100,
    topics: ["What is Algorithmic Trading", "Market Microstructure", "Order Types", "Execution Algorithms"],
  },
  {
    id: "technical_indicators",
    title: "Technical Indicators & Signals",
    description: "Master technical analysis indicators used in algorithmic strategies",
    duration: "60 min",
    difficulty: "Beginner",
    progress: 75,
    topics: ["Moving Averages", "RSI & Stochastic", "MACD", "Bollinger Bands", "Volume Indicators"],
  },
  {
    id: "strategy_development",
    title: "Strategy Development Process",
    description: "Learn how to develop, test, and optimize trading strategies",
    duration: "90 min",
    difficulty: "Intermediate",
    progress: 30,
    topics: ["Idea Generation", "Backtesting", "Optimization", "Walk-Forward Analysis"],
  },
  {
    id: "risk_management",
    title: "Risk Management in Algo Trading",
    description: "Understand position sizing, stop losses, and portfolio risk management",
    duration: "75 min",
    difficulty: "Intermediate",
    progress: 0,
    topics: ["Position Sizing", "Stop Loss Strategies", "Portfolio Risk", "Drawdown Management"],
  },
  {
    id: "hft_concepts",
    title: "High-Frequency Trading (HFT)",
    description: "Explore high-frequency trading strategies and market making",
    duration: "120 min",
    difficulty: "Advanced",
    progress: 0,
    topics: ["Market Making", "Arbitrage", "Latency Optimization", "Co-location"],
  },
  {
    id: "machine_learning",
    title: "ML in Algorithmic Trading",
    description: "Apply machine learning techniques to trading strategy development",
    duration: "150 min",
    difficulty: "Advanced",
    progress: 0,
    topics: ["Feature Engineering", "Model Selection", "Overfitting", "Ensemble Methods"],
  },
]

const conceptCards = [
  {
    title: "Market Making",
    description: "Provide liquidity by placing both buy and sell orders",
    icon: <Target className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    title: "Momentum Trading",
    description: "Follow price trends and momentum indicators",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "bg-green-500",
  },
  {
    title: "Mean Reversion",
    description: "Trade on the assumption that prices return to their mean",
    icon: <Brain className="h-6 w-6" />,
    color: "bg-purple-500",
  },
  {
    title: "Arbitrage",
    description: "Exploit price differences across markets or instruments",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-yellow-500",
  },
]

export function AlgoTradingEducation() {
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
            <BookOpen className="h-5 w-5 text-primary" />
            Algorithmic Trading Education
          </CardTitle>
          <CardDescription>
            Comprehensive learning path from basic concepts to advanced algorithmic trading strategies
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationModules.map((module) => (
              <Card key={module.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getDifficultyColor(module.difficulty)} text-white border-0`}>
                          {module.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={module.progress === 0 ? "default" : module.progress === 100 ? "outline" : "default"}
                  >
                    {module.progress === 0 ? "Start Module" : module.progress === 100 ? "Review" : "Continue"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="concepts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conceptCards.map((concept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${concept.color} text-white`}>{concept.icon}</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{concept.title}</h3>
                      <p className="text-muted-foreground">{concept.description}</p>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Important Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Risk Warning</h4>
                <p className="text-sm text-yellow-700">
                  Algorithmic trading involves significant risks. Past performance does not guarantee future results.
                  Always test strategies thoroughly and never risk more than you can afford to lose.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Best Practices</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Always backtest strategies on out-of-sample data</li>
                  <li>• Implement proper risk management controls</li>
                  <li>• Monitor live performance continuously</li>
                  <li>• Keep detailed records of all trades and modifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glossary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Algorithmic Trading Glossary</CardTitle>
              <CardDescription>Key terms and definitions in algorithmic trading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    term: "Alpha",
                    definition: "The excess return of a strategy compared to a benchmark market index.",
                  },
                  {
                    term: "Backtesting",
                    definition: "Testing a trading strategy using historical market data to evaluate its performance.",
                  },
                  {
                    term: "Drawdown",
                    definition: "The peak-to-trough decline in portfolio value during a specific period.",
                  },
                  {
                    term: "Latency",
                    definition: "The time delay between sending an order and its execution in the market.",
                  },
                  {
                    term: "Sharpe Ratio",
                    definition: "A measure of risk-adjusted return, calculated as excess return divided by volatility.",
                  },
                  {
                    term: "Slippage",
                    definition: "The difference between expected and actual execution prices due to market movement.",
                  },
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">{item.term}</h4>
                    <p className="text-sm text-muted-foreground">{item.definition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
