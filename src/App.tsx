import { useState } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import ResultsTable from './components/ResultsTable';
import CostVisualization from './components/CostVisualization';
import { CalculationParams, Provider, ThemeConfig } from './types';
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';

function App() {
  const [params, setParams] = useState<CalculationParams>({
    inputSize: 20,
    outputSize: 200,
    requests: 100,
    useTokens: false,
    currency: 'USD'
  });
  
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>(['OpenAI', 'Anthropic', 'Groq']);
  const [theme, setTheme] = useState<ThemeConfig>({ darkMode: false });

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme.darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header 
        darkMode={theme.darkMode}
        onThemeToggle={() => setTheme(prev => ({ darkMode: !prev.darkMode }))}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <CalculatorForm 
              params={params} 
              onParamsChange={setParams}
              selectedProviders={selectedProviders}
              onProvidersChange={setSelectedProviders}
              darkMode={theme.darkMode}
            />
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-8">
            <div className="space-y-8">
              <ResultsTable 
                params={params}
                selectedProviders={selectedProviders}
                darkMode={theme.darkMode}
              />
              <CostVisualization 
                params={params}
                selectedProviders={selectedProviders}
                darkMode={theme.darkMode}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 