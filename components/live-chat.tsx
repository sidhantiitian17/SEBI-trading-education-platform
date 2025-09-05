"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Users, Hash, Settings, Smile } from "lucide-react"

const chatRooms = [
  {
    id: "general",
    name: "General Discussion",
    description: "General trading discussions",
    members: 234,
    online: 45,
    category: "general",
  },
  {
    id: "beginners",
    name: "Beginners Help",
    description: "Questions and help for new traders",
    members: 156,
    online: 23,
    category: "help",
  },
  {
    id: "technical-analysis",
    name: "Technical Analysis",
    description: "Chart analysis and technical discussions",
    members: 189,
    online: 34,
    category: "analysis",
  },
  {
    id: "algo-trading",
    name: "Algo Trading",
    description: "Algorithmic trading strategies",
    members: 78,
    online: 12,
    category: "advanced",
  },
  {
    id: "market-news",
    name: "Market News",
    description: "Latest market updates and news",
    members: 312,
    online: 67,
    category: "news",
  },
]

const messages = [
  {
    id: 1,
    user: {
      name: "TradingPro123",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Advanced",
      online: true,
    },
    content: "Anyone else seeing this unusual volume spike in RELIANCE today?",
    timestamp: "10:32 AM",
    type: "message",
  },
  {
    id: 2,
    user: {
      name: "MarketAnalyst",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Expert",
      online: true,
    },
    content: "Yes, there's news about their quarterly results. Check the fundamentals before making any moves.",
    timestamp: "10:33 AM",
    type: "message",
  },
  {
    id: 3,
    user: {
      name: "NewTrader99",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Beginner",
      online: false,
    },
    content: "Can someone explain what volume spike means for price action?",
    timestamp: "10:35 AM",
    type: "message",
  },
  {
    id: 4,
    user: {
      name: "ChartMaster",
      avatar: "/placeholder.svg?height=32&width=32",
      level: "Intermediate",
      online: true,
    },
    content:
      "Volume spike usually indicates increased interest. Could be institutional buying or selling. Always check the context!",
    timestamp: "10:36 AM",
    type: "message",
  },
]

const onlineUsers = [
  {
    name: "TradingPro123",
    avatar: "/placeholder.svg?height=24&width=24",
    level: "Advanced",
    status: "online",
  },
  {
    name: "MarketAnalyst",
    avatar: "/placeholder.svg?height=24&width=24",
    level: "Expert",
    status: "online",
  },
  {
    name: "ChartMaster",
    avatar: "/placeholder.svg?height=24&width=24",
    level: "Intermediate",
    status: "online",
  },
  {
    name: "AlgoTrader99",
    avatar: "/placeholder.svg?height=24&width=24",
    level: "Advanced",
    status: "away",
  },
]

export function LiveChat() {
  const [selectedRoom, setSelectedRoom] = useState("general")
  const [message, setMessage] = useState("")

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-orange-500"
      case "Expert":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would send the message to your chat service
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const selectedRoomData = chatRooms.find((room) => room.id === selectedRoom)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Live Chat
          </CardTitle>
          <CardDescription>Real-time discussions with the trading community</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Rooms Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Chat Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRoom === room.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium text-sm">{room.name}</span>
                  </div>
                  <p className="text-xs opacity-80 mb-2">{room.description}</p>
                  <div className="flex items-center gap-3 text-xs opacity-80">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {room.members}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      {room.online}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  {selectedRoomData?.name}
                </CardTitle>
                <CardDescription>{selectedRoomData?.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {selectedRoomData?.online} online
                </Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {msg.user.name.split("").slice(0, 2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.user.name}</span>
                        <Badge className={`${getLevelColor(msg.user.level)} text-white border-0 text-xs`}>
                          {msg.user.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Users Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Online Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{user.name.split("").slice(0, 2).join("")}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{user.name}</div>
                    <Badge className={`${getLevelColor(user.level)} text-white border-0 text-xs`}>{user.level}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
