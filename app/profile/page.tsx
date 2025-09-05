'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Trophy,
  Target,
  BarChart3,
  BookOpen,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function ProfilePage() {
  const [userStats, setUserStats] = useState({
    level: 'Beginner',
    xp: 1250,
    xpToNext: 750,
    completedModules: 5,
    totalModules: 8,
    averageScore: 82,
    learningStreak: 7,
    totalStudyTime: 420
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-lg text-muted-foreground">
          Track your learning progress and achievements
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.level}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.xp} XP • {userStats.xpToNext} to next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.completedModules}/{userStats.totalModules}
            </div>
            <p className="text-xs text-muted-foreground">Modules completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Quiz performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.learningStreak}</div>
            <p className="text-xs text-muted-foreground">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>View detailed analytics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/progress-analytics">
              <Button className="w-full" size="lg">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Resume your current module</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/learn">
              <Button variant="outline" className="w-full" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Go to Learning Modules
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your latest accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <h4 className="font-medium">Quiz Master</h4>
                  <p className="text-sm text-muted-foreground">
                    Scored 90% or higher on 5 consecutive quizzes
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Earned 2 days ago</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <h4 className="font-medium">Dedicated Learner</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintained a 7-day learning streak
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Earned today</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
