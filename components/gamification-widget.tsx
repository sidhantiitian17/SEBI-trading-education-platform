"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Flame, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { calculateLevel } from "@/lib/gamification"

export function GamificationWidget() {
  const userLevel = calculateLevel(1650)
  const userStreak = 3
  const weeklyXP = 140
  const recentAchievement = "Quiz Master"

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Your Progress
          </h3>
          <Badge variant="outline" className="bg-white/50">
            Level {userLevel.level}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{userLevel.title}</span>
            <span>
              {userLevel.currentXP}/{userLevel.currentXP + userLevel.xpToNext} XP
            </span>
          </div>
          <Progress value={(userLevel.currentXP / (userLevel.currentXP + userLevel.xpToNext)) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-white/30">
            <div className="flex items-center justify-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-bold text-orange-500">{userStreak}</span>
            </div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/30">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-bold">{weeklyXP}</span>
            </div>
            <div className="text-xs text-muted-foreground">Weekly XP</div>
          </div>
        </div>

        {recentAchievement && (
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="text-xs text-muted-foreground">Latest Achievement</div>
            <div className="text-sm font-medium">🧠 {recentAchievement}</div>
          </div>
        )}

        <Link href="/gamification">
          <Button variant="outline" size="sm" className="w-full bg-white/20 hover:bg-white/30">
            View All Progress
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
