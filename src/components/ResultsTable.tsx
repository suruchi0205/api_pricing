import { useState } from 'react';
import { CalculationParams, Provider } from '../types';
import { getModelsByProvider } from '../data/modelPricing';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { calculateCosts } from '../utils/costCalculator';
import { CheckCircle2 } from 'lucide-react';

interface ResultsTableProps {
  params: CalculationParams;
  selectedProviders: Provider[];
  darkMode: boolean;
  selectedModelIds: string[];
  onSelectedModelsChange: (modelIds: string[]) => void;
}

export default function ResultsTable({ 
  params, 
  selectedProviders, 
  darkMode,
  selectedModelIds,
  onSelectedModelsChange
}: ResultsTableProps) {
  const [sortField, setSortField] = useState<'name' | 'inputCost' | 'outputCost' | 'totalCost'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get models for selected providers
  const models = selectedProviders.flatMap(provider => getModelsByProvider(provider));

  // Calculate costs based on params
  const modelsWithCosts = models.map(model => {
    const costs = calculateCosts({
      inputSize: params.inputSize,
      outputSize: params.outputSize,
      requests: params.requests,
      useTokens: params.useTokens,
      inputCostPerMillion: model.inputCost,
      outputCostPerMillion: model.outputCost
    });

    return {
      ...model,
      totalTokens: costs.tokens.totalInput + costs.tokens.totalOutput,
      costs: {
        input: params.currency === 'USD' ? costs.costsUSD.input : costs.costsINR.input,
        output: params.currency === 'USD' ? costs.costsUSD.output : costs.costsINR.output,
        total: params.currency === 'USD' ? costs.costsUSD.total : costs.costsINR.total
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

  const handleModelToggle = (modelId: string) => {
    if (selectedModelIds.includes(modelId)) {
      onSelectedModelsChange(selectedModelIds.filter(id => id !== modelId));
    } else {
      onSelectedModelsChange([...selectedModelIds, modelId]);
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
    <div className={`transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-xl shadow-soft`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Cost Comparison</h2>
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {params.useTokens 
            ? 'Using direct token counts' 
            : 'Converting words to tokens (1 word ≈ 1.333 tokens)'}
        </p>
      </div>
      <div className={`rounded-lg overflow-hidden ${
        darkMode ? 'bg-gray-900/30' : 'bg-gray-50'
      }`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            <thead>
              <tr>
                <th className={`px-6 py-3.5 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider w-12`}>
                  Show
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  className={`px-6 py-3.5 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider cursor-pointer hover:bg-opacity-50`}
                >
                  Model <SortIcon field="name" />
                </th>
                <th className={`px-6 py-3.5 text-left text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Provider
                </th>
                <th className={`px-6 py-3.5 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Input Cost (per M tokens)
                </th>
                <th className={`px-6 py-3.5 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Output Cost (per M tokens)
                </th>
                <th className={`px-6 py-3.5 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Total Tokens
                </th>
                <th className={`px-6 py-3.5 text-right text-xs font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'divide-gray-700/50' : 'divide-gray-200'
            }`}>
              {sortedModels.map((model) => (
                <tr key={model.id} className={`transition-colors ${
                  darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/80'
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={selectedModelIds.includes(model.id)}
                          onChange={() => handleModelToggle(model.id)}
                        />
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors ${
                          selectedModelIds.includes(model.id)
                            ? darkMode
                              ? 'bg-blue-500 border-blue-400'
                              : 'bg-blue-600 border-blue-500'
                            : darkMode
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {selectedModelIds.includes(model.id) && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </label>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {model.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      model.provider === 'OpenAI'
                        ? darkMode
                          ? 'bg-emerald-900/30 text-emerald-400'
                          : 'bg-emerald-50 text-emerald-700'
                        : model.provider === 'Anthropic'
                        ? darkMode
                          ? 'bg-purple-900/30 text-purple-400'
                          : 'bg-purple-50 text-purple-700'
                        : darkMode
                        ? 'bg-amber-900/30 text-amber-400'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {model.provider}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } text-right font-medium`}>
                    ${model.inputCost.toFixed(4)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } text-right font-medium`}>
                    ${model.outputCost.toFixed(4)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } text-right font-medium`}>
                    {Math.round(model.totalTokens).toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right`}>
                    <div>
                      <div className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {params.currency === 'USD' ? '$' : '₹'}
                        {model.costs.total.toFixed(4)}
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Input: {params.currency === 'USD' ? '$' : '₹'}
                        {model.costs.input.toFixed(4)}<br />
                        Output: {params.currency === 'USD' ? '$' : '₹'}
                        {model.costs.output.toFixed(4)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}