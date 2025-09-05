"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"

interface TutorialProgressProps {
  slug: string
}

export function TutorialProgress({ slug }: TutorialProgressProps) {
  const progress = 37.5 // This would come from your state management

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/tutorials">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Tutorials
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold">Stock Market Fundamentals</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Progress:</span>
          <div className="w-32">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
