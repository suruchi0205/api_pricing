import { Model, Provider } from '../types';

const models: Model[] = [
  {
    id: 'gpt4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputCost: 10,
    outputCost: 30,
    contextWindow: 128000,
    features: ['JSON Mode', 'Function Calling', 'Vision', 'Streaming', 'Fine-tuning', 'RAG Optimized'],
    description: 'Latest GPT-4 model optimized for better performance and lower latency'
  },
  {
    id: 'gpt35-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    inputCost: 0.5,
    outputCost: 1.5,
    contextWindow: 16000,
    features: ['JSON Mode', 'Function Calling', 'Streaming', 'Fine-tuning', 'RAG Optimized'],
    description: 'Fast and cost-effective model for most use cases'
  },
  {
    id: 'claude3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    inputCost: 15,
    outputCost: 75,
    contextWindow: 200000,
    features: ['JSON Mode', 'Vision', 'Streaming', 'RAG Optimized'],
    description: 'Most capable Claude model with superior reasoning and analysis'
  },
  {
    id: 'claude3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    inputCost: 3,
    outputCost: 15,
    contextWindow: 200000,
    features: ['JSON Mode', 'Vision', 'Streaming', 'RAG Optimized'],
    description: 'Balanced model offering high performance at lower cost'
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Groq',
    inputCost: 7,
    outputCost: 24,
    contextWindow: 32000,
    features: ['Streaming', 'RAG Optimized'],
    description: 'High-performance open model with extremely low latency'
  },
];

export function getModelsByProvider(provider: Provider): Model[] {
  return models.filter(model => model.provider === provider);
}

export function getAllModels(): Model[] {
  return models;
}