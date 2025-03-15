import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { CalculationParams, Provider, Currency } from '../types';
import { InfoIcon } from 'lucide-react';

interface CalculatorFormProps {
  params: CalculationParams;
  onParamsChange: (params: CalculationParams) => void;
  selectedProviders: Provider[];
  onProvidersChange: (providers: Provider[]) => void;
  darkMode: boolean;
}

const providers: Provider[] = ['OpenAI', 'Anthropic', 'Groq'];
const currencies: Currency[] = ['USD', 'INR'];

const providerColors = {
  OpenAI: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
  Anthropic: 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100',
  Groq: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
};

const providerColorsDark = {
  OpenAI: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-800/30',
  Anthropic: 'bg-purple-900/30 text-purple-400 border-purple-800/50 hover:bg-purple-800/30',
  Groq: 'bg-amber-900/30 text-amber-400 border-amber-800/50 hover:bg-amber-800/30'
};

export default function CalculatorForm({
  params,
  onParamsChange,
  selectedProviders,
  onProvidersChange,
  darkMode,
}: CalculatorFormProps) {
  return (
    <motion.div 
      className={`transition-all duration-200 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } p-6 rounded-xl shadow-soft space-y-8`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Model Cost Calculator
        </h2>
        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Compare costs across different LLM providers
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Calculate by</span>
          <div className={`flex items-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg px-3 py-1.5`}>
            <span className={`text-sm transition-colors ${
              !params.useTokens 
                ? darkMode ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Words
            </span>
            <Switch
              checked={params.useTokens}
              onChange={(checked) => onParamsChange({
                ...params,
                useTokens: checked
              })}
              className={`${
                params.useTokens ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              } relative inline-flex h-5 w-10 items-center rounded-full mx-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  params.useTokens ? 'translate-x-5' : 'translate-x-1'
                } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className={`text-sm transition-colors ${
              params.useTokens
                ? darkMode ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Tokens
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1 flex items-center`}>
              <span>Input {params.useTokens ? 'Tokens' : 'Words'}</span>
              <InfoIcon className="h-4 w-4 ml-1.5 text-gray-400" />
            </label>
            <input
              type="number"
              value={params.inputSize}
              onChange={(e) => onParamsChange({
                ...params,
                inputSize: parseInt(e.target.value) || 0
              })}
              className={`w-full px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } transition-colors duration-200 shadow-sm`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1 flex items-center`}>
              <span>Output {params.useTokens ? 'Tokens' : 'Words'}</span>
              <InfoIcon className="h-4 w-4 ml-1.5 text-gray-400" />
            </label>
            <input
              type="number"
              value={params.outputSize}
              onChange={(e) => onParamsChange({
                ...params,
                outputSize: parseInt(e.target.value) || 0
              })}
              className={`w-full px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } transition-colors duration-200 shadow-sm`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1 flex items-center`}>
              <span>Number of Requests</span>
              <InfoIcon className="h-4 w-4 ml-1.5 text-gray-400" />
            </label>
            <input
              type="number"
              value={params.requests}
              onChange={(e) => onParamsChange({
                ...params,
                requests: parseInt(e.target.value) || 0
              })}
              className={`w-full px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } transition-colors duration-200 shadow-sm`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}>
              Currency
            </label>
            <select
              value={params.currency}
              onChange={(e) => onParamsChange({
                ...params,
                currency: e.target.value as Currency
              })}
              className={`w-full px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } transition-colors duration-200 shadow-sm`}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } mb-3`}>
            Compare Providers
          </label>
          <div className="flex flex-wrap gap-2">
            {providers.map((provider) => (
              <motion.button
                key={provider}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (selectedProviders.includes(provider)) {
                    onProvidersChange(selectedProviders.filter(p => p !== provider));
                  } else {
                    onProvidersChange([...selectedProviders, provider]);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  selectedProviders.includes(provider)
                    ? darkMode 
                      ? providerColorsDark[provider]
                      : providerColors[provider]
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {provider}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}