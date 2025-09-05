/**
 * AI-Powered Adaptive Learning Engine
 * Core implementation for personalized learning experiences
 */

export interface UserProfile {
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  riskTolerance: number; // 0-100 scale
  preferredTopics: string[];
  weakAreas: string[];
  strongAreas: string[];
  engagementScore: number;
  retentionRate: number;
}

export interface LearningPath {
  id: string;
  userId: string;
  modules: LearningModule[];
  estimatedCompletionTime: number;
  difficultyProgression: number[];
  personalizedObjectives: string[];
  adaptiveCheckpoints: AdaptiveCheckpoint[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  contentType: 'video' | 'interactive' | 'quiz' | 'simulation';
  adaptiveElements: AdaptiveElement[];
}

export interface AdaptiveElement {
  type: 'difficulty_adjustment' | 'content_branching' | 'remedial_content' | 'advanced_challenge';
  trigger: AdaptiveTrigger;
  action: AdaptiveAction;
}

export interface AdaptiveTrigger {
  condition: 'performance_below_threshold' | 'time_spent_high' | 'repeated_mistakes' | 'quick_completion';
  threshold: number;
  metric: 'accuracy' | 'speed' | 'engagement' | 'retention';
}

export interface AdaptiveAction {
  type: 'increase_difficulty' | 'decrease_difficulty' | 'show_remedial' | 'skip_content' | 'provide_hint';
  content?: string;
  newDifficulty?: number;
  additionalResources?: string[];
}

export interface PerformanceMetrics {
  moduleId: string;
  userId: string;
  accuracy: number;
  timeSpent: number;
  attempts: number;
  engagementScore: number;
  timestamp: Date;
  mistakes: string[];
  strengths: string[];
}

export interface ContentAdjustment {
  newDifficulty: number;
  recommendedContent: string[];
  learningPathUpdate: boolean;
  estimatedTimeAdjustment: number;
  motivationalMessage: string;
}

export interface SuccessProbability {
  probability: number; // 0-1
  confidence: number; // 0-1
  factors: PredictionFactor[];
  recommendations: string[];
}

export interface PredictionFactor {
  factor: string;
  impact: number; // -1 to 1
  confidence: number;
}

export interface OptimalSequence {
  modules: string[];
  reasoning: string;
  expectedImprovement: number;
  timeEstimate: number;
}

export interface BehaviorMetrics {
  attentionSpan: number;
  learningPace: number;
  preferredTimeOfDay: string;
  deviceUsage: string[];
  interactionPatterns: InteractionPattern[];
}

export interface InteractionPattern {
  pattern: string;
  frequency: number;
  effectiveness: number;
}

export interface ContentType {
  primary: 'conceptual' | 'practical' | 'analytical';
  secondary: string[];
  complexity: number;
}

export interface EngagementProfile {
  engagementLevel: 'high' | 'medium' | 'low';
  patterns: string[];
  recommendations: string[];
  riskFactors: string[];
}

export interface BehaviorChanges {
  timeframe: string;
  improvements: string[];
  regressions: string[];
  trends: Trend[];
  predictions: string[];
}

export interface Trend {
  metric: string;
  direction: 'improving' | 'declining' | 'stable';
  magnitude: number;
  confidence: number;
}

export interface AcquisitionPrediction {
  predictedScore: number;
  confidence: number;
  timeToMastery: number;
  recommendedApproach: string[];
}

export interface AdaptiveCheckpoint {
  id: string;
  moduleId: string;
  condition: string;
  action: string;
  completed: boolean;
}
