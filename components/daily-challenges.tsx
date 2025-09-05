'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target, Zap, Trophy, Gift } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DailyChallenge, ChallengeType } from '@/lib/types';

interface DailyChallengesProps {
  className?: string;
}

export default function DailyChallenges({ className }: DailyChallengesProps) {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gamification/challenges');
      const data = await response.json();

      if (response.ok) {
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      const response = await fetch('/api/gamification/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId,
          action: 'complete',
        }),
      });

      if (response.ok) {
        // Refresh challenges to get updated status
        fetchChallenges();
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const getChallengeIcon = (type: ChallengeType) => {
    switch (type) {
      case 'complete_modules':
        return <Target className="h-5 w-5" />;
      case 'pass_quizzes':
        return <CheckCircle className="h-5 w-5" />;
      case 'execute_trades':
        return <Trophy className="h-5 w-5" />;
      case 'maintain_streak':
        return <Zap className="h-5 w-5" />;
      case 'earn_xp':
        return <Gift className="h-5 w-5" />;
      case 'social_engagement':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getChallengeColor = (type: ChallengeType) => {
    switch (type) {
      case 'complete_modules':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pass_quizzes':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'execute_trades':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'maintain_streak':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'earn_xp':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'social_engagement':
        return 'text-pink-600 bg-pink-50 border-pink-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeChallenges = challenges.filter(c => !c.isCompleted && new Date(c.endDate) > new Date());
  const completedChallenges = challenges.filter(c => c.isCompleted);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Daily Challenges
        </CardTitle>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{activeChallenges.length} active</span>
          <span>•</span>
          <span>{completedChallenges.length} completed</span>
        </div>
      </CardHeader>
      <CardContent>
        {activeChallenges.length === 0 && completedChallenges.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No challenges available</p>
            <p className="text-sm">Check back tomorrow for new challenges!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Challenges */}
            {activeChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`border rounded-lg p-4 transition-all ${
                  getChallengeColor(challenge.type)
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getChallengeColor(challenge.type)}`}>
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{challenge.title}</h4>
                      <p className="text-sm opacity-80">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {challenge.xpReward} XP
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(challenge.endDate)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress} / {challenge.target}</span>
                  </div>
                  <Progress
                    value={getProgressPercentage(challenge.progress, challenge.target)}
                    className="h-2"
                  />
                  {challenge.progress >= challenge.target && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => completeChallenge(challenge.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Claim Reward
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Completed Challenges */}
            {completedChallenges.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Completed Today
                </h4>
                <div className="space-y-2">
                  {completedChallenges.slice(0, 3).map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-1 rounded-full bg-green-100">
                          {getChallengeIcon(challenge.type)}
                        </div>
                        <div>
                          <span className="font-medium text-green-800">{challenge.title}</span>
                          <div className="text-xs text-green-600">
                            +{challenge.xpReward} XP earned
                          </div>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={fetchChallenges}>
            Refresh Challenges
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
