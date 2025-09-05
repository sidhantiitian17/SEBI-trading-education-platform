/**
 * Interactive Learning Page
 * Showcases advanced interactive learning components
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  BarChart3,
  Target,
  Activity,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import {
  Portfolio3DVisualization,
  InteractiveRiskAssessmentTool,
  MarketScenarioSimulator
} from '@/components/interactive-learning-components';
import StockTradingGame from '@/components/stock-trading-game';
import { MainLayout } from '@/components/navigation';

export default function InteractivePage() {
  const [activeTab, setActiveTab] = useState('portfolio-3d');

  // Sample data for demonstrations
  const samplePortfolio = {
    stocks: [
      { symbol: 'AAPL', shares: 100, currentPrice: 175.50, change: 2.5, weight: 25 },
      { symbol: 'GOOGL', shares: 50, currentPrice: 135.20, change: -1.2, weight: 20 },
      { symbol: 'MSFT', shares: 75, currentPrice: 335.80, change: 1.8, weight: 30 },
      { symbol: 'TSLA', shares: 25, currentPrice: 245.60, change: -3.1, weight: 15 },
      { symbol: 'NVDA', shares: 30, currentPrice: 875.30, change: 4.2, weight: 10 }
    ],
    totalValue: 125000,
    totalChange: 1.8
  };

  const sampleUserProfile = {
    riskTolerance: 'moderate' as const,
    investmentGoals: ['growth', 'income', 'preservation'],
    timeHorizon: 10,
    currentPortfolio: []
  };

  const sampleScenarios = [
    {
      id: 'bull-market',
      name: 'Bull Market Rally',
      description: 'Experience a strong market uptrend with volatility',
      marketCondition: 'bull' as const,
      initialPortfolio: 100000,
      events: [
        { day: 5, event: 'Fed Interest Rate Cut', impact: 3, description: 'Positive economic news boosts market' },
        { day: 10, event: 'Tech Earnings Beat', impact: 5, description: 'Major tech companies report better than expected earnings' },
        { day: 15, event: 'Market Correction', impact: -8, description: 'Temporary pullback due to profit taking' },
        { day: 20, event: 'Economic Recovery', impact: 4, description: 'GDP growth exceeds expectations' }
      ]
    },
    {
      id: 'bear-market',
      name: 'Market Downturn',
      description: 'Navigate through a challenging bear market',
      marketCondition: 'bear' as const,
      initialPortfolio: 100000,
      events: [
        { day: 3, event: 'Recession Fears', impact: -5, description: 'Economic indicators signal potential recession' },
        { day: 8, event: 'Banking Crisis', impact: -10, description: 'Banking sector faces significant challenges' },
        { day: 12, event: 'Policy Response', impact: 2, description: 'Government announces stimulus measures' },
        { day: 18, event: 'Recovery Signs', impact: 3, description: 'Early signs of economic recovery emerge' }
      ]
    },
    {
      id: 'volatile-market',
      name: 'High Volatility Period',
      description: 'Manage portfolio through extreme market swings',
      marketCondition: 'volatile' as const,
      initialPortfolio: 100000,
      events: [
        { day: 2, event: 'Geopolitical Tension', impact: -7, description: 'International conflict creates uncertainty' },
        { day: 6, event: 'Diplomatic Resolution', impact: 6, description: 'Positive diplomatic developments' },
        { day: 9, event: 'Supply Chain Issues', impact: -4, description: 'Manufacturing disruptions affect markets' },
        { day: 14, event: 'Innovation Breakthrough', impact: 8, description: 'Major technological advancement announced' }
      ]
    }
  ];

  const handleRiskUpdate = (newRisk: string) => {
    console.log('Risk tolerance updated to:', newRisk);
    // In a real app, this would update the user's profile
  };

  const handleScenarioComplete = (scenarioId: string, finalValue: number, decisions: any[]) => {
    console.log('Scenario completed:', { scenarioId, finalValue, decisions });
    // In a real app, this would save the results and update user progress
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interactive Learning Hub</h1>
          <p className="text-gray-600">
            Experience advanced learning through immersive 3D visualizations, interactive scenarios,
            and adaptive risk assessment tools.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio-3d" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              3D Portfolio
            </TabsTrigger>
            <TabsTrigger value="risk-assessment" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="market-scenarios" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Market Scenarios
            </TabsTrigger>
            <TabsTrigger value="trading-game" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Trading Game
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio-3d" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Portfolio3DVisualization
                  portfolio={samplePortfolio}
                  className="h-full"
                />
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Learning Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Understand portfolio diversification
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Visualize asset allocation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Analyze performance metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Learn risk management
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Value</span>
                        <span className="font-semibold">${samplePortfolio.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Change</span>
                        <span className={`font-semibold ${samplePortfolio.totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {samplePortfolio.totalChange >= 0 ? '+' : ''}{samplePortfolio.totalChange}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Top Performer</span>
                        <span className="font-semibold text-green-600">NVDA (+4.2%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Worst Performer</span>
                        <span className="font-semibold text-red-600">TSLA (-3.1%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk-assessment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InteractiveRiskAssessmentTool
                userProfile={sampleUserProfile}
                onRiskUpdate={handleRiskUpdate}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Risk Assessment Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Conservative Profile</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Focus on capital preservation with lower risk tolerance.
                      </p>
                      <div className="text-sm">
                        <strong>Allocation:</strong> 60% Bonds, 30% Cash, 10% Stocks
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Moderate Profile</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Balance growth and stability for medium-term goals.
                      </p>
                      <div className="text-sm">
                        <strong>Allocation:</strong> 40% Stocks, 40% Bonds, 20% Cash
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Aggressive Profile</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Pursue high growth with acceptance of higher volatility.
                      </p>
                      <div className="text-sm">
                        <strong>Allocation:</strong> 70% Stocks, 20% Bonds, 10% Cash
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market-scenarios" className="space-y-6">
            <MarketScenarioSimulator
              scenarios={sampleScenarios}
              onScenarioComplete={handleScenarioComplete}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Understand market cycles</li>
                    <li>• Practice risk management</li>
                    <li>• Learn decision-making under pressure</li>
                    <li>• Experience different market conditions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scenario Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Bull Markets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Bear Markets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">High Volatility</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Decision Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Assess market conditions</li>
                    <li>• Evaluate risk tolerance</li>
                    <li>• Consider time horizon</li>
                    <li>• Make informed decisions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trading-game" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Stock Trading Game</h2>
              <p className="text-gray-600">
                Practice your trading skills with virtual money. Buy and sell stocks within 60 seconds
                to maximize your profits and learn market dynamics.
              </p>
            </div>

            <StockTradingGame />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Game Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Start with ₹10,000 virtual money</li>
                    <li>• Buy and sell stocks within 60 seconds</li>
                    <li>• Monitor real-time price changes</li>
                    <li>• Goal: Maximize your portfolio value</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Understand buy/sell timing</li>
                    <li>• Learn about market volatility</li>
                    <li>• Practice risk management</li>
                    <li>• Experience real-time trading</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Watch price trends carefully</li>
                    <li>• Don't hold losing positions too long</li>
                    <li>• Take profits when stocks rise</li>
                    <li>• Manage your risk exposure</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
