"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Minus } from "lucide-react"

const tradingHistory = [
  {
    id: 1,
    date: "2024-01-15",
    time: "10:30 AM",
    symbol: "AAPL",
    type: "BUY",
    shares: 50,
    price: 168.5,
    total: 8425.0,
    status: "Executed",
  },
  {
    id: 2,
    date: "2024-01-14",
    time: "2:15 PM",
    symbol: "MSFT",
    type: "BUY",
    shares: 25,
    price: 385.2,
    total: 9630.0,
    status: "Executed",
  },
  {
    id: 3,
    date: "2024-01-12",
    time: "11:45 AM",
    symbol: "GOOGL",
    type: "BUY",
    shares: 30,
    price: 142.8,
    total: 4284.0,
    status: "Executed",
  },
  {
    id: 4,
    date: "2024-01-10",
    time: "9:30 AM",
    symbol: "TSLA",
    type: "SELL",
    shares: 20,
    price: 245.6,
    total: 4912.0,
    status: "Executed",
  },
]

export function TradingHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading History</CardTitle>
        <CardDescription>Your recent buy and sell transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradingHistory.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{trade.date}</div>
                    <div className="text-xs text-muted-foreground">{trade.time}</div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{trade.symbol}</TableCell>
                <TableCell>
                  <Badge
                    variant={trade.type === "BUY" ? "default" : "outline"}
                    className="flex items-center gap-1 w-fit"
                  >
                    {trade.type === "BUY" ? <ShoppingCart className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {trade.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{trade.shares}</TableCell>
                <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${trade.total.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{trade.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
