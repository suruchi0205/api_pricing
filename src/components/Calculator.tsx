import React, { useState } from 'react';
import { Calculator, BarChart3, Settings2 } from 'lucide-react';
import { models } from '../data/models';
import { CalculatorInputs, Provider, ModelCosts } from '../types';

const EXCHANGE_RATE = 83; // USD to INR

export default function ModelCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    inputText: 20,
    outputText: 200,
    requests: 100,
    currency: 'USD',
    useTokens: false,
  });
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>(['OpenAI', 'Anthropic', 'Groq']);

  const calculateCosts = (): ModelCosts[] => {
    const filteredModels = models.filter(m => selectedProviders.includes(m.provider));
    const costs = filteredModels.map(model => {
      const inputTokens = inputs.useTokens ? inputs.inputText : inputs.inputText * 1.333;
      const outputTokens = inputs.useTokens ? inputs.outputText : inputs.outputText * 0.75;
      
      const totalCost = (
        (inputTokens * model.inputCost + outputTokens * model.outputCost) *
        inputs.requests / 1_000_000
      ) * (inputs.currency === 'INR' ? EXCHANGE_RATE : 1);

      return { model, totalCost, comparisonPercentage: 0 };
    });

    const avgCost = costs.reduce((acc, curr) => acc + curr.totalCost, 0) / costs.length;
    return costs.map(cost => ({
      ...cost,
      comparisonPercentage: ((cost.totalCost - avgCost) / avgCost) * 100,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ModelMetrics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Settings2 className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Calculate Costs</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>{inputs.useTokens ? 'Input Tokens' : 'Input Words'}</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={inputs.useTokens}
                        onChange={(e) => setInputs(prev => ({ ...prev, useTokens: e.target.checked }))}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={inputs.inputText}
                    onChange={(e) => setInputs(prev => ({ ...prev, inputText: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {inputs.useTokens ? 'Output Tokens' : 'Output Words'}
                  </label>
                  <input
                    type="number"
                    value={inputs.outputText}
                    onChange={(e) => setInputs(prev => ({ ...prev, outputText: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Requests
                  </label>
                  <input
                    type="number"
                    value={inputs.requests}
                    onChange={(e) => setInputs(prev => ({ ...prev, requests: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    value={inputs.currency}
                    onChange={(e) => setInputs(prev => ({ ...prev, currency: e.target.value as 'USD' | 'INR' }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter Providers</h3>
                <div className="flex flex-wrap gap-2">
                  {(['OpenAI', 'Anthropic', 'Groq'] as Provider[]).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => {
                        setSelectedProviders(prev =>
                          prev.includes(provider)
                            ? prev.filter(p => p !== provider)
                            : [...prev, provider]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedProviders.includes(provider)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Cost Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Input Cost
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Output Cost
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comparison
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {calculateCosts().map(({ model, totalCost, comparisonPercentage }) => (
                      <tr key={model.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {model.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {model.provider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ${model.inputCost.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ${model.outputCost.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          {inputs.currency === 'USD' ? '$' : '₹'}
                          {totalCost.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              comparisonPercentage > 0
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {comparisonPercentage > 0 ? '+' : ''}
                            {comparisonPercentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}