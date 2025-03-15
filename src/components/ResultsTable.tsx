import { useState } from 'react';
import { IResultsTable } from '../types';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { getModelsByProvider } from '../data/modelPricing';

// Add the constant for word to token ratio
const WORD_TO_TOKEN_RATIO = 1.333;

export default function ResultsTable({
  params,
  selectedProviders,
  darkMode
}: IResultsTable) {
  const [sortField, setSortField] = useState<'name' | 'inputCost' | 'outputCost' | 'totalCost'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get models for selected providers
  const models = selectedProviders.flatMap(provider => getModelsByProvider(provider));

  // Calculate costs based on params
  const modelsWithCosts = models.map(model => {
    // Convert words to tokens if needed
    const inputTokens = params.useTokens 
      ? params.inputSize 
      : params.inputSize * WORD_TO_TOKEN_RATIO;
    const outputTokens = params.useTokens 
      ? params.outputSize 
      : params.outputSize * WORD_TO_TOKEN_RATIO;

    // Calculate total tokens
    const totalInputTokens = inputTokens * params.requests;
    const totalOutputTokens = outputTokens * params.requests;

    // Calculate costs
    const inputCost = (totalInputTokens / 1_000_000) * model.inputCost;
    const outputCost = (totalOutputTokens / 1_000_000) * model.outputCost;
    const totalCost = inputCost + outputCost;
    const totalCostINR = totalCost * 86.65;

    return {
      ...model,
      totalTokens: totalInputTokens + totalOutputTokens,
      costs: {
        input: inputCost,
        output: outputCost,
        total: totalCost,
        totalINR: totalCostINR
      }
    };
  });

  // Sort models
  const sortedModels = [...modelsWithCosts].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'name') {
      return (a.name > b.name ? 1 : -1) * multiplier;
    }
    return (a.costs.total > b.costs.total ? 1 : -1) * multiplier;
  });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />
    );
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <h2 className="text-lg font-semibold mb-4">Cost Comparison</h2>
      <div className="text-sm text-gray-500 mb-4">
        {params.useTokens 
          ? 'Using direct token counts' 
          : 'Converting words to tokens (1 word ≈ 1.333 tokens)'}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              >
                Model <SortIcon field="name" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Input Cost (per M tokens)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Output Cost (per M tokens)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Tokens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedModels.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {model.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.provider}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${model.inputCost.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${model.outputCost.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.round(model.totalTokens).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {params.currency === 'USD' ? (
                    <div>
                      <div className="font-medium">${model.costs.total.toFixed(4)}</div>
                      <div className="text-xs text-gray-400">
                        Input: ${model.costs.input.toFixed(4)}<br />
                        Output: ${model.costs.output.toFixed(4)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">₹{model.costs.totalINR.toFixed(4)}</div>
                      <div className="text-xs text-gray-400">
                        Input: ₹{(model.costs.input * 86.65).toFixed(4)}<br />
                        Output: ₹{(model.costs.output * 86.65).toFixed(4)}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 