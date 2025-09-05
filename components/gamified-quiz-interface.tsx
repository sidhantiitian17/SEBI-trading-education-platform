/**
 * Gamified Quiz Interface
 * Interactive quizzes with progress tracking, streaks, and rewards
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Star,
  Zap,
  Target,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number; // seconds
}

interface QuizSession {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeRemaining: number;
  score: number;
  streak: number;
  startTime: Date;
  endTime?: Date;
}

interface GamifiedQuizProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    timeLimit?: number; // total time in minutes
    passingScore: number;
    rewards: {
      xp: number;
      points: number;
      achievements?: string[];
    };
  };
  userId: string;
  onComplete: (results: {
    score: number;
    timeSpent: number;
    correctAnswers: number;
    streak: number;
    rewards: any;
  }) => void;
  className?: string;
}

export const GamifiedQuiz: React.FC<GamifiedQuizProps> = ({
  quiz,
  userId,
  onComplete,
  className = ''
}) => {
  const [session, setSession] = useState<QuizSession>({
    questions: quiz.questions,
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: (quiz.timeLimit || 30) * 60, // convert to seconds
    score: 0,
    streak: 0,
    startTime: new Date()
  });

  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout>();

  // Timer effect
  useEffect(() => {
    if (session.timeRemaining > 0 && !showResults) {
      timerRef.current = setTimeout(() => {
        setSession(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (session.timeRemaining === 0 && !showResults) {
      handleQuizComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [session.timeRemaining, showResults]);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    // Play sound effect
    if (soundEnabled) {
      const audio = new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/wrong.mp3');
      audio.play().catch(() => {}); // Ignore audio errors
    }

    setTimeout(() => {
      const newAnswers = { ...session.answers, [currentQuestion.id]: answerIndex };
      const newScore = isCorrect ? session.score + 1 : session.score;
      const newStreak = isCorrect ? session.streak + 1 : 0;

      setSession(prev => ({
        ...prev,
        answers: newAnswers,
        score: newScore,
        streak: newStreak
      }));

      // Move to next question or complete
      if (session.currentQuestionIndex < session.questions.length - 1) {
        setTimeout(() => {
          setSession(prev => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1
          }));
          setSelectedAnswer(null);
          setQuestionStartTime(Date.now());
        }, 2000);
      } else {
        handleQuizComplete();
      }
    }, 1000);
  };

  const handleQuizComplete = () => {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);

    setSession(prev => ({ ...prev, endTime }));
    setShowResults(true);

    onComplete({
      score: session.score,
      timeSpent,
      correctAnswers: session.score,
      streak: session.streak,
      rewards: quiz.rewards
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (showResults) {
    const percentage = (session.score / session.questions.length) * 100;
    const passed = percentage >= quiz.passingScore;
    const timeSpent = session.endTime ?
      Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000) : 0;

    return (
      <Card className={`gamified-quiz-results ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-6xl mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
              {passed ? '🎉' : '💪'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-600">
              {passed ? 'You passed the quiz!' : 'Try again to improve your score.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{session.score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{session.streak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Rewards Earned</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="font-medium">+{quiz.rewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">+{quiz.rewards.points} points</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              Review Answers
            </Button>
            <Button variant="outline" className="flex-1">
              Take Another Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`gamified-quiz ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {quiz.title}
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={session.timeRemaining < 300 ? 'text-red-600 font-bold' : ''}>
                {formatTime(session.timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Question {session.currentQuestionIndex + 1} of {session.questions.length}</span>
            <span>Score: {session.score}/{session.questions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
            {currentQuestion.difficulty}
          </Badge>
          <span className="text-gray-600">{currentQuestion.category}</span>
          {session.streak > 0 && (
            <div className="flex items-center gap-1 text-orange-600">
              <Zap className="h-4 w-4" />
              <span>Streak: {session.streak}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full text-left justify-start h-auto p-4 transition-all";

              if (selectedAnswer !== null) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += " bg-green-100 border-green-300 text-green-800";
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  buttonClass += " bg-red-100 border-red-300 text-red-800";
                } else {
                  buttonClass += " opacity-50";
                }
              } else {
                buttonClass += " hover:bg-gray-50 border";
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {selectedAnswer !== null && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {selectedAnswer !== null && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
            <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              if (session.currentQuestionIndex > 0) {
                setSession(prev => ({
                  ...prev,
                  currentQuestionIndex: prev.currentQuestionIndex - 1
                }));
                setSelectedAnswer(null);
                setQuestionStartTime(Date.now());
              }
            }}
            disabled={session.currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {timeSpent}s spent on this question
          </div>

          <Button
            variant="outline"
            onClick={() => {
              // Skip to next question
              if (session.currentQuestionIndex < session.questions.length - 1) {
                setSession(prev => ({
                  ...prev,
                  currentQuestionIndex: prev.currentQuestionIndex + 1
                }));
                setSelectedAnswer(null);
                setQuestionStartTime(Date.now());
              }
            }}
            disabled={session.currentQuestionIndex === session.questions.length - 1}
          >
            Skip
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Quiz Progress Tracker Component
interface QuizProgressTrackerProps {
  userId: string;
  quizHistory: Array<{
    quizId: string;
    score: number;
    completedAt: Date;
    timeSpent: number;
  }>;
  className?: string;
}

export const QuizProgressTracker: React.FC<QuizProgressTrackerProps> = ({
  userId,
  quizHistory,
  className = ''
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const getFilteredHistory = () => {
    const now = new Date();
    const filterDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return quizHistory;
    }

    return quizHistory.filter(quiz => quiz.completedAt >= filterDate);
  };

  const filteredHistory = getFilteredHistory();
  const averageScore = filteredHistory.length > 0
    ? filteredHistory.reduce((sum, quiz) => sum + quiz.score, 0) / filteredHistory.length
    : 0;

  const bestScore = Math.max(...filteredHistory.map(q => q.score), 0);
  const totalTime = filteredHistory.reduce((sum, quiz) => sum + quiz.timeSpent, 0);

  return (
    <Card className={`quiz-progress-tracker ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Quiz Progress
          </span>
          <div className="flex gap-1">
            {(['week', 'month', 'all'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{filteredHistory.length}</div>
            <div className="text-sm text-gray-600">Quizzes Taken</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{averageScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{bestScore}%</div>
            <div className="text-sm text-gray-600">Best Score</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{formatTime(totalTime)}</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Recent Quizzes</h3>
          {filteredHistory.slice(0, 5).map((quiz, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Quiz {quiz.quizId}</div>
                <div className="text-sm text-gray-600">
                  {quiz.completedAt.toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{quiz.score}%</div>
                <div className="text-sm text-gray-600">{formatTime(quiz.timeSpent)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default GamifiedQuiz;
