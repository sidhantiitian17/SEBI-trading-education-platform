import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Brain, BarChart3, PieChart } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Take a Quiz",
    description: "Test your knowledge with interactive quizzes",
    icon: Brain,
    color: "bg-chart-1/10 text-chart-1 hover:bg-chart-1/20",
    href: "/quizzes",
  },
  {
    title: "Virtual Trading",
    description: "Practice trading with simulated market data",
    icon: BarChart3,
    color: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20",
    href: "/trading",
  },
  {
    title: "Watch Tutorial",
    description: "Learn with step-by-step video guides",
    icon: PlayCircle,
    color: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20",
    href: "/tutorials",
  },
  {
    title: "Portfolio Analysis",
    description: "Analyze your virtual portfolio performance",
    icon: PieChart,
    color: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20",
    href: "/portfolio",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Quick Actions</CardTitle>
        <CardDescription>Jump into learning activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 w-full ${action.color}`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
