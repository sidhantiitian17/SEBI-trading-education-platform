import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '@/lib/types';

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
    learningVelocity: number; // modules per week
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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserFromToken(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Mock data for demonstration
const mockAnalytics: LearningAnalytics = {
  userId: 'user-1',
  overallProgress: {
    completionPercentage: 65,
    totalModules: 8,
    completedModules: 5,
    currentModule: 'module-6',
    estimatedTimeRemaining: 180
  },
  performanceMetrics: {
    averageQuizScore: 82,
    totalQuizAttempts: 24,
    bestPerformingTopics: ['Technical Analysis', 'Risk Management'],
    areasNeedingImprovement: ['Algorithmic Trading', 'Fundamental Analysis'],
    learningStreak: 7,
    totalStudyTime: 420
  },
  learningPatterns: {
    preferredStudyTimes: ['Evening (6-9 PM)', 'Weekend mornings'],
    averageSessionDuration: 45,
    mostActiveDays: ['Monday', 'Wednesday', 'Saturday'],
    learningVelocity: 0.8
  },
  recommendations: {
    nextRecommendedModule: 'module-7',
    suggestedStudyPlan: [
      {
        moduleId: 'module-6',
        title: 'Algorithmic Trading',
        estimatedTime: 120,
        priority: 'high',
        reason: 'Builds foundation for advanced trading concepts'
      },
      {
        moduleId: 'module-7',
        title: 'High-Frequency Trading',
        estimatedTime: 150,
        priority: 'medium',
        reason: 'Complements algorithmic trading knowledge'
      },
      {
        moduleId: 'module-8',
        title: 'Advanced Algorithmic Trading',
        estimatedTime: 180,
        priority: 'medium',
        reason: 'Advanced concepts for experienced traders'
      }
    ],
    focusAreas: ['Backtesting strategies', 'Risk management techniques'],
    estimatedCompletionTime: 450
  },
  achievements: {
    recentAchievements: [
      {
        id: 'ach-1',
        title: 'Quiz Master',
        description: 'Scored 90% or higher on 5 consecutive quizzes',
        earnedAt: new Date('2024-09-01'),
        type: 'performance'
      },
      {
        id: 'ach-2',
        title: 'Dedicated Learner',
        description: 'Maintained a 7-day learning streak',
        earnedAt: new Date('2024-09-03'),
        type: 'streak'
      }
    ],
    upcomingMilestones: [
      {
        id: 'mil-1',
        title: 'Halfway Champion',
        description: 'Complete 50% of all modules',
        progress: 5,
        target: 8,
        type: 'modules'
      },
      {
        id: 'mil-2',
        title: 'Study Marathon',
        description: 'Accumulate 500 minutes of study time',
        progress: 420,
        target: 500,
        type: 'study_time'
      }
    ],
    progressTowardsGoals: [
      {
        goalId: 'goal-1',
        title: 'Complete Trading Education',
        current: 5,
        target: 8,
        percentage: 62.5,
        deadline: new Date('2024-12-31')
      },
      {
        goalId: 'goal-2',
        title: 'Master Technical Analysis',
        current: 95,
        target: 100,
        percentage: 95,
        deadline: new Date('2024-10-15')
      }
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // Note: We'll allow unauthenticated access for demo purposes
    // if (!userId) {
    //   return NextResponse.json<ApiResponse<null>>({
    //     success: false,
    //     error: 'Unauthorized',
    //   }, { status: 401 });
    // }

    // In a real application, you would fetch analytics based on userId
    // For now, return mock data
    const analytics = mockAnalytics;

    const response: ApiResponse<LearningAnalytics> = {
      success: true,
      data: analytics,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { action, data } = await request.json();

    // Handle different analytics actions
    switch (action) {
      case 'generate_study_plan':
        // Generate personalized study plan based on user performance
        const studyPlan = generateStudyPlan(data.userPerformance, data.preferences);
        return NextResponse.json<ApiResponse<StudyPlanItem[]>>({
          success: true,
          data: studyPlan,
        });

      case 'update_learning_goals':
        // Update user's learning goals and track progress
        const updatedGoals = updateLearningGoals(data.goals);
        return NextResponse.json<ApiResponse<GoalProgress[]>>({
          success: true,
          data: updatedGoals,
        });

      case 'analyze_performance':
        // Analyze quiz performance and provide insights
        const insights = analyzePerformance(data.quizHistory, data.moduleProgress);
        return NextResponse.json<ApiResponse<any>>({
          success: true,
          data: insights,
        });

      default:
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Invalid action',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics action error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// Helper functions for analytics
function generateStudyPlan(userPerformance: any, preferences: any): StudyPlanItem[] {
  // Logic to generate personalized study plan
  return [
    {
      moduleId: 'module-6',
      title: 'Algorithmic Trading',
      estimatedTime: 120,
      priority: 'high',
      reason: 'Strong foundation needed for advanced concepts'
    },
    {
      moduleId: 'module-3',
      title: 'Fundamental Analysis',
      estimatedTime: 90,
      priority: 'medium',
      reason: 'Improve understanding of company valuation'
    }
  ];
}

function updateLearningGoals(goals: any[]): GoalProgress[] {
  // Logic to update and track goal progress
  return goals.map(goal => ({
    ...goal,
    percentage: (goal.current / goal.target) * 100
  }));
}

function analyzePerformance(quizHistory: any[], moduleProgress: any[]): any {
  // Logic to analyze performance patterns
  const averageScore = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / quizHistory.length;
  const weakAreas = quizHistory
    .filter(quiz => quiz.score < 70)
    .map(quiz => quiz.topic);

  return {
    averageScore,
    weakAreas,
    improvementSuggestions: [
      'Focus on fundamental analysis concepts',
      'Practice more technical analysis patterns',
      'Review risk management strategies'
    ]
  };
}
