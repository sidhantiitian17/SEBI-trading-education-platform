"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen, BarChart3, Shield, Target, ArrowRight } from "lucide-react"

const skillLevels = [
  {
    skill: "Market Knowledge",
    level: "Intermediate",
    progress: 75,
    icon: BookOpen,
    color: "text-chart-1",
    description: "Understanding of market mechanics and terminology",
  },
  {
    skill: "Risk Assessment",
    level: "Beginner",
    progress: 45,
    icon: Shield,
    color: "text-chart-2",
    description: "Ability to evaluate and manage investment risks",
  },
  {
    skill: "Technical Analysis",
    level: "Beginner",
    progress: 30,
    icon: BarChart3,
    color: "text-chart-3",
    description: "Chart reading and technical indicator analysis",
  },
  {
    skill: "Portfolio Management",
    level: "Intermediate",
    progress: 65,
    icon: Target,
    color: "text-chart-4",
    description: "Asset allocation and diversification strategies",
  },
]

export function SkillAssessment() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Brain className="h-5 w-5 text-primary" />
              Skill Assessment
            </CardTitle>
            <CardDescription>Your competency levels across key financial skills</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Take Assessment
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {skillLevels.map((skill, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <skill.icon className={`h-5 w-5 ${skill.color}`} />
                <div>
                  <div className="font-medium">{skill.skill}</div>
                  <div className="text-sm text-muted-foreground">{skill.description}</div>
                </div>
              </div>
              <Badge
                variant={
                  skill.level === "Expert" ? "default" : skill.level === "Intermediate" ? "secondary" : "outline"
                }
              >
                {skill.level}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Proficiency</span>
                <span>{skill.progress}%</span>
              </div>
              <Progress value={skill.progress} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
