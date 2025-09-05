"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Star, MessageCircle, Calendar, Search } from "lucide-react"

const mentors = [
  {
    id: 1,
    name: "Rajesh Kumar",
    title: "Senior Portfolio Manager",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.9,
    reviews: 127,
    experience: "15+ years",
    specialties: ["Portfolio Management", "Risk Assessment", "Fundamental Analysis"],
    hourlyRate: "₹2,500",
    availability: "Available",
    languages: ["English", "Hindi", "Tamil"],
    mentees: 45,
    sessionsCompleted: 234,
    responseTime: "< 2 hours",
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "Technical Analysis Expert",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.8,
    reviews: 89,
    experience: "12+ years",
    specialties: ["Technical Analysis", "Chart Patterns", "Day Trading"],
    hourlyRate: "₹2,000",
    availability: "Busy",
    languages: ["English", "Hindi", "Gujarati"],
    mentees: 32,
    sessionsCompleted: 156,
    responseTime: "< 4 hours",
  },
  {
    id: 3,
    name: "Arjun Patel",
    title: "Algorithmic Trading Specialist",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.7,
    reviews: 67,
    experience: "8+ years",
    specialties: ["Algorithmic Trading", "Python Programming", "Backtesting"],
    hourlyRate: "₹3,000",
    availability: "Available",
    languages: ["English", "Hindi", "Marathi"],
    mentees: 28,
    sessionsCompleted: 98,
    responseTime: "< 1 hour",
  },
]

const mentoringSessions = [
  {
    id: 1,
    mentor: "Rajesh Kumar",
    mentee: "You",
    topic: "Portfolio Diversification Strategy",
    date: "2024-01-20",
    time: "10:00 AM",
    duration: "60 min",
    status: "Scheduled",
    type: "Video Call",
  },
  {
    id: 2,
    mentor: "Priya Sharma",
    mentee: "You",
    topic: "Technical Analysis Basics",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: "45 min",
    status: "Completed",
    type: "Video Call",
  },
]

export function MentoringHub() {
  const [searchTerm, setSearchTerm] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-500"
      case "Busy":
        return "bg-yellow-500"
      case "Offline":
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
            <UserCheck className="h-5 w-5 text-primary" />
            Mentoring Hub
          </CardTitle>
          <CardDescription>Connect with experienced traders and get personalized guidance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentors by name or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="portfolio">Portfolio Management</SelectItem>
                <SelectItem value="technical">Technical Analysis</SelectItem>
                <SelectItem value="fundamental">Fundamental Analysis</SelectItem>
                <SelectItem value="algo">Algorithmic Trading</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="mentors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="become">Become a Mentor</TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{mentor.name}</h3>
                          <p className="text-sm text-muted-foreground">{mentor.title}</p>
                        </div>
                        <Badge className={`${getAvailabilityColor(mentor.availability)} text-white border-0`}>
                          {mentor.availability}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                          <span className="text-sm text-muted-foreground">({mentor.reviews} reviews)</span>
                        </div>
                        <span className="text-sm text-muted-foreground">• {mentor.experience}</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex flex-wrap gap-1">
                          {mentor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {mentor.languages.map((language) => (
                            <Badge key={language} variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground mb-4">
                        <div className="text-center">
                          <div className="font-semibold text-foreground">{mentor.mentees}</div>
                          <div>Mentees</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-foreground">{mentor.sessionsCompleted}</div>
                          <div>Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-foreground">{mentor.responseTime}</div>
                          <div>Response</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-primary">{mentor.hourlyRate}/hour</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Session
                          </Button>
                        </div>
                      </div>
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
              <CardTitle>My Mentoring Sessions</CardTitle>
              <CardDescription>Track your upcoming and completed mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentoringSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{session.topic}</h4>
                        <p className="text-sm text-muted-foreground">with {session.mentor}</p>
                      </div>
                      <Badge variant={session.status === "Completed" ? "default" : "secondary"}>{session.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium">{session.type}</div>
                      </div>
                    </div>
                    {session.status === "Scheduled" && (
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                        <Button size="sm">Join Session</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="become" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Become a Mentor</CardTitle>
              <CardDescription>Share your expertise and help others learn trading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Requirements to become a mentor:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Minimum 3000 XP in the learning platform</li>
                  <li>• Completed advanced certification modules</li>
                  <li>• Demonstrated expertise in at least one specialty area</li>
                  <li>• Positive community engagement history</li>
                  <li>• Pass the mentor assessment test</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Benefits of mentoring:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Earn ₹1,500 - ₹3,500 per hour</li>
                  <li>• Build your professional network</li>
                  <li>• Gain teaching and communication skills</li>
                  <li>• Access to exclusive mentor resources</li>
                  <li>• Recognition in the community</li>
                </ul>
              </div>
              <Button className="w-full">Apply to Become a Mentor</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
