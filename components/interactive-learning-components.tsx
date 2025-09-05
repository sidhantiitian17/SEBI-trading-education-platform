/**
 * Interactive Learning Components
 * Immersive experiences for enhanced learning
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// 3D Portfolio Visualization Component
interface Portfolio3DVisualizationProps {
  portfolio: {
    stocks: Array<{
      symbol: string;
      shares: number;
      currentPrice: number;
      change: number;
      weight: number;
    }>;
    totalValue: number;
    totalChange: number;
  };
  className?: string;
}

export const Portfolio3DVisualization: React.FC<Portfolio3DVisualizationProps> = ({
  portfolio,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw 3D portfolio visualization
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.6;

      let currentAngle = rotation;

      portfolio.stocks.forEach((stock, index) => {
        const sliceAngle = (stock.weight / 100) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;

        // 3D effect
        const depth = 20;
        const colors = [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
          '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
        ];

        // Draw 3D slice
        ctx.save();
        ctx.translate(centerX, centerY);

        // Side face
        ctx.fillStyle = colors[index % colors.length];
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.lineTo(radius * Math.cos(endAngle), radius * Math.sin(endAngle) + depth);
        ctx.arc(0, depth, radius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fill();

        // Top face
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.lineTo(radius * Math.cos(endAngle), radius * Math.sin(endAngle));
        ctx.arc(0, 0, radius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fill();

        // Label
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = labelRadius * Math.cos(labelAngle);
        const labelY = labelRadius * Math.sin(labelAngle);

        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(stock.symbol, labelX, labelY);

        ctx.restore();

        currentAngle = endAngle;
      });

      if (isPlaying) {
        setRotation(prev => prev + 0.01);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [portfolio, isPlaying]);

  return (
    <Card className={`interactive-portfolio-3d ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            3D Portfolio Visualization
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation(0)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border rounded-lg bg-gray-50"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Total Value: ${portfolio.totalValue.toLocaleString()}</span>
              <span className={`flex items-center gap-1 ${
                portfolio.totalChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-4 w-4" />
                {portfolio.totalChange >= 0 ? '+' : ''}{portfolio.totalChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {portfolio.stocks.slice(0, 4).map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
              <span className="font-medium">{stock.symbol}</span>
              <span className={`${
                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Interactive Risk Assessment Tool
interface RiskAssessmentToolProps {
  userProfile: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentGoals: string[];
    timeHorizon: number;
    currentPortfolio: any[];
  };
  onRiskUpdate: (newRisk: string) => void;
  className?: string;
}

export const InteractiveRiskAssessmentTool: React.FC<RiskAssessmentToolProps> = ({
  userProfile,
  onRiskUpdate,
  className = ''
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "How would you react if your investment lost 20% in a month?",
      options: [
        { text: "Sell everything immediately", score: 1 },
        { text: "Sell some to cut losses", score: 2 },
        { text: "Hold and wait for recovery", score: 3 },
        { text: "Buy more at the lower price", score: 4 }
      ]
    },
    {
      question: "What's your investment time horizon?",
      options: [
        { text: "Less than 1 year", score: 1 },
        { text: "1-3 years", score: 2 },
        { text: "3-7 years", score: 3 },
        { text: "More than 7 years", score: 4 }
      ]
    },
    {
      question: "How much of your portfolio would you allocate to stocks?",
      options: [
        { text: "0-20%", score: 1 },
        { text: "20-50%", score: 2 },
        { text: "50-80%", score: 3 },
        { text: "80-100%", score: 4 }
      ]
    }
  ];

  const calculateRiskProfile = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / questions.length;

    if (avgScore <= 1.5) return 'conservative';
    if (avgScore <= 2.5) return 'moderate';
    return 'aggressive';
  };

  const handleAnswer = (questionIndex: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex.toString()]: score }));

    if (questionIndex < questions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const riskProfile = calculateRiskProfile();
    const recommendations = {
      conservative: {
        allocation: "60% Bonds, 30% Cash, 10% Stocks",
        description: "Focus on capital preservation with steady, low-risk returns"
      },
      moderate: {
        allocation: "40% Stocks, 40% Bonds, 20% Cash",
        description: "Balance growth and stability for medium-term goals"
      },
      aggressive: {
        allocation: "70% Stocks, 20% Bonds, 10% Cash",
        description: "Pursue high growth with acceptance of higher volatility"
      }
    };

    return (
      <Card className={`interactive-risk-assessment ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Risk Assessment Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">
              {riskProfile === 'conservative' ? '🛡️' :
               riskProfile === 'moderate' ? '⚖️' : '🚀'}
            </div>
            <h3 className="text-2xl font-bold capitalize mb-2">{riskProfile} Investor</h3>
            <p className="text-gray-600">{recommendations[riskProfile].description}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">Recommended Allocation</h4>
            <p className="text-sm text-gray-600">{recommendations[riskProfile].allocation}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onRiskUpdate(riskProfile)}
              className="flex-1"
            >
              Update My Profile
            </Button>
            <Button
              variant="outline"
              onClick={resetAssessment}
              className="flex-1"
            >
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className={`interactive-risk-assessment ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Risk Tolerance Assessment
        </CardTitle>
        <Progress value={progress} className="mt-2" />
        <p className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswer(currentQuestion, option.score)}
              >
                <div>
                  <div className="font-medium">{option.text}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Risk Score: {option.score}/4
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Current: {userProfile.riskTolerance}</span>
          <span>Time Horizon: {userProfile.timeHorizon} years</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Interactive Market Scenario Simulator
interface MarketScenarioSimulatorProps {
  scenarios: Array<{
    id: string;
    name: string;
    description: string;
    marketCondition: 'bull' | 'bear' | 'sideways' | 'volatile';
    initialPortfolio: number;
    events: Array<{
      day: number;
      event: string;
      impact: number;
      description: string;
    }>;
  }>;
  onScenarioComplete: (scenarioId: string, finalValue: number, decisions: any[]) => void;
  className?: string;
}

export const MarketScenarioSimulator: React.FC<MarketScenarioSimulatorProps> = ({
  scenarios,
  onScenarioComplete,
  className = ''
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = scenarios.find(s => s.id === selectedScenario);

  useEffect(() => {
    if (!scenario || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentDay(prev => {
        const nextDay = prev + 1;
        const event = scenario.events.find(e => e.day === nextDay);

        if (event) {
          setPortfolioValue(currentValue =>
            currentValue * (1 + event.impact / 100)
          );
        }

        if (nextDay >= 30) { // 30-day simulation
          setIsPlaying(false);
          onScenarioComplete(scenario.id, portfolioValue, decisions);
          return 0;
        }

        return nextDay;
      });
    }, 1000); // 1 second per day

    return () => clearInterval(interval);
  }, [scenario, isPlaying, portfolioValue, decisions, onScenarioComplete]);

  const handleDecision = (decision: string) => {
    setDecisions(prev => [...prev, {
      day: currentDay,
      decision,
      portfolioValue
    }]);
  };

  const resetSimulation = () => {
    setCurrentDay(0);
    setPortfolioValue(scenario?.initialPortfolio || 100000);
    setDecisions([]);
    setIsPlaying(false);
  };

  if (!selectedScenario) {
    return (
      <Card className={`market-scenario-simulator ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Scenario Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{scenario.name}</h3>
                  <Badge variant={
                    scenario.marketCondition === 'bull' ? 'default' :
                    scenario.marketCondition === 'bear' ? 'destructive' :
                    'secondary'
                  }>
                    {scenario.marketCondition}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{scenario.description}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Initial Portfolio: </span>
                  ${scenario.initialPortfolio.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scenario) return null;

  const currentEvent = scenario.events.find(e => e.day === currentDay);
  const progress = (currentDay / 30) * 100;

  return (
    <Card className={`market-scenario-simulator ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {scenario.name}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentDay >= 30}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedScenario(null)}
            >
              Back
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Day {currentDay}/30</span>
            <span className="text-sm font-medium">
              Portfolio: ${portfolioValue.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${((portfolioValue - scenario.initialPortfolio) / scenario.initialPortfolio * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Return</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {decisions.length}
              </div>
              <div className="text-sm text-gray-600">Decisions Made</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {scenario.marketCondition}
              </div>
              <div className="text-sm text-gray-600">Market Condition</div>
            </div>
          </div>
        </div>

        {currentEvent && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Market Event - Day {currentEvent.day}</h4>
            <p className="text-yellow-700 mb-2">{currentEvent.event}</p>
            <p className="text-sm text-yellow-600">{currentEvent.description}</p>
            <div className="mt-2 text-sm font-medium">
              Impact: {currentEvent.impact >= 0 ? '+' : ''}{currentEvent.impact}%
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleDecision('hold')}
            disabled={!isPlaying}
          >
            Hold Position
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDecision('buy_more')}
            disabled={!isPlaying}
          >
            Buy More
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDecision('sell_some')}
            disabled={!isPlaying}
          >
            Sell Some
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDecision('diversify')}
            disabled={!isPlaying}
          >
            Diversify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default {
  Portfolio3DVisualization,
  InteractiveRiskAssessmentTool,
  MarketScenarioSimulator
};
