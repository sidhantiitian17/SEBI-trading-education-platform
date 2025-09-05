"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VisualStrategyBuilderComponent from "@/components/visual-strategy-builder"
import { BacktestResults } from "@/components/backtest-results"
import { AlgoTradingEducation } from "@/components/algo-trading-education"
import { StrategyLibrary } from "@/components/strategy-library"
import { LiveAlgoTrading } from "@/components/live-algo-trading"
import { Bot, TrendingUp, Play, BarChart3 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { StrategyTemplate } from "@/lib/algo-trading-types"

export default function AlgoTradingPage() {
  const { t } = useLanguage()
  const [activeStrategy, setActiveStrategy] = useState<StrategyTemplate | null>(null)
  const [backtestRunning, setBacktestRunning] = useState(false)

  const handleStrategySelect = (strategy: StrategyTemplate) => {
    setActiveStrategy(strategy)
  }

  const handleStrategyIdSelect = (strategyId: string) => {
    // In a real app, you'd fetch the strategy by ID
    console.log('Selected strategy ID:', strategyId)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-serif bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Algorithmic Trading Simulator
        </h1>
        <p className="text-muted-foreground">
          Learn algorithmic trading, build strategies, and test them with historical data
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Bot className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Active Strategies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">+12.5%</div>
            <div className="text-sm text-muted-foreground">Best Strategy Return</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">47</div>
            <div className="text-sm text-muted-foreground">Backtests Run</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Play className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Live Strategies</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="builder">Strategy Builder</TabsTrigger>
          <TabsTrigger value="library">Strategy Library</TabsTrigger>
          <TabsTrigger value="backtest">Backtesting</TabsTrigger>
          <TabsTrigger value="live">Live Trading</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <VisualStrategyBuilderComponent
            initialStrategy={activeStrategy || undefined}
            onStrategyChange={setActiveStrategy}
            onSave={setActiveStrategy}
            className="bg-white rounded-lg shadow-sm border"
          />
        </TabsContent>

        <TabsContent value="library">
          <StrategyLibrary onStrategySelect={handleStrategyIdSelect} />
        </TabsContent>

        <TabsContent value="backtest">
          <BacktestResults
            strategy={activeStrategy?.id || null}
            isRunning={backtestRunning}
            onRunBacktest={() => setBacktestRunning(true)}
          />
        </TabsContent>

        <TabsContent value="live">
          <LiveAlgoTrading activeStrategies={activeStrategy ? [activeStrategy.id] : []} />
        </TabsContent>

        <TabsContent value="education">
          <AlgoTradingEducation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
