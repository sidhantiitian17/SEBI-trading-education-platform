"use client"

import { OverallProgress } from "@/components/overall-progress"
import AchievementGallery from "@/components/achievement-gallery"
import { LearningAnalytics } from "@/components/learning-analytics"
import { SkillAssessment } from "@/components/skill-assessment"
import { LearningGoals } from "@/components/learning-goals"
import { ActivityFeed } from "@/components/activity-feed"

export function ProgressDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <OverallProgress />
          <LearningAnalytics />
          <SkillAssessment />
        </div>
        <div className="space-y-6">
          <LearningGoals />
          <ActivityFeed />
        </div>
      </div>

      <AchievementGallery />
    </div>
  )
}
