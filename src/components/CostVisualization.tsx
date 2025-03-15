import { CalculationParams, Provider } from '../types';
import { Bar, Radar, Scatter } from 'react-chartjs-2';
import { getModelsByProvider } from '../data/modelPricing';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { calculateCosts } from '../utils/costCalculator';
import { BarChart2, RadarIcon, HeaterIcon as ScatterIcon } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

interface CostVisualizationProps {
  params: CalculationParams;
  onParamsChange: (params: CalculationParams) => void;
  selectedProviders: Provider[];
  darkMode: boolean;
  selectedModelIds: string[];
}

export default function CostVisualization({ 
  params, 
  onParamsChange,
  selectedProviders, 
  darkMode,
  selectedModelIds 
}: CostVisualizationProps) {
  const models = selectedProviders
    .flatMap(provider => getModelsByProvider(provider))
    .filter(model => selectedModelIds.includes(model.id));

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
      outputCost: params.currency === 'USD' ? costs.costsUSD.output : costs.costsINR.output,
      totalCost: params.currency === 'USD' ? costs.costsUSD.total : costs.costsINR.total,
      contextWindow: model.contextWindow
    };
  });

  // Sort models by total cost
  const sortedData = [...modelData].sort((a, b) => b.totalCost - a.totalCost);

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

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#e5e7eb' : '#374151',
        bodyColor: darkMode ? '#e5e7eb' : '#374151',
        borderColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          family: 'Inter',
          size: 13,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter',
          size: 12,
          weight: '400'
        },
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };

  const barData = {
    labels: sortedData.map(model => `${model.name} (${model.provider})`),
    datasets: [
      {
        label: 'Input Cost',
        data: sortedData.map(model => model.inputCost),
        backgroundColor: darkMode 
          ? 'rgba(56, 189, 248, 0.7)' // Sky blue in dark mode
          : 'rgba(14, 165, 233, 0.7)', // Lighter sky blue in light mode
        borderColor: darkMode 
          ? 'rgb(56, 189, 248)' 
          : 'rgb(14, 165, 233)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Output Cost',
        data: sortedData.map(model => model.outputCost),
        backgroundColor: darkMode 
          ? 'rgba(168, 85, 247, 0.7)' // Purple in dark mode
          : 'rgba(147, 51, 234, 0.7)', // Lighter purple in light mode
        borderColor: darkMode 
          ? 'rgb(168, 85, 247)' 
          : 'rgb(147, 51, 234)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const radarData = {
    labels: ['Total Cost', 'Input Cost', 'Output Cost', 'Context Window', 'Features'],
    datasets: sortedData.map((model, index) => ({
      label: model.name,
      data: [
        model.totalCost,
        model.inputCost,
        model.outputCost,
        model.contextWindow / 1000, // Normalized context window
        models[index].features.length // Number of features
      ],
      backgroundColor: `hsla(${index * (360 / sortedData.length)}, 85%, 60%, 0.2)`,
      borderColor: `hsla(${index * (360 / sortedData.length)}, 85%, 60%, 0.8)`,
      borderWidth: 2,
      pointBackgroundColor: `hsla(${index * (360 / sortedData.length)}, 85%, 60%, 1)`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `hsla(${index * (360 / sortedData.length)}, 85%, 60%, 1)`,
      pointRadius: 4,
      pointHoverRadius: 6,
    }))
  };

  const scatterData = {
    datasets: sortedData.map((model, index) => ({
      label: model.name,
      data: [{
        x: model.contextWindow / 1000, // Normalized context window
        y: model.totalCost
      }],
      backgroundColor: `hsla(${index * (360 / sortedData.length)}, 85%, 60%, 0.6)`,
      borderColor: `hsla(${index * (360 / sortedData.length)}, 85%, 60%, 0.8)`,
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 10,
    }))
  };

  const barOptions = {
    ...commonOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: `Cost (${params.currency})`,
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          callback: (value: number) => formatCurrency(value),
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 11
          }
        },
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 11
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  };

  const radarOptions = {
    ...commonOptions,
    scales: {
      r: {
        angleLines: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        },
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
          backdropColor: 'transparent',
          font: {
            family: 'Inter',
            size: 11
          }
        },
        pointLabels: {
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };

  const scatterOptions = {
    ...commonOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Context Window (K tokens)',
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 11
          }
        },
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        }
      },
      y: {
        title: {
          display: true,
          text: `Total Cost (${params.currency})`,
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          callback: (value: number) => formatCurrency(value),
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter',
            size: 11
          }
        },
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        }
      }
    }
  };

  // Calculate dynamic height based on chart type and data
  const getChartHeight = () => {
    if (params.chartType === 'bar') {
      const barHeight = 40;
      const minHeight = 300;
      return Math.max(minHeight, sortedData.length * barHeight);
    }
    return 400; // Fixed height for radar and scatter
  };

  const chartTypes = [
    { type: 'bar', label: 'Bar Chart', icon: BarChart2 },
    { type: 'radar', label: 'Radar Chart', icon: RadarIcon },
    { type: 'scatter', label: 'Scatter Plot', icon: ScatterIcon }
  ];

  return (
    <div className={`transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-xl shadow-soft`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Cost Visualization
        </h2>
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {params.chartType === 'bar' && 'Comparing input and output costs across models'}
          {params.chartType === 'radar' && 'Multi-dimensional model comparison'}
          {params.chartType === 'scatter' && 'Cost vs Context Window analysis'}
        </p>
      </div>

      {/* Visualization Type Selector */}
      <div className="mb-6">
        <div className={`inline-flex rounded-lg p-1 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {chartTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => onParamsChange({ ...params, chartType: type as ChartType })}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                params.chartType === type
                  ? darkMode
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-white text-blue-600 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        style={{ height: `${getChartHeight()}px` }} 
        className={`w-full rounded-lg p-4 ${
          darkMode ? 'bg-gray-900/30' : 'bg-gray-50'
        }`}
      >
        {params.chartType === 'bar' && <Bar data={barData} options={barOptions} />}
        {params.chartType === 'radar' && <Radar data={radarData} options={radarOptions} />}
        {params.chartType === 'scatter' && <Scatter data={scatterData} options={scatterOptions} />}
      </div>
    </div>
  );
}