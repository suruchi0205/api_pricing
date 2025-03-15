import { Model, ModelFeature } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ModelFeatureMatrixProps {
  models: Model[];
  darkMode: boolean;
}

export default function ModelFeatureMatrix({ models, darkMode }: ModelFeatureMatrixProps) {
  const allFeatures = Array.from(
    new Set(models.flatMap(model => model.features))
  ).sort() as ModelFeature[];

  return (
    <div className={`transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 rounded-lg shadow-sm`}>
      <h2 className={`text-lg font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Feature Comparison
      </h2>
      
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${
          darkMode ? 'divide-gray-700' : 'divide-gray-200'
        }`}>
          <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Model
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } uppercase tracking-wider`}>
                Context Window
              </th>
              {allFeatures.map(feature => (
                <th
                  key={feature}
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  {feature}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {models.map((model) => (
              <tr key={model.id} className={
                darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              }>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {model.provider}
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {model.contextWindow.toLocaleString()} tokens
                </td>
                {allFeatures.map(feature => (
                  <td
                    key={feature}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {model.features.includes(feature) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}