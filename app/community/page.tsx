"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiscussionForums } from "@/components/discussion-forums"
import { MentoringHub } from "@/components/mentoring-hub"
import { StudyGroups } from "@/components/study-groups"
import { CommunityQA } from "@/components/community-qa"
import { LiveChat } from "@/components/live-chat"
import { Users, MessageSquare, HelpCircle, Zap } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export default function CommunityPage() {
  const { t } = useLanguage()
  const [activeUsers] = useState(1247)
  const [onlineNow] = useState(89)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-serif bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Learning Community
        </h1>
        <p className="text-muted-foreground">Connect, learn, and grow together with fellow traders and mentors</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Community Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{onlineNow}</div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-muted-foreground">Discussions Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <HelpCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-muted-foreground">Questions Answered</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forums" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="forums">Discussion Forums</TabsTrigger>
          <TabsTrigger value="mentoring">Mentoring Hub</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
          <TabsTrigger value="qa">Q&A Platform</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="forums">
          <DiscussionForums />
        </TabsContent>

        <TabsContent value="mentoring">
          <MentoringHub />
        </TabsContent>

        <TabsContent value="groups">
          <StudyGroups />
        </TabsContent>

        <TabsContent value="qa">
          <CommunityQA />
        </TabsContent>

        <TabsContent value="chat">
          <LiveChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}
