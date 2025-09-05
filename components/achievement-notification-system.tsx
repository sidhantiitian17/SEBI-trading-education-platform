/**
 * Achievement Notification System
 * Real-time notifications for achievement unlocks and progress updates
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Star,
  Zap,
  X,
  CheckCircle,
  Gift,
  TrendingUp
} from 'lucide-react';
import { Achievement, AchievementNotification } from '@/lib/gamification-types';

interface AchievementNotificationProps {
  notification: AchievementNotification;
  onClose: () => void;
  onViewAchievement?: () => void;
}

export const AchievementNotificationComponent: React.FC<AchievementNotificationProps> = ({
  notification,
  onClose,
  onViewAchievement
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-hide after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'text-amber-600 bg-amber-100';
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'platinum': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-12 opacity-0 scale-95'
      }`}
    >
      <Card className="p-4 shadow-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg text-green-800">Achievement Unlocked!</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{notification.achievement.icon}</span>
              <div>
                <h5 className="font-semibold text-gray-900">{notification.achievement.name}</h5>
                <Badge className={getDifficultyColor(notification.achievement.difficulty)}>
                  {notification.achievement.difficulty}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{notification.achievement.description}</p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">+{notification.achievement.points} points</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="font-medium">+{notification.achievement.xpReward} XP</span>
              </div>
            </div>

            {onViewAchievement && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewAchievement}
                className="mt-3 w-full border-green-300 text-green-700 hover:bg-green-50"
              >
                View Achievement Details
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

interface AchievementNotificationContainerProps {
  notifications: AchievementNotification[];
  onRemoveNotification: (id: string) => void;
  onViewAchievement?: (achievement: Achievement) => void;
}

export const AchievementNotificationContainer: React.FC<AchievementNotificationContainerProps> = ({
  notifications,
  onRemoveNotification,
  onViewAchievement
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <AchievementNotificationComponent
          key={notification.id}
          notification={notification}
          onClose={() => onRemoveNotification(notification.id)}
          onViewAchievement={onViewAchievement ? () => onViewAchievement(notification.achievement) : undefined}
        />
      ))}
    </div>
  );
};

// Achievement Progress Notification
interface AchievementProgressNotificationProps {
  achievement: Achievement;
  progress: number;
  onClose: () => void;
}

export const AchievementProgressNotification: React.FC<AchievementProgressNotificationProps> = ({
  achievement,
  progress,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const progressPercentage = (progress / achievement.maxProgress) * 100;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Card className="p-4 shadow-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-blue-800">Progress Update</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{achievement.icon}</span>
              <h5 className="font-semibold text-gray-900">{achievement.name}</h5>
            </div>

            <p className="text-sm text-gray-700 mb-3">{achievement.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{progress}/{achievement.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AchievementNotificationComponent;
