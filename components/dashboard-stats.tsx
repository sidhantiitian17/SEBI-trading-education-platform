import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Trophy, TrendingUp, Target } from "lucide-react"

const stats = [
  {
    title: "Tutorials Completed",
    value: "12",
    total: "24",
    icon: BookOpen,
    color: "text-chart-1",
  },
  {
    title: "Quiz Score",
    value: "85%",
    change: "+5%",
    icon: Trophy,
    color: "text-chart-2",
  },
  {
    title: "Virtual Portfolio",
    value: "$10,450",
    change: "+2.3%",
    icon: TrendingUp,
    color: "text-chart-3",
  },
  {
    title: "Learning Streak",
    value: "7 days",
    target: "Goal: 30 days",
    icon: Target,
    color: "text-chart-4",
  },
]

export function DashboardStats() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{stat.value}</div>
            {stat.total && <p className="text-xs text-muted-foreground">of {stat.total} total</p>}
            {stat.change && <p className="text-xs text-chart-2">{stat.change} from last week</p>}
            {stat.target && <p className="text-xs text-muted-foreground">{stat.target}</p>}
          </CardContent>
        </Card>
      ))}
    </>
  )
}
