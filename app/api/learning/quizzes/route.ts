import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { QuizScore, ApiResponse } from '@/lib/types';

// Mock quiz scores storage
let quizScores: QuizScore[] = [];

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

// Mock quiz data (in a real app, this would come from the modules data)
const quizData = {
  'quiz-1': {
    id: 'quiz-1',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is the primary stock exchange in India?',
        options: ['NSE', 'BSE', 'NYSE', 'LSE'],
        correctAnswer: '0',
        points: 10,
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What does IPO stand for?',
        options: ['Initial Public Offering', 'Indian Price Organization', 'Investment Portfolio Option', 'International Purchase Order'],
        correctAnswer: '0',
        points: 10,
      },
    ],
    passingScore: 70,
    timeLimit: 30,
  },
  'quiz-2': {
    id: 'quiz-2',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What does a candlestick chart show?',
        options: ['Only closing prices', 'Open, high, low, close prices', 'Only volume', 'Only dividends'],
        correctAnswer: '1',
        points: 10,
      },
    ],
    passingScore: 75,
    timeLimit: 45,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // For demo purposes, use a default user ID if not authenticated
    const demoUserId = userId || 'demo-user-123';

    const { quizId, answers, timeTaken } = await request.json();

    const quiz = quizData[quizId as keyof typeof quizData];
    if (!quiz) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Quiz not found',
      }, { status: 404 });
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    const results = quiz.questions.map((question, index) => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        totalScore += question.points;
      }

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
      };
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= quiz.passingScore;

    // Check if user has already taken this quiz
    const existingScoreIndex = quizScores.findIndex(
      score => score.quizId === quizId && score.userId === demoUserId
    );

    const quizScore: QuizScore = {
      quizId,
      score: totalScore,
      maxScore,
      timeTaken,
      completedAt: new Date(),
      attempts: existingScoreIndex >= 0 ? quizScores[existingScoreIndex].attempts + 1 : 1,
      userId: demoUserId,
    };

    if (existingScoreIndex >= 0) {
      quizScores[existingScoreIndex] = quizScore;
    } else {
      quizScores.push(quizScore);
    }

    const response: ApiResponse<{
      score: number;
      maxScore: number;
      percentage: number;
      passed: boolean;
      results: any[];
      attempts: number;
    }> = {
      success: true,
      data: {
        score: totalScore,
        maxScore,
        percentage,
        passed,
        results,
        attempts: quizScore.attempts,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Submit quiz error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Allow demo access without authentication for better UX
    const userId = getUserFromToken(request);
    // For demo purposes, use a default user ID if not authenticated
    const demoUserId = userId || 'demo-user-123';

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (quizId) {
      // Get specific quiz score
      const score = quizScores.find(
        s => s.quizId === quizId && s.userId === demoUserId
      );

      const response: ApiResponse<QuizScore | null> = {
        success: true,
        data: score || null,
      };

      return NextResponse.json(response);
    } else {
      // Get all quiz scores for user
      const userScores = quizScores.filter(s => s.userId === userId);

      const response: ApiResponse<QuizScore[]> = {
        success: true,
        data: userScores,
      };

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Get quiz scores error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
