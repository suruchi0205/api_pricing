import { motion } from 'framer-motion';
import { CalculationParams, Provider } from '../types';
import { getModelsByProvider } from '../data/modelPricing';
import { calculateCosts } from '../utils/costCalculator';
import { TrendingUp, Award, AlertTriangle } from 'lucide-react';

interface CostBreakdownProps {
  params: CalculationParams;
  selectedProviders: Provider[];
  darkMode: boolean;
  selectedModelIds: string[];
}

export default function CostBreakdown({ 
  params, 
  selectedProviders, 
  darkMode,
  selectedModelIds
}: CostBreakdownProps) {
  const models = selectedProviders
    .flatMap(provider => getModelsByProvider(provider))
    .filter(model => selectedModelIds.includes(model.id));
  
  // If no models are selected, show a message
  if (models.length === 0) {
    return (
      <div className={`space-y-6 transition-colors duration-200 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } p-6 rounded-xl shadow-soft`}>
        <div>
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Cost Analysis & Optimization
          </h2>
          <p className={`text-sm mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Select models from the comparison table to view analysis
          </p>
        </div>
        <div className={`p-6 rounded-lg text-center ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            No models selected for analysis. Please select models using the checkboxes in the comparison table above.
          </p>
        </div>
      </div>
    );
  }

  const modelCosts = models.map(model => {
    const costs = calculateCosts({
      inputSize: params.inputSize,
      outputSize: params.outputSize,
      requests: params.requests,
      useTokens: params.useTokens,
      inputCostPerMillion: model.inputCost,
      outputCostPerMillion: model.outputCost
    });

    // Calculate efficiency score based on cost per token and features
    const costPerToken = (model.inputCost + model.outputCost) / 2;
    const featureScore = model.features.length / 6; // Normalize by max possible features
    const contextScore = model.contextWindow / 200000; // Normalize by max context window
    const efficiencyScore = ((1 / costPerToken) * 0.4 + featureScore * 0.3 + contextScore * 0.3) * 100;

    return {
      model,
      costs: params.currency === 'USD' ? costs.costsUSD : costs.costsINR,
      efficiencyScore: Math.round(efficiencyScore * 10) / 10
    };
  });

  // Calculate cost metrics
  const totalCost = modelCosts.reduce((sum, m) => sum + m.costs.total, 0);
  const avgCost = totalCost / modelCosts.length;
  const bestValueModel = modelCosts.reduce((prev, curr) => 
    (curr.efficiencyScore > prev.efficiencyScore) ? curr : prev
  );

  // Calculate potential savings
  const optimalCost = modelCosts.reduce((min, curr) => 
    Math.min(min, curr.costs.total), Infinity
  );
  const potentialSavings = totalCost - (optimalCost * modelCosts.length);

  const formatCurrency = (value: number) => {
    const symbol = params.currency === 'USD' ? '$' : '₹';
    if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(2)}K`;
    return `${symbol}${value.toFixed(2)}`;
  };

  return (
    <div className={`space-y-6 transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-xl shadow-soft`}>
      <div>
        <h2 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Cost Analysis & Optimization
        </h2>
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Analysis of {modelCosts.length} selected model{modelCosts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Cost Optimization Insights */}
      <div className={`p-6 rounded-lg ${
        darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'
      }`}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            darkMode ? 'bg-gray-800/50' : 'bg-white'
          }`}>
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-green-900/30' : 'bg-green-100'
            }`}>
              <TrendingUp className={darkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Potential Savings
              </h4>
              <p className={`text-xs mt-0.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Up to {formatCurrency(potentialSavings)}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            darkMode ? 'bg-gray-800/50' : 'bg-white'
          }`}>
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <Award className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Best Value Model
              </h4>
              <p className={`text-xs mt-0.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {bestValueModel.model.name}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            darkMode ? 'bg-gray-800/50' : 'bg-white'
          }`}>
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-amber-900/30' : 'bg-amber-100'
            }`}>
              <AlertTriangle className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Avg. Cost/Model
              </h4>
              <p className={`text-xs mt-0.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formatCurrency(avgCost)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Total {params.timeframe} Cost
          </div>
          <div className={`text-xl font-semibold mt-1 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {formatCurrency(totalCost)}
          </div>
          <div className={`text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {params.requests.toLocaleString()} requests
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Models Analyzed
          </div>
          <div className={`text-xl font-semibold mt-1 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {modelCosts.length}
          </div>
          <div className={`text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Active providers: {new Set(models.map(m => m.provider)).size}
          </div>
        </div>
      </div>

      {/* Model Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modelCosts.map(({ model, efficiencyScore }) => (
          <div key={model.id} className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {model.name}
                </h3>
                <span className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {model.provider}
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                efficiencyScore >= 70
                  ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                  : efficiencyScore >= 50
                  ? darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                  : darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                {efficiencyScore}%
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {model.features.map((feature) => (
                <span key={feature} className={`px-1.5 py-0.5 rounded-full text-xs ${
                  darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}