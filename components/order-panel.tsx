"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingDown, Calculator, Info } from "lucide-react"
import { useState } from "react"

export function OrderPanel() {
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [orderType, setOrderType] = useState("market")
  const [quantity, setQuantity] = useState("")
  const [limitPrice, setLimitPrice] = useState("")

  const stockPrice = 175.25 // Mock current price
  const estimatedCost = quantity ? (Number(quantity) * stockPrice).toFixed(2) : "0.00"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Place Order
        </CardTitle>
        <CardDescription>Buy or sell stocks with virtual money</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="symbol">Stock Symbol</Label>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
              <SelectItem value="GOOGL">GOOGL - Alphabet Inc.</SelectItem>
              <SelectItem value="MSFT">MSFT - Microsoft Corp.</SelectItem>
              <SelectItem value="TSLA">TSLA - Tesla Inc.</SelectItem>
              <SelectItem value="AMZN">AMZN - Amazon.com Inc.</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Price:</span>
            <Badge variant="outline">${stockPrice}</Badge>
          </div>
        </div>

        <Tabs defaultValue="buy" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-chart-2">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-chart-4">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-type">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Shares)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter number of shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="limit-price">Limit Price</Label>
                <Input
                  id="limit-price"
                  type="number"
                  placeholder="Enter limit price"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                />
              </div>
            )}

            <Alert>
              <Calculator className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between">
                  <span>Estimated Cost:</span>
                  <span className="font-semibold">${estimatedCost}</span>
                </div>
              </AlertDescription>
            </Alert>

            <Button className="w-full bg-chart-2 hover:bg-chart-2/90">Place Buy Order</Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You don't own any {selectedStock} shares to sell. Buy some shares first to practice selling.
              </AlertDescription>
            </Alert>

            <Button className="w-full bg-transparent" variant="outline" disabled>
              <TrendingDown className="h-4 w-4 mr-2" />
              No Shares to Sell
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
