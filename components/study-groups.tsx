"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Clock, Plus, Search, Video } from "lucide-react"

const studyGroups = [
  {
    id: 1,
    name: "Technical Analysis Mastery",
    description: "Weekly sessions on advanced chart patterns and technical indicators",
    category: "Technical Analysis",
    members: 24,
    maxMembers: 30,
    level: "Intermediate",
    schedule: "Wednesdays 7:00 PM IST",
    nextSession: "2024-01-24",
    organizer: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    topics: ["Chart Patterns", "RSI Strategies", "Support & Resistance"],
    isJoined: true,
  },
  {
    id: 2,
    name: "Beginner's Trading Circle",
    description: "Learn the basics of stock market investing in a supportive environment",
    category: "Beginner",
    members: 18,
    maxMembers: 25,
    level: "Beginner",
    schedule: "Saturdays 10:00 AM IST",
    nextSession: "2024-01-27",
    organizer: {
      name: "Rajesh Kumar",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    topics: ["Market Basics", "Order Types", "Risk Management"],
    isJoined: false,
  },
  {
    id: 3,
    name: "Algorithmic Trading Lab",
    description: "Collaborative development and testing of trading algorithms",
    category: "Algorithmic Trading",
    members: 12,
    maxMembers: 15,
    level: "Advanced",
    schedule: "Sundays 4:00 PM IST",
    nextSession: "2024-01-28",
    organizer: {
      name: "Arjun Patel",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    topics: ["Python Strategies", "Backtesting", "Live Trading"],
    isJoined: true,
  },
  {
    id: 4,
    name: "Portfolio Management Workshop",
    description: "Monthly deep dives into portfolio construction and optimization",
    category: "Portfolio Management",
    members: 16,
    maxMembers: 20,
    level: "Intermediate",
    schedule: "First Saturday of month 2:00 PM IST",
    nextSession: "2024-02-03",
    organizer: {
      name: "Sneha Gupta",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    topics: ["Asset Allocation", "Rebalancing", "Performance Metrics"],
    isJoined: false,
  },
]

const upcomingSessions = [
  {
    id: 1,
    groupName: "Technical Analysis Mastery",
    topic: "Advanced Fibonacci Retracements",
    date: "2024-01-24",
    time: "7:00 PM IST",
    duration: "90 min",
    type: "Video Call",
    attendees: 18,
  },
  {
    id: 2,
    groupName: "Algorithmic Trading Lab",
    topic: "Implementing Mean Reversion Strategies",
    date: "2024-01-28",
    time: "4:00 PM IST",
    duration: "120 min",
    type: "Video Call",
    attendees: 10,
  },
]

export function StudyGroups() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Study Groups
          </CardTitle>
          <CardDescription>Join collaborative learning groups and study together with peers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search study groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="technical">Technical Analysis</SelectItem>
                <SelectItem value="fundamental">Fundamental Analysis</SelectItem>
                <SelectItem value="algo">Algorithmic Trading</SelectItem>
                <SelectItem value="portfolio">Portfolio Management</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {studyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{group.category}</Badge>
                          <Badge className={`${getLevelColor(group.level)} text-white border-0`}>{group.level}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members}/{group.maxMembers} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {group.schedule}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={group.organizer.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {group.organizer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Organized by {group.organizer.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Next session: </span>
                        <span className="font-medium">{group.nextSession}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Topics covered:</h4>
                      <div className="flex flex-wrap gap-1">
                        {group.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {group.isJoined ? (
                        <>
                          <Button variant="outline" className="flex-1 bg-transparent">
                            Leave Group
                          </Button>
                          <Button className="flex-1">
                            <Video className="h-4 w-4 mr-2" />
                            Join Session
                          </Button>
                        </>
                      ) : (
                        <Button className="w-full">Join Group</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {studyGroups
              .filter((group) => group.isJoined)
              .map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Next: {group.nextSession}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Study Sessions</CardTitle>
              <CardDescription>Your scheduled group learning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{session.topic}</h4>
                        <p className="text-sm text-muted-foreground">{session.groupName}</p>
                      </div>
                      <Badge variant="secondary">Upcoming</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <div className="font-medium">{session.date}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <div className="font-medium">{session.time}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{session.duration}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Attendees:</span>
                        <div className="font-medium">{session.attendees}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Add to Calendar
                      </Button>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
