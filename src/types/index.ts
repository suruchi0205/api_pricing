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

export interface ICalculatorForm {
  params: CalculationParams;
  onParamsChange: (params: CalculationParams) => void;
  selectedProviders: Provider[];
  onProvidersChange: (providers: Provider[]) => void;
  darkMode: boolean;
}

export interface IResultsTable {
  params: CalculationParams;
  selectedProviders: Provider[];
  darkMode: boolean;
}

export interface ICostVisualization {
  params: CalculationParams;
  selectedProviders: Provider[];
  darkMode: boolean;
} 