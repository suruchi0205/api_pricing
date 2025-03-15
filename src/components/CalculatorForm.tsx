import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { CalculationParams, Provider, Currency } from '../types';

interface CalculatorFormProps {
  params: CalculationParams;
  onParamsChange: (params: CalculationParams) => void;
  selectedProviders: Provider[];
  onProvidersChange: (providers: Provider[]) => void;
}

const providers: Provider[] = ['OpenAI', 'Anthropic', 'Groq'];
const currencies: Currency[] = ['USD', 'INR'];

export default function CalculatorForm({
  params,
  onParamsChange,
  selectedProviders,
  onProvidersChange,
}: CalculatorFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
          Calculation Parameters
        </h2>
        
        {/* Calculate By Toggle */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600 mb-2">Calculate by</span>
          <div className="flex items-center bg-gray-50 rounded-md px-3 py-1.5">
            <span className={`text-sm transition-colors whitespace-nowrap ${!params.useTokens ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Words
            </span>
            <Switch
              checked={params.useTokens}
              onChange={(checked) => onParamsChange({
                ...params,
                useTokens: checked
              })}
              className={`${
                params.useTokens ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-5 w-10 items-center rounded-full mx-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  params.useTokens ? 'translate-x-5' : 'translate-x-1'
                } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className={`text-sm transition-colors whitespace-nowrap ${params.useTokens ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Tokens
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Input {params.useTokens ? 'Tokens' : 'Words'}
          </label>
          <input
            type="number"
            value={params.inputSize}
            onChange={(e) => onParamsChange({
              ...params,
              inputSize: parseInt(e.target.value) || 0
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Output {params.useTokens ? 'Tokens' : 'Words'}
          </label>
          <input
            type="number"
            value={params.outputSize}
            onChange={(e) => onParamsChange({
              ...params,
              outputSize: parseInt(e.target.value) || 0
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Requests
          </label>
          <input
            type="number"
            value={params.requests}
            onChange={(e) => onParamsChange({
              ...params,
              requests: parseInt(e.target.value) || 0
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={params.currency}
            onChange={(e) => onParamsChange({
              ...params,
              currency: e.target.value as Currency
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Providers
          </label>
          <div className="space-y-2">
            {providers.map((provider) => (
              <div key={provider} className="flex items-center">
                <input
                  type="checkbox"
                  id={provider}
                  checked={selectedProviders.includes(provider)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onProvidersChange([...selectedProviders, provider]);
                    } else {
                      onProvidersChange(selectedProviders.filter(p => p !== provider));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={provider} className="ml-2 text-sm text-gray-700">
                  {provider}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 