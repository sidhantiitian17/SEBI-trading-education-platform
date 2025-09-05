'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CourseModule, Lesson, Quiz, UserProgress, Achievement } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface LearningState {
  modules: CourseModule[];
  currentModule: CourseModule | null;
  currentLesson: Lesson | null;
  userProgress: UserProgress;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}

type LearningAction =
  | { type: 'LOAD_MODULES_START' }
  | { type: 'LOAD_MODULES_SUCCESS'; payload: CourseModule[] }
  | { type: 'LOAD_MODULES_FAILURE'; payload: string }
  | { type: 'SET_CURRENT_MODULE'; payload: CourseModule }
  | { type: 'SET_CURRENT_LESSON'; payload: Lesson }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'COMPLETE_LESSON'; payload: { moduleId: string; lessonId: string } }
  | { type: 'COMPLETE_QUIZ'; payload: { moduleId: string; score: number; userId: string } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'CLEAR_ERROR' };

const initialState: LearningState = {
  modules: [],
  currentModule: null,
  currentLesson: null,
  userProgress: {
    completedModules: [],
    currentModule: '',
    quizScores: [],
    learningStreak: 0,
    totalStudyTime: 0,
    certificates: [],
  },
  achievements: [],
  isLoading: false,
  error: null,
};

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case 'LOAD_MODULES_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOAD_MODULES_SUCCESS':
      return {
        ...state,
        modules: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOAD_MODULES_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_CURRENT_MODULE':
      return {
        ...state,
        currentModule: action.payload,
      };
    case 'SET_CURRENT_LESSON':
      return {
        ...state,
        currentLesson: action.payload,
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: { ...state.userProgress, ...action.payload },
      };
    case 'COMPLETE_LESSON':
      const { moduleId, lessonId } = action.payload;
      const updatedModules = state.modules.map(module => {
        if (module.id === moduleId) {
          const updatedLessons = module.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          );
          return { ...module, lessons: updatedLessons };
        }
        return module;
      });
      return {
        ...state,
        modules: updatedModules,
      };
    case 'COMPLETE_QUIZ':
      const { moduleId: quizModuleId, score, userId } = action.payload;
      const newQuizScore = {
        quizId: quizModuleId,
        userId,
        score,
        maxScore: 100,
        timeTaken: 0,
        completedAt: new Date(),
        attempts: 1,
      };
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          quizScores: [...state.userProgress.quizScores, newQuizScore],
        },
      };
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface LearningContextType extends LearningState {
  loadModules: () => Promise<void>;
  setCurrentModule: (module: CourseModule) => void;
  setCurrentLesson: (lesson: Lesson) => void;
  completeLesson: (moduleId: string, lessonId: string) => Promise<void>;
  completeQuiz: (moduleId: string, score: number) => Promise<void>;
  updateProgress: (progress: Partial<UserProgress>) => void;
  clearError: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function useLearning() {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}

interface LearningProviderProps {
  children: ReactNode;
}

export function LearningProvider({ children }: LearningProviderProps) {
  const [state, dispatch] = useReducer(learningReducer, initialState);
  const { user } = useAuth();

  // Load modules on mount
  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    dispatch({ type: 'LOAD_MODULES_START' });

    try {
      const response = await fetch('/api/learning/modules');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load modules');
      }

      dispatch({
        type: 'LOAD_MODULES_SUCCESS',
        payload: data.modules,
      });
    } catch (error) {
      dispatch({
        type: 'LOAD_MODULES_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to load modules',
      });
    }
  };

  const setCurrentModule = (module: CourseModule) => {
    dispatch({ type: 'SET_CURRENT_MODULE', payload: module });
  };

  const setCurrentLesson = (lesson: Lesson) => {
    dispatch({ type: 'SET_CURRENT_LESSON', payload: lesson });
  };

  const completeLesson = async (moduleId: string, lessonId: string) => {
    try {
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lesson_complete',
          moduleId,
          lessonId,
        }),
      });

      if (response.ok) {
        dispatch({
          type: 'COMPLETE_LESSON',
          payload: { moduleId, lessonId },
        });

        // Award XP for completing lesson
        await fetch('/api/gamification/xp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'lesson_completed',
            amount: 25,
            description: 'Completed a lesson',
            metadata: { moduleId, lessonId },
          }),
        });

        // Check and award streak bonus
        await checkAndAwardStreakBonus();
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const completeQuiz = async (moduleId: string, score: number) => {
    try {
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'quiz_complete',
          moduleId,
          score,
        }),
      });

      if (response.ok) {
        dispatch({
          type: 'COMPLETE_QUIZ',
          payload: { moduleId, score, userId: user?.id || '' },
        });

        // Award XP based on quiz score
        let xpAmount = 50; // Base XP for completing quiz
        if (score >= 90) xpAmount = 100; // Bonus for high score
        else if (score >= 80) xpAmount = 75; // Bonus for good score

        await fetch('/api/gamification/xp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'quiz_passed',
            amount: xpAmount,
            description: `Passed quiz with ${score}% score`,
            metadata: { moduleId, score },
          }),
        });
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  const updateProgress = (progress: Partial<UserProgress>) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
  };

  const checkAndAwardStreakBonus = async () => {
    try {
      // Get current user stats to check streak
      const statsResponse = await fetch('/api/gamification/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        const currentStreak = statsData.stats.currentStreak;

        // Award bonus XP for streak milestones
        if (currentStreak === 7) {
          await fetch('/api/gamification/xp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'streak_milestone',
              amount: 100,
              description: '7-day learning streak achieved!',
              metadata: { streakDays: currentStreak },
            }),
          });
        } else if (currentStreak === 30) {
          await fetch('/api/gamification/xp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'streak_milestone',
              amount: 500,
              description: '30-day learning streak achieved!',
              metadata: { streakDays: currentStreak },
            }),
          });
        }
      }
    } catch (error) {
      console.error('Error checking streak bonus:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: LearningContextType = {
    ...state,
    loadModules,
    setCurrentModule,
    setCurrentLesson,
    completeLesson,
    completeQuiz,
    updateProgress,
    clearError,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}
