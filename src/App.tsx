import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import ResultsTable from './components/ResultsTable';
import CostVisualization from './components/CostVisualization';
import ModelFeatureMatrix from './components/ModelFeatureMatrix';
import CostBreakdown from './components/CostBreakdown';
import Documentation from './components/Documentation';
import { CalculationParams, Provider, ThemeConfig } from './types';
import { getAllModels } from './data/modelPricing';
import { BarChart3, PieChart, Layout, FileText } from 'lucide-react';

type View = 'visualization' | 'summary' | 'features' | 'docs';

function App() {
  const [params, setParams] = useState<CalculationParams>({
    inputSize: 20,
    outputSize: 200,
    requests: 100,
    useTokens: false,
    currency: 'USD',
    chartType: 'bar',
    timeframe: 'monthly'
  });
  
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>(['OpenAI', 'Anthropic', 'Groq']);
  const [theme, setTheme] = useState<ThemeConfig>({ darkMode: false });
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(
    getAllModels().map(model => model.id)
  );
  const [activeView, setActiveView] = useState<View>('visualization');

  const selectedModels = getAllModels().filter(model => 
    selectedProviders.includes(model.provider) && selectedModelIds.includes(model.id)
  );

  const navigationItems = [
    {
      id: 'visualization' as View,
      label: 'Cost Visualization',
      icon: BarChart3
    },
    {
      id: 'summary' as View,
      label: 'Cost Summary',
      icon: PieChart
    },
    {
      id: 'features' as View,
      label: 'Feature Comparison',
      icon: Layout
    },
    {
      id: 'docs' as View,
      label: 'Documentation',
      icon: FileText
    }
  ];

  if (activeView === 'docs') {
    return <Documentation darkMode={theme.darkMode} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme.darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header 
        darkMode={theme.darkMode}
        onThemeToggle={() => setTheme(prev => ({ darkMode: !prev.darkMode }))}
        onViewChange={setActiveView}
        activeView={activeView}
      />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence>
          <motion.div 
            className="grid lg:grid-cols-12 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Column */}
            <motion.div 
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CalculatorForm 
                params={params} 
                onParamsChange={setParams}
                selectedProviders={selectedProviders}
                onProvidersChange={setSelectedProviders}
                darkMode={theme.darkMode}
              />
            </motion.div>
            
            {/* Right Column */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="space-y-8">
                <ResultsTable 
                  params={params}
                  selectedProviders={selectedProviders}
                  darkMode={theme.darkMode}
                  selectedModelIds={selectedModelIds}
                  onSelectedModelsChange={setSelectedModelIds}
                />

                {/* Navigation Bar */}
                <div className={`p-1 rounded-lg ${
                  theme.darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-soft`}>
                  <nav className="flex space-x-1">
                    {navigationItems.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveView(id)}
                        className={`flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                          activeView === id
                            ? theme.darkMode
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-blue-50 text-blue-600'
                            : theme.darkMode
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                <AnimatePresence mode="wait">
                  {activeView === 'visualization' && (
                    <motion.div
                      key="visualization"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CostVisualization 
                        params={params}
                        onParamsChange={setParams}
                        selectedProviders={selectedProviders}
                        darkMode={theme.darkMode}
                        selectedModelIds={selectedModelIds}
                      />
                    </motion.div>
                  )}

                  {activeView === 'summary' && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CostBreakdown
                        params={params}
                        selectedProviders={selectedProviders}
                        darkMode={theme.darkMode}
                        selectedModelIds={selectedModelIds}
                      />
                    </motion.div>
                  )}

                  {activeView === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ModelFeatureMatrix
                        models={selectedModels}
                        darkMode={theme.darkMode}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;