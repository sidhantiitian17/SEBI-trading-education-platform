"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, Clock } from "lucide-react"

const newsItems = [
  {
    title: "Fed Signals Potential Rate Cut in Q2",
    summary: "Federal Reserve officials hint at possible interest rate reduction following inflation data...",
    source: "Reuters",
    time: "2 hours ago",
    category: "Monetary Policy",
    impact: "high",
  },
  {
    title: "Tech Earnings Beat Expectations",
    summary: "Major technology companies report stronger than expected quarterly results...",
    source: "Bloomberg",
    time: "4 hours ago",
    category: "Earnings",
    impact: "medium",
  },
  {
    title: "Oil Prices Surge on Supply Concerns",
    summary: "Crude oil futures jump 3% amid geopolitical tensions affecting supply chains...",
    source: "CNBC",
    time: "6 hours ago",
    category: "Commodities",
    impact: "medium",
  },
  {
    title: "New IPO Filing Draws Investor Interest",
    summary: "Emerging AI company files for public offering, targeting $2B valuation...",
    source: "Wall Street Journal",
    time: "8 hours ago",
    category: "IPO",
    impact: "low",
  },
]

export function MarketNews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Market News
        </CardTitle>
        <CardDescription>Latest financial news and market updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {newsItems.map((news, index) => (
          <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <Badge
                variant={news.impact === "high" ? "destructive" : news.impact === "medium" ? "default" : "secondary"}
                className="text-xs"
              >
                {news.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {news.time}
              </div>
            </div>

            <h3 className="font-semibold text-sm mb-2 leading-tight">{news.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{news.summary}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{news.source}</span>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent">
          View All News
        </Button>
      </CardContent>
    </Card>
  )
}
