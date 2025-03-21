import { ICostVisualization } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { calculateCosts } from '../utils/costCalculator';
import { getModelsByProvider } from '../data/modelPricing';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CostVisualization({
  params,
  selectedProviders,
  darkMode
}: ICostVisualization) {
  // Get models and calculate costs
  const models = selectedProviders.flatMap(provider => getModelsByProvider(provider));
  const modelData = models.map(model => {
    const costs = calculateCosts({
      inputSize: params.inputSize,
      outputSize: params.outputSize,
      requests: params.requests,
      useTokens: params.useTokens,
      inputCostPerMillion: model.inputCost,
      outputCostPerMillion: model.outputCost
    });

    return {
      name: model.name,
      provider: model.provider,
      inputCost: params.currency === 'USD' ? costs.costsUSD.input : costs.costsINR.input,
      outputCost: params.currency === 'USD' ? costs.costsUSD.output : costs.costsINR.output
    };
  });

  // Sort models by total cost
  const sortedData = [...modelData].sort((a, b) => 
    (b.inputCost + b.outputCost) - (a.inputCost + a.outputCost)
  );

  // Format currency values
  const formatCurrency = (value: number) => {
    if (params.currency === 'USD') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
      return `$${value.toFixed(2)}`;
    } else {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
      if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
      if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
      return `₹${value.toFixed(2)}`;
    }
  };

  const chartData = {
    labels: sortedData.map(model => `${model.name} (${model.provider})`),
    datasets: [
      {
        label: 'Input Cost',
        data: sortedData.map(model => model.inputCost),
        backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.6)' : 'rgba(59, 130, 246, 0.6)',
        borderColor: darkMode ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Output Cost',
        data: sortedData.map(model => model.outputCost),
        backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.6)' : 'rgba(16, 185, 129, 0.6)',
        borderColor: darkMode ? 'rgb(34, 197, 94)' : 'rgb(16, 185, 129)',
        borderWidth: 1,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: darkMode ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: true,
        text: `Cost Comparison (${params.currency})`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        },
        color: darkMode ? '#e5e7eb' : '#374151'
      }
    },
    scales: {
      x: {
        type: 'linear',
        stacked: true,
        title: {
          display: true,
          text: `Cost (${params.currency})`,
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {
            if (typeof value === 'number') {
              return formatCurrency(value);
            }
            return '';
          },
          color: darkMode ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          display: true,
          drawTicks: true
        }
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 11
          },
          color: darkMode ? '#e5e7eb' : '#374151'
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Calculate dynamic height based on number of models
  const barHeight = 40; // Height per bar in pixels
  const minHeight = 300; // Minimum height
  const calculatedHeight = Math.max(minHeight, sortedData.length * barHeight);

  return (
    <div className={`transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-lg shadow-sm`}>
      <div className="mb-4">
        <h2 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Cost Visualization
        </h2>
        <p className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Comparing input and output costs across models
        </p>
      </div>
      <div style={{ height: `${calculatedHeight}px` }} className="w-full">
        <Bar data={chartData} options={options} />
      </div>
      <div className={`mt-6 text-xs ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        * Costs calculated for {params.requests.toLocaleString()} requests with {params.useTokens ? 'tokens' : 'words'}: {params.inputSize.toLocaleString()} input, {params.outputSize.toLocaleString()} output
      </div>
    </div>
  );
} 