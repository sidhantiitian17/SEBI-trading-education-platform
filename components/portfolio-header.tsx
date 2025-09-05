"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PieChart, TrendingUp } from "lucide-react"
import Link from "next/link"

export function PortfolioHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <PieChart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold font-serif text-primary">Portfolio Analysis</h1>
                <p className="text-muted-foreground">Track performance and analyze your virtual investments</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
              <div className="text-3xl font-bold text-primary">$52,450.00</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Gain/Loss</div>
              <div className="text-2xl font-bold text-chart-2">+$2,450.00</div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 text-lg px-4 py-2">
              <TrendingUp className="h-4 w-4" />
              +4.9%
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
