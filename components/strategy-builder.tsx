"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Settings, Code, Eye, Save } from "lucide-react"

interface StrategyBuilderProps {
  onStrategyCreate: (strategyId: string) => void
}

interface Condition {
  id: string
  indicator: string
  operator: string
  value: string
  timeframe: string
}

interface Action {
  id: string
  type: "buy" | "sell"
  quantity: string
  orderType: "market" | "limit"
  price?: string
}

export function StrategyBuilder({ onStrategyCreate }: StrategyBuilderProps) {
  const [strategyName, setStrategyName] = useState("")
  const [description, setDescription] = useState("")
  const [conditions, setConditions] = useState<Condition[]>([])
  const [buyActions, setBuyActions] = useState<Action[]>([])
  const [sellActions, setSellActions] = useState<Action[]>([])
  const [riskManagement, setRiskManagement] = useState({
    stopLoss: "",
    takeProfit: "",
    maxPositionSize: "",
  })

  const indicators = [
    "Simple Moving Average (SMA)",
    "Exponential Moving Average (EMA)",
    "Relative Strength Index (RSI)",
    "MACD",
    "Bollinger Bands",
    "Stochastic Oscillator",
    "Volume",
    "Price",
  ]

  const operators = ["Greater than", "Less than", "Equal to", "Crosses above", "Crosses below"]

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      indicator: "",
      operator: "",
      value: "",
      timeframe: "1h",
    }
    setConditions([...conditions, newCondition])
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const addAction = (type: "buy" | "sell") => {
    const newAction: Action = {
      id: Date.now().toString(),
      type,
      quantity: "",
      orderType: "market",
    }
    if (type === "buy") {
      setBuyActions([...buyActions, newAction])
    } else {
      setSellActions([...sellActions, newAction])
    }
  }

  const removeAction = (id: string, type: "buy" | "sell") => {
    if (type === "buy") {
      setBuyActions(buyActions.filter((a) => a.id !== id))
    } else {
      setSellActions(sellActions.filter((a) => a.id !== id))
    }
  }

  const saveStrategy = () => {
    if (!strategyName) return

    const strategyId = `strategy_${Date.now()}`
    // Here you would save the strategy to your backend/state management
    console.log("Saving strategy:", {
      id: strategyId,
      name: strategyName,
      description,
      conditions,
      buyActions,
      sellActions,
      riskManagement,
    })

    onStrategyCreate(strategyId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Strategy Builder
          </CardTitle>
          <CardDescription>Create custom algorithmic trading strategies with visual tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strategy-name">Strategy Name</Label>
              <Input
                id="strategy-name"
                placeholder="e.g., RSI Mean Reversion"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your strategy..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="conditions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conditions">Entry Conditions</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Entry Conditions</CardTitle>
                  <CardDescription>Define when your strategy should trigger trades</CardDescription>
                </div>
                <Button onClick={addCondition} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {conditions.length === 0 ? (
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Add conditions to define when your strategy should enter trades. For example: "RSI is less than 30"
                  </AlertDescription>
                </Alert>
              ) : (
                conditions.map((condition, index) => (
                  <div key={condition.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Condition {index + 1}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => removeCondition(condition.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Select
                        value={condition.indicator}
                        onValueChange={(value) => updateCondition(condition.id, "indicator", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select indicator" />
                        </SelectTrigger>
                        <SelectContent>
                          {indicators.map((indicator) => (
                            <SelectItem key={indicator} value={indicator}>
                              {indicator}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((operator) => (
                            <SelectItem key={operator} value={operator}>
                              {operator}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Value"
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                      />
                      <Select
                        value={condition.timeframe}
                        onValueChange={(value) => updateCondition(condition.id, "timeframe", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1m">1 Minute</SelectItem>
                          <SelectItem value="5m">5 Minutes</SelectItem>
                          <SelectItem value="15m">15 Minutes</SelectItem>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="4h">4 Hours</SelectItem>
                          <SelectItem value="1d">1 Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-600">Buy Actions</CardTitle>
                  <Button onClick={() => addAction("buy")} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Buy Action
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {buyActions.map((action, index) => (
                  <div key={action.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="default">Buy Action {index + 1}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => removeAction(action.id, "buy")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Quantity %" />
                      <Select defaultValue="market">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-600">Sell Actions</CardTitle>
                  <Button onClick={() => addAction("sell")} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sell Action
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {sellActions.map((action, index) => (
                  <div key={action.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive">Sell Action {index + 1}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => removeAction(action.id, "sell")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Quantity %" />
                      <Select defaultValue="market">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>Set stop losses, take profits, and position sizing rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                  <Input
                    id="stop-loss"
                    placeholder="e.g., 5"
                    value={riskManagement.stopLoss}
                    onChange={(e) => setRiskManagement({ ...riskManagement, stopLoss: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="take-profit">Take Profit (%)</Label>
                  <Input
                    id="take-profit"
                    placeholder="e.g., 10"
                    value={riskManagement.takeProfit}
                    onChange={(e) => setRiskManagement({ ...riskManagement, takeProfit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-position">Max Position Size (%)</Label>
                  <Input
                    id="max-position"
                    placeholder="e.g., 20"
                    value={riskManagement.maxPositionSize}
                    onChange={(e) => setRiskManagement({ ...riskManagement, maxPositionSize: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Strategy Preview
              </CardTitle>
              <CardDescription>Review your strategy before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{strategyName || "Unnamed Strategy"}</h4>
                <p className="text-sm text-muted-foreground mb-3">{description || "No description provided"}</p>

                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Conditions:</strong> {conditions.length} defined
                  </div>
                  <div className="text-sm">
                    <strong>Buy Actions:</strong> {buyActions.length} defined
                  </div>
                  <div className="text-sm">
                    <strong>Sell Actions:</strong> {sellActions.length} defined
                  </div>
                  <div className="text-sm">
                    <strong>Risk Management:</strong> {Object.values(riskManagement).filter(Boolean).length}/3
                    configured
                  </div>
                </div>
              </div>

              <Button onClick={saveStrategy} className="w-full" disabled={!strategyName || conditions.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Save Strategy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
