"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Target,
  Shuffle,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  sector: string;
  country: string;
  expectedReturn: number;
  volatility: number;
  correlation: { [key: string]: number };
}

interface Portfolio {
  assets: { [symbol: string]: number }; // symbol -> allocation percentage
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

const AVAILABLE_ASSETS: Asset[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    sector: 'Energy',
    country: 'India',
    expectedReturn: 12,
    volatility: 18,
    correlation: { 'TCS': 0.3, 'HDFCBANK': 0.4, 'INFY': 0.2, 'ITC': 0.5, 'BAJFINANCE': 0.3 }
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy',
    sector: 'Technology',
    country: 'India',
    expectedReturn: 15,
    volatility: 22,
    correlation: { 'RELIANCE': 0.3, 'HDFCBANK': 0.2, 'INFY': 0.8, 'ITC': 0.1, 'BAJFINANCE': 0.2 }
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    sector: 'Banking',
    country: 'India',
    expectedReturn: 14,
    volatility: 25,
    correlation: { 'RELIANCE': 0.4, 'TCS': 0.2, 'INFY': 0.3, 'ITC': 0.6, 'BAJFINANCE': 0.7 }
  },
  {
    symbol: 'INFY',
    name: 'Infosys',
    sector: 'Technology',
    country: 'India',
    expectedReturn: 13,
    volatility: 20,
    correlation: { 'RELIANCE': 0.2, 'TCS': 0.8, 'HDFCBANK': 0.3, 'ITC': 0.1, 'BAJFINANCE': 0.2 }
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd',
    sector: 'Consumer Goods',
    country: 'India',
    expectedReturn: 10,
    volatility: 15,
    correlation: { 'RELIANCE': 0.5, 'TCS': 0.1, 'HDFCBANK': 0.6, 'INFY': 0.1, 'BAJFINANCE': 0.4 }
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance',
    sector: 'Financial Services',
    country: 'India',
    expectedReturn: 18,
    volatility: 30,
    correlation: { 'RELIANCE': 0.3, 'TCS': 0.2, 'HDFCBANK': 0.7, 'INFY': 0.2, 'ITC': 0.4 }
  },
  {
    symbol: 'ADANIPORTS',
    name: 'Adani Ports',
    sector: 'Infrastructure',
    country: 'India',
    expectedReturn: 16,
    volatility: 28,
    correlation: { 'RELIANCE': 0.6, 'TCS': 0.1, 'HDFCBANK': 0.3, 'INFY': 0.1, 'ITC': 0.4, 'BAJFINANCE': 0.2 }
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki',
    sector: 'Automotive',
    country: 'India',
    expectedReturn: 11,
    volatility: 19,
    correlation: { 'RELIANCE': 0.4, 'TCS': 0.2, 'HDFCBANK': 0.5, 'INFY': 0.2, 'ITC': 0.7, 'BAJFINANCE': 0.3, 'ADANIPORTS': 0.3 }
  },
];

