export interface Model {
  id: string;
  name: string;
  provider: Provider;
  inputCost: number;
  outputCost: number;
  contextWindow: number;
  features: ModelFeature[];
  description: string;
}

export type ModelFeature = 
  | 'JSON Mode'
  | 'Function Calling'
  | 'Vision'
  | 'Streaming'
  | 'Fine-tuning'
  | 'RAG Optimized';

export type Provider = 'OpenAI' | 'Anthropic' | 'Groq';
export type Currency = 'USD' | 'INR';
export type ChartType = 'bar' | 'radar' | 'scatter';
export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CalculationParams {
  inputSize: number;
  outputSize: number;
  requests: number;
  useTokens: boolean;
  currency: Currency;
  chartType: ChartType;
  timeframe: TimeFrame;
}

export interface ThemeConfig {
  darkMode: boolean;
}