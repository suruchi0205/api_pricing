import { Provider } from '../types';

export interface ModelInfo {
  id: string;
  name: string;
  provider: Provider;
  inputCost: number;
  outputCost: number;
}

export const modelPricingData: ModelInfo[] = [
  // OpenAI Models
  {
    id: 'gpt-4-5-preview-2025-02-27',
    name: 'GPT-4.5 Preview',
    provider: 'OpenAI',
    inputCost: 75,
    outputCost: 150
  },
  {
    id: 'gpt-4o-2024-08-06',
    name: 'GPT-4O',
    provider: 'OpenAI',
    inputCost: 2.5,
    outputCost: 10
  },
  {
    id: 'gpt-4o-audio-preview-2024-12-17',
    name: 'GPT-4O Audio Preview',
    provider: 'OpenAI',
    inputCost: 2.5,
    outputCost: 10
  },
  // ... add all OpenAI models
  
  // Groq Models
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'DeepSeek R1 Distill Llama 70B',
    provider: 'Groq',
    inputCost: 0.75,
    outputCost: 0.99
  },
  {
    id: 'deepseek-r1-distill-qwen-32b',
    name: 'DeepSeek R1 Distill Qwen 32B 128k',
    provider: 'Groq',
    inputCost: 0.69,
    outputCost: 0.69
  },
  // ... add all Groq models
  
  // Anthropic Models
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    inputCost: 3,
    outputCost: 15
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputCost: 3,
    outputCost: 15
  },
  // ... add all Anthropic models
];

// Helper function to get models by provider
export const getModelsByProvider = (provider: Provider): ModelInfo[] => {
  return modelPricingData.filter(model => model.provider === provider);
}; 