'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LeaderboardEntry, LeaderboardPeriod, LeaderboardType } from '@/lib/types';

interface LeaderboardProps {
  className?: string;
}

export default function Leaderboard({ className }: LeaderboardProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [type, setType] = useState<LeaderboardType>('xp_total');
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [period, type]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification/leaderboard?period=${period}&type=${type}`);
      const data = await response.json();

      if (response.ok) {
        setEntries(data.entries);
        // Find user's rank
        const userEntry = data.entries.find((entry: LeaderboardEntry) => entry.userId === user?.id);
        setUserRank(userEntry ? userEntry.rank : null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500 text-yellow-50';
      case 2:
        return 'bg-gray-400 text-gray-50';
      case 3:
        return 'bg-amber-600 text-amber-50';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatValue = (value: number, type: LeaderboardType) => {
    switch (type) {
      case 'xp_total':
      case 'xp_weekly':
      case 'xp_monthly':
        return `${value.toLocaleString()} XP`;
      case 'learning_streak':
        return `${value.toLocaleString()} days`;
      case 'trading_performance':
        return `$${value.toLocaleString()}`;
      case 'quiz_scores':
        return `${value.toLocaleString()}%`;
      case 'achievements_count':
        return `${value.toLocaleString()} achievements`;
      default:
        return value.toString();
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value: LeaderboardPeriod) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(value: LeaderboardType) => setType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xp_total">Total XP</SelectItem>
              <SelectItem value="xp_weekly">Weekly XP</SelectItem>
              <SelectItem value="xp_monthly">Monthly XP</SelectItem>
              <SelectItem value="learning_streak">Learning Streak</SelectItem>
              <SelectItem value="trading_performance">Trading Performance</SelectItem>
              <SelectItem value="quiz_scores">Quiz Scores</SelectItem>
              <SelectItem value="achievements_count">Achievements</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {userRank && userRank > 10 && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Your Rank</span>
              </div>
              <Badge variant="secondary" className={getRankBadgeColor(userRank)}>
                #{userRank}
              </Badge>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {entries.slice(0, 10).map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                entry.userId === user?.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{entry.userName}</span>
                  {entry.userId === user?.id && (
                    <Badge variant="outline" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Level {entry.level}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatValue(entry.score, type)}
                </div>
                {entry.change !== undefined && (
                  <div className={`text-xs flex items-center gap-1 ${
                    entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                    {entry.change > 0 ? '+' : ''}{entry.change}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet</p>
            <p className="text-sm">Be the first to earn points!</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={fetchLeaderboard}>
            Refresh Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
