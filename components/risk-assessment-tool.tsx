"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';

interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  valueAtRisk: number;
}

interface PortfolioAsset {
  symbol: string;
  name: string;
  allocation: number;
  expectedReturn: number;
  volatility: number;
  beta: number;
}

export function RiskAssessmentTool() {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([
    { symbol: 'RELIANCE', name: 'Reliance Industries', allocation: 25, expectedReturn: 12, volatility: 18, beta: 1.2 },
    { symbol: 'TCS', name: 'Tata Consultancy', allocation: 20, expectedReturn: 15, volatility: 22, beta: 0.8 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', allocation: 15, expectedReturn: 14, volatility: 25, beta: 1.1 },
    { symbol: 'INFY', name: 'Infosys', allocation: 15, expectedReturn: 13, volatility: 20, beta: 0.9 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', allocation: 10, expectedReturn: 16, volatility: 28, beta: 1.3 },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', allocation: 10, expectedReturn: 18, volatility: 30, beta: 1.4 },
    { symbol: 'ITC', name: 'ITC Ltd', allocation: 5, expectedReturn: 10, volatility: 15, beta: 0.7 },
  ]);

  const [riskTolerance, setRiskTolerance] = useState(50);
  const [timeHorizon, setTimeHorizon] = useState(5);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    beta: 0,
    alpha: 0,
    valueAtRisk: 0,
  });

  // Calculate portfolio risk metrics
  useEffect(() => {
    const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);

    if (totalAllocation === 0) return;

    // Calculate weighted averages
    const weightedReturn = portfolio.reduce((sum, asset) =>
      sum + (asset.expectedReturn * asset.allocation / totalAllocation), 0);

    const weightedVolatility = Math.sqrt(
      portfolio.reduce((sum, asset) =>
        sum + Math.pow(asset.volatility / 100 * asset.allocation / totalAllocation, 2), 0)
    ) * 100;

    const weightedBeta = portfolio.reduce((sum, asset) =>
      sum + (asset.beta * asset.allocation / totalAllocation), 0);

    // Calculate Sharpe ratio (assuming risk-free rate of 6%)
    const riskFreeRate = 6;
    const sharpeRatio = (weightedReturn - riskFreeRate) / weightedVolatility;

    // Estimate other metrics
    const maxDrawdown = weightedVolatility * 2.5; // Rough estimate
    const alpha = weightedReturn - (riskFreeRate + weightedBeta * (12 - riskFreeRate)); // Market return assumed 12%
    const valueAtRisk = -weightedVolatility * 1.645; // 95% confidence, normal distribution

    setRiskMetrics({
      volatility: weightedVolatility,
      sharpeRatio,
      maxDrawdown,
      beta: weightedBeta,
      alpha,
      valueAtRisk,
    });
  }, [portfolio]);

  const updateAllocation = (symbol: string, newAllocation: number) => {
    setPortfolio(prev =>
      prev.map(asset =>
        asset.symbol === symbol
          ? { ...asset, allocation: Math.max(0, Math.min(100, newAllocation)) }
          : asset
      )
    );
  };

  const getRiskLevel = () => {
    if (riskMetrics.volatility < 15) return { level: 'Low', color: 'text-green-600', icon: CheckCircle };
    if (riskMetrics.volatility < 25) return { level: 'Moderate', color: 'text-yellow-600', icon: AlertTriangle };
    return { level: 'High', color: 'text-red-600', icon: AlertTriangle };
  };

  const getRecommendations = () => {
    const recommendations = [];

    if (riskMetrics.volatility > 30) {
      recommendations.push("Consider reducing exposure to high-volatility assets");
    }

    if (riskMetrics.sharpeRatio < 0.5) {
      recommendations.push("Portfolio returns may not justify the risk taken");
    }

    if (riskMetrics.beta > 1.2) {
      recommendations.push("Portfolio is more volatile than the market - consider diversification");
    }

    if (portfolio.length < 5) {
      recommendations.push("Consider adding more assets for better diversification");
    }

    const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
    if (Math.abs(totalAllocation - 100) > 1) {
      recommendations.push("Adjust allocations to total 100%");
    }

    return recommendations;
  };

  const riskLevel = getRiskLevel();
  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* Risk Tolerance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Risk Assessment Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Risk Tolerance (1-100)</label>
            <Slider
              value={[riskTolerance]}
              onValueChange={(value) => setRiskTolerance(value[0])}
              max={100}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Conservative</span>
              <span className="font-medium">{riskTolerance}</span>
              <span>Aggressive</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Investment Time Horizon (Years)</label>
            <Slider
              value={[timeHorizon]}
              onValueChange={(value) => setTimeHorizon(value[0])}
              max={30}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 Year</span>
              <span className="font-medium">{timeHorizon} Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio Allocation</TabsTrigger>
          <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
          <TabsTrigger value="analysis">Analysis & Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{asset.symbol}</h4>
                        <Badge variant="outline">{asset.name}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Expected Return: {asset.expectedReturn}%</span>
                        <span>Volatility: {asset.volatility}%</span>
                        <span>Beta: {asset.beta}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{asset.allocation}%</div>
                        <div className="text-sm text-muted-foreground">Allocation</div>
                      </div>
                      <Slider
                        value={[asset.allocation]}
                        onValueChange={(value) => updateAllocation(asset.symbol, value[0])}
                        max={100}
                        min={0}
                        step={1}
                        className="w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Portfolio Volatility</p>
                    <p className="text-2xl font-bold">{riskMetrics.volatility.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">{riskMetrics.sharpeRatio.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Beta</p>
                    <p className="text-2xl font-bold">{riskMetrics.beta.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Max Drawdown</p>
                    <p className="text-2xl font-bold">-{riskMetrics.maxDrawdown.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Value at Risk (95%)</p>
                    <p className="text-2xl font-bold">{riskMetrics.valueAtRisk.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium">Alpha</p>
                    <p className="text-2xl font-bold">{riskMetrics.alpha.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Level Indicator */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <riskLevel.icon className={`h-5 w-5 ${riskLevel.color}`} />
                  <span className="font-semibold">Risk Level: {riskLevel.level}</span>
                </div>
                <Badge variant={riskLevel.level === 'Low' ? 'default' : riskLevel.level === 'Moderate' ? 'secondary' : 'destructive'}>
                  {riskLevel.level}
                </Badge>
              </div>
              <Progress
                value={Math.min(100, riskMetrics.volatility * 2)}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{rec}</AlertDescription>
                  </Alert>
                ))
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your portfolio appears well-balanced with appropriate risk management.
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Portfolio Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Assets:</span>
                    <span className="ml-2 font-medium">{portfolio.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Diversification:</span>
                    <span className="ml-2 font-medium">
                      {portfolio.filter(a => a.allocation > 0).length}/{portfolio.length} active
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risk Tolerance Match:</span>
                    <span className="ml-2 font-medium">
                      {Math.abs(riskTolerance - riskMetrics.volatility) < 10 ? 'Good' : 'Adjust Needed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time Horizon Fit:</span>
                    <span className="ml-2 font-medium">
                      {timeHorizon >= 5 ? 'Suitable' : 'Consider Longer Term'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
