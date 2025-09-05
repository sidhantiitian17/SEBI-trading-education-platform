/**
 * Algorithmic Trading Education Module
 * Visual strategy builder and professional backtesting engine
 */

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'momentum' | 'mean_reversion' | 'arbitrage' | 'market_making' | 'high_frequency' | 'machine_learning';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  parameters: StrategyParameter[];
  indicators: TechnicalIndicator[];
  riskManagement: RiskRule[];
  performanceMetrics: PerformanceMetric[];
}

export interface StrategyParameter {
  name: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  options?: string[];
  description: string;
}

export interface TechnicalIndicator {
  name: string;
  type: 'trend' | 'momentum' | 'volatility' | 'volume' | 'support_resistance';
  parameters: Record<string, any>;
  signal: 'buy' | 'sell' | 'hold';
}

export interface RiskRule {
  type: 'stop_loss' | 'take_profit' | 'max_drawdown' | 'max_positions' | 'position_size';
  value: number;
  action: 'close_position' | 'reduce_position' | 'alert' | 'suspend_trading';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  benchmark?: number;
  description: string;
}

export interface VisualStrategyBuilder {
  canvas: StrategyCanvas;
  componentLibrary: ComponentLibrary;
  dragDropInterface: DragDropInterface;
  realTimePreview: RealTimePreview;
  codeGenerator: CodeGenerator;
}

export interface StrategyCanvas {
  elements: CanvasElement[];
  connections: Connection[];
  zoom: number;
  pan: { x: number; y: number };
  grid: boolean;
}

export interface CanvasElement {
  id: string;
  type: 'indicator' | 'condition' | 'action' | 'parameter';
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: Record<string, any>;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'data' | 'signal' | 'condition';
}

export interface ComponentLibrary {
  indicators: TechnicalIndicator[];
  conditions: Condition[];
  actions: Action[];
  parameters: StrategyParameter[];
}

export interface Condition {
  name: string;
  type: 'comparison' | 'logical' | 'technical' | 'statistical';
  parameters: StrategyParameter[];
  description: string;
}

export interface Action {
  name: string;
  type: 'buy' | 'sell' | 'hold' | 'close' | 'adjust';
  parameters: StrategyParameter[];
  description: string;
}

export interface DragDropInterface {
  dragElement(element: CanvasElement): void;
  dropElement(position: { x: number; y: number }): void;
  connectElements(from: string, to: string): void;
  deleteElement(id: string): void;
  cloneElement(id: string): void;
}

export interface RealTimePreview {
  strategy: StrategyTemplate;
  testData: MarketData[];
  signals: TradingSignal[];
  performance: RealTimePerformance;
}

export interface TradingSignal {
  timestamp: Date;
  type: 'buy' | 'sell' | 'hold';
  price: number;
  reason: string;
  confidence: number;
}

