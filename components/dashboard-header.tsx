"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User, TrendingUp } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-serif text-primary">StockLearn</h1>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Beta
            </Badge>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
            <Link href="/tutorials">
              <Button variant="ghost" size="sm">
                Tutorials
              </Button>
            </Link>
            <Link href="/quizzes">
              <Button variant="ghost" size="sm">
                Quizzes
              </Button>
            </Link>
            <Link href="/trading">
              <Button variant="ghost" size="sm">
                Trading Sim
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="ghost" size="sm">
                Portfolio
              </Button>
            </Link>
            <Link href="/market">
              <Button variant="ghost" size="sm">
                Market Center
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="ghost" size="sm">
                Progress
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
