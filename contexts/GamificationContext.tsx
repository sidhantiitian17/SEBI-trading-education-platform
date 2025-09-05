/**
 * Gamification Context
 * Provides gamification state and actions throughout the app
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { gamificationEngine } from '@/lib/gamification-engine';
import { Achievement, UserGamification, AchievementNotification } from '@/lib/gamification-types';

interface GamificationState {
  userProfile: UserGamification | null;
  notifications: AchievementNotification[];
  isLoading: boolean;
  error: string | null;
}

type GamificationAction =
  | { type: 'SET_USER_PROFILE'; payload: UserGamification }
  | { type: 'ADD_NOTIFICATION'; payload: AchievementNotification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_XP'; payload: number }
  | { type: 'UPDATE_POINTS'; payload: number };

const initialState: GamificationState = {
  userProfile: null,
  notifications: [],
  isLoading: false,
  error: null,
};

function gamificationReducer(state: GamificationState, action: GamificationAction): GamificationState {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload, isLoading: false };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'UPDATE_XP':
      if (!state.userProfile) return state;
      return {
        ...state,
        userProfile: { ...state.userProfile, xp: state.userProfile.xp + action.payload }
      };
    case 'UPDATE_POINTS':
      if (!state.userProfile) return state;
      return {
        ...state,
        userProfile: { ...state.userProfile, totalPoints: state.userProfile.totalPoints + action.payload }
      };
    default:
      return state;
  }
}

interface GamificationContextType {
  state: GamificationState;
  actions: {
    loadUserProfile: (userId: string) => void;
    checkAchievements: (userId: string, action: string, data?: any) => void;
    claimDailyChallenge: (userId: string, challengeId: string) => void;
    updateProgress: (userId: string, category: string, progress: number) => void;
    addNotification: (notification: AchievementNotification) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
  };
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: React.ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const profile = gamificationEngine.getUserProfile(userId);
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
    }
  };

  // Check for achievements
  const checkAchievements = (userId: string, action: string, data?: any) => {
    const achievements = gamificationEngine.checkAchievements(userId, action, data);

    achievements.forEach(achievement => {
      const notification: AchievementNotification = {
        id: `achievement-${Date.now()}-${Math.random()}`,
        achievement,
        timestamp: new Date(),
        isNew: true
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 5000);
    });

    // Refresh user profile
    if (achievements.length > 0) {
      loadUserProfile(userId);
    }
  };

  // Claim daily challenge reward
  const claimDailyChallenge = (userId: string, challengeId: string) => {
    const success = gamificationEngine.claimDailyChallengeReward(userId, challengeId);
    if (success) {
      loadUserProfile(userId);
    }
  };

  // Update progress
  const updateProgress = (userId: string, category: string, progress: number) => {
    gamificationEngine.updateProgress(userId, category, progress);
    loadUserProfile(userId);
  };

  // Notification management
  const addNotification = (notification: AchievementNotification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const actions = {
    loadUserProfile,
    checkAchievements,
    claimDailyChallenge,
    updateProgress,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  const contextValue: GamificationContextType = {
    state,
    actions,
  };

  return (
    <GamificationContext.Provider value={contextValue}>
      {children}
    </GamificationContext.Provider>
  );
};
