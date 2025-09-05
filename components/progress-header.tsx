"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Flame } from "lucide-react"
import Link from "next/link"

export function ProgressHeader() {
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
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold font-serif text-primary">Learning Progress</h1>
                <p className="text-muted-foreground">Track your journey to financial mastery</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Level 3</div>
              <div className="text-sm text-muted-foreground">Intermediate Learner</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">1,250 XP</div>
              <div className="text-sm text-muted-foreground">Experience Points</div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 text-lg px-4 py-2">
              <Flame className="h-4 w-4" />7 Day Streak
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
