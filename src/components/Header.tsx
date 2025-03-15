import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';

interface HeaderProps {
  darkMode: boolean;
  onThemeToggle: () => void;
}

export default function Header({ darkMode, onThemeToggle }: HeaderProps) {
  return (
    <header className={`transition-colors duration-200 ${
      darkMode ? 'bg-gray-800 shadow-gray-900/10' : 'bg-white shadow-sm'
    }`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ModelMetrics
            </h1>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              AI Inference Cost Calculator
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={onThemeToggle}
              className={`p-2 rounded-full hover:bg-opacity-10 ${
                darkMode 
                  ? 'hover:bg-white text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-900 text-gray-600 hover:text-gray-900'
              }`}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            <button className={`text-sm ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Documentation
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Save as PDF
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 