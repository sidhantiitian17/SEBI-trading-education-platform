'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  TrendingUp,
  Target,
  BarChart3,
  BookOpen,
  Zap,
  Shield,
  PieChart,
  Activity
} from 'lucide-react';

export default function PracticePage() {
  const [marketData, setMarketData] = useState<any[]>([]);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/trading/market-data?type=stocks');
      const data = await response.json();
      if (data.success) {
        setMarketData(data.data.slice(0, 5)); // Show first 5 stocks
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  };

  const practiceModules = [
    {
      id: 'virtual-trading',
      title: 'Virtual Trading Simulator',
      description: 'Practice trading with virtual money using real market data',
      icon: TrendingUp,
      difficulty: 'Beginner',
      estimatedTime: '30-60 min',
      features: ['Real-time market data', 'Virtual portfolio', 'Risk-free trading', 'Performance tracking'],
      href: '/trading'
    },
    {
      id: 'algo-trading-simulator',
      title: 'Algorithmic Trading Simulator',
      description: 'Test and refine trading algorithms with historical data',
      icon: Activity,
      difficulty: 'Advanced',
      estimatedTime: '45-90 min',
      features: ['Backtesting', 'Strategy builder', 'Performance metrics', 'Risk analysis'],
      href: '/algo-trading-simulator'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment Practice',
      description: 'Learn to assess and manage investment risks',
      icon: Shield,
      difficulty: 'Intermediate',
      estimatedTime: '20-40 min',
      features: ['Portfolio analysis', 'Risk metrics', 'Diversification tools', 'Scenario planning'],
      href: '/risk-assessment'
    },
    {
      id: 'portfolio-diversification',
      title: 'Portfolio Diversification',
      description: 'Build and optimize diversified investment portfolios',
      icon: PieChart,
      difficulty: 'Intermediate',
      estimatedTime: '25-50 min',
      features: ['Asset allocation', 'Correlation analysis', 'Optimization tools', 'Performance comparison'],
      href: '/portfolio-diversification'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Practice Zone</h1>
        <p className="text-lg text-muted-foreground">
          Hone your trading skills with interactive simulations and real market data
        </p>
      </div>

      {/* Market Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Live Market Data
          </CardTitle>
          <CardDescription>
            Practice with real-time delayed market data (15-minute delay)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {marketData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {marketData.map((stock) => (
                <div key={stock.symbol} className="text-center p-4 border rounded-lg">
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-2xl font-bold">₹{stock.price.toFixed(2)}</div>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Loading market data...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Practice Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {practiceModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {module.estimatedTime}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {module.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={module.href}>
                    <Button className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Jump into practice with these popular activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/learn">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Review Concepts</span>
              </Button>
            </Link>
            <Link href="/assess">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Target className="w-6 h-6" />
                <span>Take Quiz</span>
              </Button>
            </Link>
            <Link href="/progress-analytics">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Progress</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
