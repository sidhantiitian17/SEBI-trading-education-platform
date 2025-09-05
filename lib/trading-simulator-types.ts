/**
 * Advanced Trading Simulator with Real Market Conditions
 * Professional-grade trading simulation with real-time data
 */

export interface TickData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
}

export interface BidAskData {
  symbol: string;
  bids: Array<{ price: number; size: number }>;
  asks: Array<{ price: number; size: number }>;
  timestamp: Date;
}

export interface MarketDepthData {
  symbol: string;
  bids: Array<{ price: number; size: number; orders: number }>;
  asks: Array<{ price: number; size: number; orders: number }>;
  timestamp: Date;
}

export interface VolumeProfileData {
  symbol: string;
  price: number;
  volume: number;
  volumePercentage: number;
  priceLevel: number;
}

export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  constituents: string[];
}

export interface SectorData {
  name: string;
  performance: number;
  volume: number;
  topStocks: Array<{ symbol: string; change: number }>;
  timestamp: Date;
}

export interface VolatilityData {
  symbol: string;
  volatility: number;
  vixLevel: number;
  impliedVolatility: number;
  realizedVolatility: number;
  timestamp: Date;
}

export interface MarketOrderExecution {
  executeMarketOrder(
    symbol: string,
    quantity: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult>;
}

export interface LimitOrderExecution {
  placeLimitOrder(
    symbol: string,
    quantity: number,
    price: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult>;
}

export interface StopLossExecution {
  placeStopLossOrder(
    symbol: string,
    quantity: number,
    stopPrice: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult>;
}

export interface BracketOrderExecution {
  placeBracketOrder(
    symbol: string,
    quantity: number,
    entryPrice: number,
    stopLossPrice: number,
    targetPrice: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult>;
}

export interface IcebergOrderExecution {
  placeIcebergOrder(
    symbol: string,
    totalQuantity: number,
    displayQuantity: number,
    price: number,
    side: 'buy' | 'sell'
  ): Promise<OrderResult>;
}

export interface AlgoOrderExecution {
  executeAlgorithmicOrder(
    symbol: string,
    quantity: number,
    algorithm: 'twap' | 'vwap' | 'iceberg' | 'adaptive',
    parameters: AlgoParameters
  ): Promise<OrderResult>;
}

export interface OrderResult {
  orderId: string;
  status: 'filled' | 'partial' | 'pending' | 'cancelled';
  executedQuantity: number;
  executedPrice: number;
  remainingQuantity: number;
  timestamp: Date;
  fees: number;
  slippage: number;
}

export interface AlgoParameters {
  startTime?: Date;
  endTime?: Date;
  maxSlippage?: number;
  minVolume?: number;
  adaptiveInterval?: number;
}

export interface PositionTracker {
  getCurrentPositions(): Promise<Position[]>;
  getPositionHistory(symbol: string): Promise<PositionHistory[]>;
  calculateUnrealizedPnL(): Promise<number>;
  calculateRealizedPnL(): Promise<number>;
}

export interface RiskCalculator {
  calculateVaR(portfolio: Portfolio, confidence: number, timeframe: number): Promise<number>;
  calculateSharpeRatio(portfolio: Portfolio): Promise<number>;
  calculateMaxDrawdown(portfolio: Portfolio): Promise<number>;
  calculateBeta(portfolio: Portfolio, benchmark: string): Promise<number>;
  calculatePortfolioVolatility(portfolio: Portfolio): Promise<number>;
}

export interface PerformanceTracker {
  getPortfolioPerformance(timeframe: string): Promise<PerformanceData>;
  getBenchmarkComparison(benchmark: string): Promise<ComparisonData>;
  getRiskAdjustedReturns(): Promise<RiskAdjustedReturns>;
  getAttributionAnalysis(): Promise<AttributionData>;
}

export interface PlaybackEngine {
  startPlayback(startDate: Date, endDate: Date, speed: number): Promise<void>;
  pausePlayback(): Promise<void>;
  resumePlayback(): Promise<void>;
  setPlaybackSpeed(speed: number): Promise<void>;
  getCurrentPlaybackTime(): Promise<Date>;
}

export interface ScenarioBuilder {
  createCustomScenario(
    name: string,
    conditions: ScenarioCondition[],
    duration: number
  ): Promise<Scenario>;
  loadHistoricalScenario(date: Date, duration: number): Promise<Scenario>;
  modifyScenarioParameters(scenarioId: string, parameters: any): Promise<void>;
}

export interface StressTestEngine {
  runStressTest(
    portfolio: Portfolio,
    scenarios: StressScenario[]
  ): Promise<StressTestResults>;
  calculateWorstCaseLoss(portfolio: Portfolio, percentile: number): Promise<number>;
  analyzeScenarioImpact(scenario: StressScenario): Promise<ImpactAnalysis>;
}

export interface EventSimulator {
  simulateEarningsEvent(symbol: string, surprise: number): Promise<SimulationResult>;
  simulateFedAnnouncement(rateChange: number): Promise<SimulationResult>;
  simulateGeopoliticalEvent(impact: number): Promise<SimulationResult>;
  simulateMarketCrash(severity: number): Promise<SimulationResult>;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  timestamp: Date;
}

export interface PositionHistory {
  symbol: string;
  date: Date;
  quantity: number;
  price: number;
  value: number;
}

export interface Portfolio {
  positions: Position[];
  cash: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  timestamp: Date;
}

export interface PerformanceData {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
}

export interface ComparisonData {
  portfolioReturn: number;
  benchmarkReturn: number;
  outperformance: number;
  trackingError: number;
  informationRatio: number;
}

export interface RiskAdjustedReturns {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  omegaRatio: number;
  kappaRatio: number;
}

export interface AttributionData {
  sectorAttribution: Record<string, number>;
  securityAttribution: Record<string, number>;
  factorAttribution: Record<string, number>;
  timingAttribution: number;
}

export interface ScenarioCondition {
  type: 'price_change' | 'volatility_spike' | 'volume_surge' | 'correlation_break';
  symbol?: string;
  value: number;
  duration: number;
}

export interface Scenario {
  id: string;
  name: string;
  conditions: ScenarioCondition[];
  startDate: Date;
  endDate: Date;
  status: 'created' | 'running' | 'completed';
}

export interface StressScenario {
  name: string;
  description: string;
  conditions: ScenarioCondition[];
  probability: number;
}

export interface StressTestResults {
  scenarios: Array<{
    scenario: StressScenario;
    portfolioLoss: number;
    recoveryTime: number;
    riskMetrics: Record<string, number>;
  }>;
  worstCase: {
    scenario: StressScenario;
    loss: number;
    probability: number;
  };
  expectedShortfall: number;
}

export interface ImpactAnalysis {
  immediateImpact: number;
  cascadingEffects: string[];
  recoveryTime: number;
  riskMetrics: Record<string, number>;
}

export interface SimulationResult {
  immediatePriceChange: number;
  volatilityChange: number;
  volumeChange: number;
  marketImpact: number;
  duration: number;
}
