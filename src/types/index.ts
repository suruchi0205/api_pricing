export type Currency = 'USD' | 'INR';

export type Provider = 'OpenAI' | 'Anthropic' | 'Groq';

export interface ModelPricing {
  id: string;
  name: string;
  provider: Provider;
  inputCost: number;  // Cost per million tokens
  outputCost: number; // Cost per million tokens
  contextWindow: number;
  description?: string;
}

export interface CalculationParams {
  inputSize: number;
  outputSize: number;
  requests: number;
  useTokens: boolean;
  currency: Currency;
}

export interface ThemeConfig {
  darkMode: boolean;
} 