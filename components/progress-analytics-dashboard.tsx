'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  Calendar,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface LearningAnalytics {
  userId: string;
  overallProgress: {
    completionPercentage: number;
    totalModules: number;
    completedModules: number;
    currentModule: string;
    estimatedTimeRemaining: number;
  };
  performanceMetrics: {
    averageQuizScore: number;
    totalQuizAttempts: number;
    bestPerformingTopics: string[];
    areasNeedingImprovement: string[];
    learningStreak: number;
    totalStudyTime: number;
  };
  learningPatterns: {
    preferredStudyTimes: string[];
    averageSessionDuration: number;
    mostActiveDays: string[];
    learningVelocity: number;
  };
  recommendations: {
    nextRecommendedModule: string;
    suggestedStudyPlan: StudyPlanItem[];
    focusAreas: string[];
    estimatedCompletionTime: number;
  };
  achievements: {
    recentAchievements: Achievement[];
    upcomingMilestones: Milestone[];
    progressTowardsGoals: GoalProgress[];
  };
}

interface StudyPlanItem {
  moduleId: string;
  title: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
  type: 'completion' | 'streak' | 'performance' | 'milestone';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  type: 'modules' | 'study_time' | 'quizzes' | 'streak';
}

interface GoalProgress {
  goalId: string;
  title: string;
  current: number;
  target: number;
  percentage: number;
  deadline?: Date;
}

export default function ProgressAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/learning/analytics');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Analytics</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Analytics Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Track your progress, analyze performance, and get personalized recommendations
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overallProgress.completionPercentage}%</div>
                <Progress value={analytics.overallProgress.completionPercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {analytics.overallProgress.completedModules} of {analytics.overallProgress.totalModules} modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.performanceMetrics.averageQuizScore}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.performanceMetrics.totalQuizAttempts} attempts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.performanceMetrics.learningStreak}</div>
                <p className="text-xs text-muted-foreground">days in a row</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(analytics.performanceMetrics.totalStudyTime)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatTime(analytics.overallProgress.estimatedTimeRemaining)} remaining
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Topics</CardTitle>
                <CardDescription>Areas where you're excelling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.performanceMetrics.bestPerformingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{topic}</span>
                      <Badge variant="secondary">Strong</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
                <CardDescription>Topics to focus on next</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.performanceMetrics.areasNeedingImprovement.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{topic}</span>
                      <Badge variant="outline">Needs Focus</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
                <CardDescription>Your study habits and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Preferred Study Times</h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.learningPatterns.preferredStudyTimes.map((time, index) => (
                      <Badge key={index} variant="outline">{time}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Most Active Days</h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.learningPatterns.mostActiveDays.map((day, index) => (
                      <Badge key={index} variant="outline">{day}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Session</p>
                    <p className="text-lg font-semibold">{analytics.learningPatterns.averageSessionDuration} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Learning Velocity</p>
                    <p className="text-lg font-semibold">{analytics.learningPatterns.learningVelocity} modules/week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>Track your learning objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.achievements.progressTowardsGoals.map((goal) => (
                    <div key={goal.goalId} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{goal.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress value={goal.percentage} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{goal.percentage.toFixed(1)}% complete</span>
                        {goal.deadline && (
                          <span>Due: {goal.deadline.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Pattern Analysis</CardTitle>
              <CardDescription>Detailed insights into your learning behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {analytics.learningPatterns.averageSessionDuration}
                  </div>
                  <p className="text-sm text-muted-foreground">Minutes per session</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {analytics.learningPatterns.learningVelocity}
                  </div>
                  <p className="text-sm text-muted-foreground">Modules per week</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {analytics.performanceMetrics.learningStreak}
                  </div>
                  <p className="text-sm text-muted-foreground">Day streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Study Plan</CardTitle>
              <CardDescription>Recommended modules based on your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recommendations.suggestedStudyPlan.map((item) => (
                  <div key={item.moduleId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.reason}</p>
                      <p className="text-sm">Estimated time: {formatTime(item.estimatedTime)}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Start Module
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Focus Areas</CardTitle>
              <CardDescription>Topics to prioritize in your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analytics.recommendations.focusAreas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.achievements.recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Earned {achievement.earnedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
                <CardDescription>Goals you're working towards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.achievements.upcomingMilestones.map((milestone) => (
                    <div key={milestone.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {milestone.progress}/{milestone.target}
                        </span>
                      </div>
                      <Progress value={(milestone.progress / milestone.target) * 100} />
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
