import { motion } from 'framer-motion';
import { Book, Calculator, Code2, Cpu, DollarSign, FileText, Settings2 } from 'lucide-react';

interface DocumentationProps {
  darkMode: boolean;
}

export default function Documentation({ darkMode }: DocumentationProps) {
  const sections = [
    {
      title: 'Introduction',
      icon: Book,
      content: `The LLM Cost Calculation Engine accurately estimates inference costs across leading AI model providers, enabling precise budget forecasting and cost optimization for enterprise AI implementations.`
    },
    {
      title: 'Core Calculation Framework',
      icon: Calculator,
      subsections: [
        {
          title: 'Calculation Methods',
          content: [
            {
              heading: 'Token-Based Calculation',
              items: [
                'Direct calculation using exact token counts',
                'Recommended for production environments and precise budgeting'
              ]
            },
            {
              heading: 'Word-Based Calculation',
              items: [
                'Utilizes industry-standard token-to-word conversion ratio (1.333 tokens per word)',
                'Suitable for preliminary estimates and content planning'
              ]
            }
          ]
        },
        {
          title: 'Cost Calculation Algorithm',
          content: `The engine employs the following calculation framework:
          Total Cost = (Input Token Cost) + (Output Token Cost)

          Where:
          Input Token Cost = (Input Tokens ÷ 1,000,000) × Input Rate × Request Volume
          Output Token Cost = (Output Tokens ÷ 1,000,000) × Output Rate × Request Volume`
        }
      ]
    },
    {
      title: 'Calculation Process',
      icon: Settings2,
      subsections: [
        {
          title: 'Input Processing',
          content: [
            'Token-based: Uses provided token count directly',
            'Word-based: Converts using the formula: Tokens = Words × 1.333'
          ]
        },
        {
          title: 'Volume Scaling',
          content: [
            'Multiplies token counts by request volume',
            'Formula: Total Tokens = Tokens per Request × Number of Requests'
          ]
        },
        {
          title: 'Provider-Specific Rate Application',
          content: [
            'Applies provider-specific rates for input and output tokens',
            'Rates stored in continuously-updated provider database',
            'All rates expressed in cost per million tokens'
          ]
        },
        {
          title: 'Currency Conversion',
          content: [
            'Performs real-time currency conversion between USD and INR',
            'Current exchange rate: 1 USD = 86.65 INR'
          ]
        }
      ]
    },
    {
      title: 'Provider Coverage',
      icon: Cpu,
      subsections: [
        {
          title: 'OpenAI Models',
          content: [
            'Premium models: GPT-4.5 Preview, GPT-4o series, O1/O3 series',
            'Standard models: GPT-4-Turbo, GPT-3.5-Turbo',
            'Specialized variants: Audio, Realtime, Mini'
          ]
        },
        {
          title: 'Anthropic Models',
          content: [
            'Enterprise-grade: Claude 3.7 Sonnet, Claude 3.5 Sonnet',
            'Standard: Claude 3.5 Haiku, Claude 3 Haiku',
            'Advanced: Claude 3 Opus'
          ]
        },
        {
          title: 'Groq Models',
          content: [
            'DeepSeek series',
            'Qwen series',
            'Llama family (3, 3.1, 3.2, 3.3, Guard)',
            'Gemma and Mistral variants'
          ]
        }
      ]
    },
    {
      title: 'Implementation Example',
      icon: Code2,
      content: `
        Input Parameters:
        - Input: 20 words (26.67 tokens)
        - Output: 200 words (266.67 tokens)
        - Request volume: 100
        - Model: Claude 3.5 Sonnet (Anthropic)
        - Rates: $3.00 per million input tokens, $15.00 per million output tokens

        Calculation Execution:
        - Total input tokens: 26.67 × 100 = 2,667 tokens
        - Total output tokens: 266.67 × 100 = 26,667 tokens
        - Input cost: (2,667 ÷ 1,000,000) × $3.00 = $0.008
        - Output cost: (26,667 ÷ 1,000,000) × $15.00 = $0.400
        - Total USD cost: $0.008 + $0.400 = $0.408
        - Total INR cost: $0.408 × 86.65 = ₹35.35
      `
    },
    {
      title: 'Technical Considerations',
      icon: FileText,
      subsections: [
        {
          title: 'Token Calculation Precision',
          content: [
            'The token-to-word ratio (1.333) represents an industry average',
            'Actual tokenization varies by model and content characteristics',
            'For mission-critical applications, we recommend using model-specific tokenizers'
          ]
        },
        {
          title: 'Rate Validation',
          content: [
            'All provider rates are validated against official pricing documentation',
            'Rate database updated within 24 hours of any provider pricing changes'
          ]
        },
        {
          title: 'Enterprise Volume Considerations',
          content: [
            'The engine calculates costs based on standard published rates',
            'Enterprise customers with negotiated rates can apply custom multipliers',
            'Volume discounts are not automatically applied in calculations',
            'Compatible with enterprise procurement and budgeting systems'
          ]
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-4xl mx-auto space-y-12 ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className={`text-4xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Model Metrics
            </h1>
            <p className={`text-xl ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              LLM Cost Calculation Engine
            </p>
            <div className={`inline-block px-4 py-2 rounded-full ${
              darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              Technical Documentation
            </div>
          </div>

          {/* Documentation Sections */}
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`p-8 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-soft`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${
                  darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}>
                  <section.icon className={`w-6 h-6 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <h2 className={`text-2xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {section.title}
                </h2>
              </div>

              {typeof section.content === 'string' && (
                <div className={`prose max-w-none ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } whitespace-pre-wrap`}>
                  {section.content}
                </div>
              )}

              {section.subsections && (
                <div className="space-y-6 mt-6">
                  {section.subsections.map((subsection) => (
                    <div key={subsection.title}>
                      <h3 className={`text-xl font-medium mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {subsection.title}
                      </h3>
                      {Array.isArray(subsection.content) ? (
                        <ul className="space-y-2">
                          {subsection.content.map((item, i) => (
                            typeof item === 'string' ? (
                              <li key={i} className={`flex items-start gap-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                                  darkMode ? 'bg-gray-500' : 'bg-gray-400'
                                }`} />
                                {item}
                              </li>
                            ) : (
                              <div key={i} className="mb-4">
                                <h4 className={`text-lg font-medium mb-2 ${
                                  darkMode ? 'text-gray-100' : 'text-gray-800'
                                }`}>
                                  {item.heading}
                                </h4>
                                <ul className="space-y-2">
                                  {item.items.map((subItem, j) => (
                                    <li key={j} className={`flex items-start gap-2 ${
                                      darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                                        darkMode ? 'bg-gray-500' : 'bg-gray-400'
                                      }`} />
                                      {subItem}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          ))}
                        </ul>
                      ) : (
                        <div className={`prose max-w-none ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        } whitespace-pre-wrap`}>
                          {subsection.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}

          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sections.length * 0.1, duration: 0.5 }}
            className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-soft`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl ${
                darkMode ? 'bg-green-900/30' : 'bg-green-50'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <h2 className={`text-2xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Conclusion
              </h2>
            </div>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              The LLM Cost Calculation Engine provides enterprise customers with accurate, transparent cost projections across the AI model ecosystem, enabling informed decision-making and optimal resource allocation for AI initiatives.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}