export function PortfolioDiversificationTool() {
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio>({
    assets: {
      'RELIANCE': 30,
      'TCS': 25,
      'HDFCBANK': 20,
      'INFY': 15,
      'ITC': 10,
    },
    expectedReturn: 0,
    volatility: 0,
    sharpeRatio: 0,
  });

  const [optimizationStrategy, setOptimizationStrategy] = useState<'max-sharpe' | 'min-volatility' | 'equal-weight' | 'sector-balanced'>('equal-weight');
  const [optimizedPortfolio, setOptimizedPortfolio] = useState<Portfolio | null>(null);
  const [riskTolerance, setRiskTolerance] = useState(50);

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = (assets: { [symbol: string]: number }): Portfolio => {
    const totalAllocation = Object.values(assets).reduce((sum, val) => sum + val, 0);

    if (totalAllocation === 0) {
      return { assets: {}, expectedReturn: 0, volatility: 0, sharpeRatio: 0 };
    }

    // Normalize allocations
    const normalizedAssets: { [symbol: string]: number } = {};
    Object.keys(assets).forEach(symbol => {
      normalizedAssets[symbol] = (assets[symbol] / totalAllocation) * 100;
    });

    // Calculate expected return
    let expectedReturn = 0;
    Object.keys(normalizedAssets).forEach(symbol => {
      const asset = AVAILABLE_ASSETS.find(a => a.symbol === symbol);
      if (asset) {
        expectedReturn += (asset.expectedReturn * normalizedAssets[symbol]) / 100;
      }
    });

    // Calculate volatility (simplified - using correlation matrix)
    let variance = 0;
    Object.keys(normalizedAssets).forEach(symbol1 => {
      const asset1 = AVAILABLE_ASSETS.find(a => a.symbol === symbol1);
      if (!asset1) return;

      const weight1 = normalizedAssets[symbol1] / 100;
      const vol1 = asset1.volatility / 100;

      // Add variance from asset itself
      variance += Math.pow(weight1 * vol1, 2);

      // Add covariance with other assets
      Object.keys(normalizedAssets).forEach(symbol2 => {
        if (symbol1 === symbol2) return;

        const asset2 = AVAILABLE_ASSETS.find(a => a.symbol === symbol2);
        if (!asset2) return;

        const weight2 = normalizedAssets[symbol2] / 100;
        const vol2 = asset2.volatility / 100;
        const correlation = asset1.correlation[symbol2] || asset2.correlation[symbol1] || 0.3;

        variance += 2 * weight1 * weight2 * vol1 * vol2 * correlation;
      });
    });

    const volatility = Math.sqrt(variance) * 100;

    // Calculate Sharpe ratio (assuming 6% risk-free rate)
    const sharpeRatio = volatility > 0 ? (expectedReturn - 6) / volatility : 0;

    return {
      assets: normalizedAssets,
      expectedReturn,
      volatility,
      sharpeRatio,
    };
  };

  // Update current portfolio metrics
  useEffect(() => {
    const metrics = calculatePortfolioMetrics(currentPortfolio.assets);
    setCurrentPortfolio(prev => ({ ...prev, ...metrics }));
  }, [currentPortfolio.assets]);

  // Optimize portfolio based on strategy
  const optimizePortfolio = () => {
    let optimizedAssets: { [symbol: string]: number } = {};

    switch (optimizationStrategy) {
      case 'equal-weight':
        const equalWeight = 100 / AVAILABLE_ASSETS.length;
        AVAILABLE_ASSETS.forEach(asset => {
          optimizedAssets[asset.symbol] = equalWeight;
        });
        break;

      case 'max-sharpe':
        // Simplified: favor assets with good risk-adjusted returns
        const sortedAssets = [...AVAILABLE_ASSETS].sort((a, b) =>
          (b.expectedReturn / b.volatility) - (a.expectedReturn / a.volatility)
        );
        const topAssets = sortedAssets.slice(0, 6);
        const weight = 100 / topAssets.length;
        topAssets.forEach(asset => {
          optimizedAssets[asset.symbol] = weight;
        });
        break;

      case 'min-volatility':
        // Favor low-volatility assets
        const lowVolAssets = AVAILABLE_ASSETS
          .sort((a, b) => a.volatility - b.volatility)
          .slice(0, 8);
        const minVolWeight = 100 / lowVolAssets.length;
        lowVolAssets.forEach(asset => {
          optimizedAssets[asset.symbol] = minVolWeight;
        });
        break;

      case 'sector-balanced':
        const sectorWeights: { [sector: string]: number } = {};
        const sectorAssets: { [sector: string]: Asset[] } = {};

        // Group assets by sector
        AVAILABLE_ASSETS.forEach(asset => {
          if (!sectorAssets[asset.sector]) {
            sectorAssets[asset.sector] = [];
          }
          sectorAssets[asset.sector].push(asset);
        });

        // Equal weight across sectors
        const sectors = Object.keys(sectorAssets);
        const sectorWeight = 100 / sectors.length;

        sectors.forEach(sector => {
          const assetsInSector = sectorAssets[sector];
          const assetWeight = sectorWeight / assetsInSector.length;
          assetsInSector.forEach(asset => {
            optimizedAssets[asset.symbol] = assetWeight;
          });
        });
        break;
    }

    const optimizedMetrics = calculatePortfolioMetrics(optimizedAssets);
    setOptimizedPortfolio(optimizedMetrics);
  };

  const applyOptimization = () => {
    if (optimizedPortfolio) {
      setCurrentPortfolio(optimizedPortfolio);
      setOptimizedPortfolio(null);
    }
  };

  const getDiversificationScore = (portfolio: Portfolio) => {
    const assets = Object.keys(portfolio.assets);
    if (assets.length === 0) return 0;

    const sectors = new Set(assets.map(symbol =>
      AVAILABLE_ASSETS.find(a => a.symbol === symbol)?.sector
    ));

    const sectorScore = Math.min(100, sectors.size * 20);
    const assetScore = Math.min(100, assets.length * 10);
    const concentrationPenalty = Math.max(0, Math.max(...Object.values(portfolio.assets)) - 30) * 2;

    return Math.max(0, Math.min(100, sectorScore + assetScore - concentrationPenalty));
  };

  const diversificationScore = getDiversificationScore(currentPortfolio);

  return (
    <div className="space-y-6">
      {/* Strategy Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-blue-600" />
            Portfolio Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Optimization Strategy</label>
              <Select value={optimizationStrategy} onValueChange={(value: any) => setOptimizationStrategy(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal-weight">Equal Weight</SelectItem>
                  <SelectItem value="max-sharpe">Maximum Sharpe Ratio</SelectItem>
                  <SelectItem value="min-volatility">Minimum Volatility</SelectItem>
                  <SelectItem value="sector-balanced">Sector Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Risk Tolerance</label>
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
          </div>

          <div className="flex gap-2">
            <Button onClick={optimizePortfolio}>
              <Zap className="h-4 w-4 mr-2" />
              Optimize Portfolio
            </Button>
            {optimizedPortfolio && (
              <Button onClick={applyOptimization} variant="outline">
                Apply Optimization
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle>Current Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {Object.entries(currentPortfolio.assets).map(([symbol, allocation]) => {
                const asset = AVAILABLE_ASSETS.find(a => a.symbol === symbol);
                return (
                  <div key={symbol} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{symbol}</div>
                      <div className="text-sm text-muted-foreground">{asset?.sector}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{allocation.toFixed(1)}%</div>
                      <Progress value={allocation} className="w-16 h-2 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span>Expected Return:</span>
                <span className="font-medium">{currentPortfolio.expectedReturn.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Volatility:</span>
                <span className="font-medium">{currentPortfolio.volatility.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Sharpe Ratio:</span>
                <span className="font-medium">{currentPortfolio.sharpeRatio.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimized Portfolio */}
        {optimizedPortfolio && (
          <Card>
            <CardHeader>
              <CardTitle>Optimized Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Object.entries(optimizedPortfolio.assets).map(([symbol, allocation]) => {
                  const asset = AVAILABLE_ASSETS.find(a => a.symbol === symbol);
                  return (
                    <div key={symbol} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{symbol}</div>
                        <div className="text-sm text-muted-foreground">{asset?.sector}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{allocation.toFixed(1)}%</div>
                        <Progress value={allocation} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span>Expected Return:</span>
                  <span className="font-medium text-green-600">
                    {optimizedPortfolio.expectedReturn.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Volatility:</span>
                  <span className="font-medium text-blue-600">
                    {optimizedPortfolio.volatility.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sharpe Ratio:</span>
                  <span className="font-medium text-purple-600">
                    {optimizedPortfolio.sharpeRatio.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diversification Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Diversification Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Diversification Score</span>
                <span className="text-sm font-medium">{diversificationScore.toFixed(0)}/100</span>
              </div>
              <Progress value={diversificationScore} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(currentPortfolio.assets).length}
                </div>
                <div className="text-sm text-muted-foreground">Assets</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(Object.keys(currentPortfolio.assets).map(symbol =>
                    AVAILABLE_ASSETS.find(a => a.symbol === symbol)?.sector
                  )).size}
                </div>
                <div className="text-sm text-muted-foreground">Sectors</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(Object.keys(currentPortfolio.assets).map(symbol =>
                    AVAILABLE_ASSETS.find(a => a.symbol === symbol)?.country
                  )).size}
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Diversification Insights</h4>
              <ul className="text-sm space-y-1">
                {diversificationScore < 30 && (
                  <li className="text-red-600">• Low diversification - consider adding more assets</li>
                )}
                {diversificationScore >= 30 && diversificationScore < 60 && (
                  <li className="text-yellow-600">• Moderate diversification - room for improvement</li>
                )}
                {diversificationScore >= 60 && (
                  <li className="text-green-600">• Good diversification across assets and sectors</li>
                )}
                {Math.max(...Object.values(currentPortfolio.assets)) > 40 && (
                  <li className="text-orange-600">• High concentration in single asset - consider reducing</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
