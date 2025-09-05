"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle } from "lucide-react"

const economicEvents = [
  {
    time: "8:30 AM",
    event: "Non-Farm Payrolls",
    country: "US",
    impact: "high",
    forecast: "185K",
    previous: "199K",
  },
  {
    time: "10:00 AM",
    event: "ISM Manufacturing PMI",
    country: "US",
    impact: "medium",
    forecast: "49.2",
    previous: "48.7",
  },
  {
    time: "2:00 PM",
    event: "Fed Chair Speech",
    country: "US",
    impact: "high",
    forecast: "-",
    previous: "-",
  },
  {
    time: "Tomorrow",
    event: "CPI Inflation Data",
    country: "US",
    impact: "high",
    forecast: "3.2%",
    previous: "3.4%",
  },
]

export function EconomicCalendar() {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Economic Calendar
        </CardTitle>
        <CardDescription>Upcoming economic events and data releases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {economicEvents.map((event, index) => (
          <div key={index} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{event.time}</span>
                <Badge variant="outline" className="text-xs">
                  {event.country}
                </Badge>
              </div>
              <Badge variant={getImpactColor(event.impact)} className="text-xs">
                {event.impact === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {event.impact.toUpperCase()}
              </Badge>
            </div>

            <h3 className="font-semibold text-sm mb-2">{event.event}</h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Forecast:</span>
                <span className="ml-1 font-medium">{event.forecast}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Previous:</span>
                <span className="ml-1 font-medium">{event.previous}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
