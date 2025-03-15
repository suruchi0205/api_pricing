import { Model } from '../types';

export const models: Model[] = [
  {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputCost: 10,
    outputCost: 30,
  },
  {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    inputCost: 0.5,
    outputCost: 1.5,
  },
  {
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    inputCost: 15,
    outputCost: 75,
  },
  {
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    inputCost: 3,
    outputCost: 15,
  },
  {
    name: 'Mixtral 8x7B',
    provider: 'Groq',
    inputCost: 7,
    outputCost: 24,
  },
];