export interface RealTimePerformance {
  totalReturn: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export interface CodeGenerator {
  generatePythonCode(strategy: StrategyTemplate): string;
  generateJavaScriptCode(strategy: StrategyTemplate): string;
  generatePseudocode(strategy: StrategyTemplate): string;
  validateStrategy(strategy: StrategyTemplate): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface MarketData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  symbol: string;
}

export interface MomentumStrategy {
  lookbackPeriod: number;
  momentumThreshold: number;
  entrySignal: 'breakout' | 'divergence' | 'acceleration';
  exitSignal: 'profit_target' | 'trailing_stop' | 'time_based';
}

export interface MeanReversionStrategy {
  lookbackPeriod: number;
  deviationThreshold: number;
  meanType: 'simple' | 'exponential' | 'weighted';
  entrySignal: 'oversold' | 'overbought' | 'range_breakout';
  exitSignal: 'mean_reversion' | 'profit_target' | 'time_based';
}

export interface ArbitrageStrategy {
  instruments: string[];
  arbitrageType: 'statistical' | 'triangular' | 'spatial';
  threshold: number;
  maxHoldingTime: number;
  riskLimits: RiskLimits;
}

export interface MarketMakingStrategy {
  spreadWidth: number;
  inventoryLimit: number;
  orderSize: number;
  updateFrequency: number;
  riskManagement: RiskManagement;
}

export interface HFTStrategy {
  latencyThreshold: number;
  orderBookDepth: number;
  signalProcessing: SignalProcessing;
  executionLogic: ExecutionLogic;
  riskControls: RiskControls;
}

export interface MLStrategy {
  modelType: 'regression' | 'classification' | 'clustering' | 'reinforcement';
  features: string[];
  target: string;
  trainingPeriod: number;
  validationPeriod: number;
  hyperparameters: Record<string, any>;
}

export interface WalkForwardTester {
  trainingWindow: number;
  testingWindow: number;
  stepSize: number;
  results: WalkForwardResult[];
}

export interface WalkForwardResult {
  trainingPeriod: { start: Date; end: Date };
  testingPeriod: { start: Date; end: Date };
  performance: PerformanceMetric[];
  parameters: Record<string, any>;
}

export interface MonteCarloOptimizer {
  simulations: number;
  parameters: StrategyParameter[];
  constraints: ParameterConstraint[];
  results: MonteCarloResult[];
}

export interface ParameterConstraint {
  parameter: string;
  min: number;
  max: number;
  step: number;
}

export interface MonteCarloResult {
  parameters: Record<string, any>;
  performance: PerformanceMetric[];
  probability: number;
}

export interface ParameterOptimizer {
  algorithm: 'grid' | 'random' | 'genetic' | 'bayesian';
  parameters: StrategyParameter[];
  objective: 'sharpe_ratio' | 'total_return' | 'win_rate' | 'max_drawdown';
  constraints: ParameterConstraint[];
  results: OptimizationResult[];
}

export interface OptimizationResult {
  parameters: Record<string, any>;
  objectiveValue: number;
  performance: PerformanceMetric[];
  rank: number;
}

export interface RobustnessTester {
  stressTests: StressTest[];
  monteCarloTests: MonteCarloTest[];
  outOfSampleTests: OutOfSampleTest[];
  parameterSensitivityTests: ParameterSensitivityTest[];
}

export interface StressTest {
  scenario: string;
  conditions: MarketCondition[];
  expectedImpact: ImpactAnalysis;
  actualImpact: ImpactAnalysis;
}

export interface MonteCarloTest {
  simulations: number;
  parameters: Record<string, any>;
  results: StatisticalAnalysis;
}

export interface OutOfSampleTest {
  inSamplePeriod: { start: Date; end: Date };
  outOfSamplePeriod: { start: Date; end: Date };
  inSamplePerformance: PerformanceMetric[];
  outOfSamplePerformance: PerformanceMetric[];
}

export interface ParameterSensitivityTest {
  parameter: string;
  values: number[];
  performanceImpact: PerformanceImpact[];
}

export interface MarketCondition {
  type: 'volatility' | 'trend' | 'volume' | 'correlation';
  value: number;
  duration: number;
}

export interface ImpactAnalysis {
  returnImpact: number;
  riskImpact: number;
  drawdownImpact: number;
  recoveryTime: number;
}

export interface StatisticalAnalysis {
  mean: number;
  median: number;
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
  confidenceIntervals: ConfidenceInterval[];
}

export interface ConfidenceInterval {
  level: number;
  lower: number;
  upper: number;
}

export interface PerformanceImpact {
  value: number;
  performance: PerformanceMetric[];
}

export interface TransactionCostModel {
  commission: number;
  slippage: number;
  marketImpact: number;
  borrowingCost: number;
  totalCost: number;
}

export interface SlippageModel {
  type: 'fixed' | 'volume_based' | 'time_based' | 'adaptive';
  parameters: Record<string, any>;
  historicalSlippage: SlippageData[];
}

export interface SlippageData {
  timestamp: Date;
  expectedPrice: number;
  actualPrice: number;
  slippage: number;
  volume: number;
}

export interface RiskLimits {
  maxPositionSize: number;
  maxDrawdown: number;
  maxDailyLoss: number;
  maxOpenPositions: number;
}

export interface RiskManagement {
  stopLoss: number;
  takeProfit: number;
  maxInventory: number;
  riskPerTrade: number;
}

export interface SignalProcessing {
  filters: SignalFilter[];
  aggregation: SignalAggregation;
  validation: SignalValidation;
}

export interface SignalFilter {
  type: 'threshold' | 'moving_average' | 'volatility' | 'volume';
  parameters: Record<string, any>;
}

export interface SignalAggregation {
  method: 'weighted_average' | 'majority_vote' | 'consensus';
  weights?: number[];
  threshold: number;
}

export interface SignalValidation {
  rules: ValidationRule[];
  confidenceThreshold: number;
  backtestingRequired: boolean;
}

export interface ValidationRule {
  condition: string;
  action: 'accept' | 'reject' | 'modify';
  parameters: Record<string, any>;
}

export interface ExecutionLogic {
  orderType: 'market' | 'limit' | 'stop' | 'iceberg';
  timing: 'immediate' | 'scheduled' | 'conditional';
  size: 'fixed' | 'percentage' | 'adaptive';
  parameters: Record<string, any>;
}

export interface RiskControls {
  positionLimits: PositionLimit[];
  lossLimits: LossLimit[];
  exposureLimits: ExposureLimit[];
  circuitBreakers: CircuitBreaker[];
}

export interface PositionLimit {
  type: 'quantity' | 'value' | 'percentage';
  limit: number;
  action: 'alert' | 'close' | 'suspend';
}

export interface LossLimit {
  type: 'daily' | 'weekly' | 'monthly' | 'total';
  limit: number;
  action: 'alert' | 'close' | 'suspend';
}

export interface ExposureLimit {
  type: 'sector' | 'asset_class' | 'geography';
  limit: number;
  action: 'alert' | 'reduce' | 'suspend';
}

export interface CircuitBreaker {
  condition: string;
  threshold: number;
  action: 'pause' | 'suspend' | 'shutdown';
  duration: number;
}
