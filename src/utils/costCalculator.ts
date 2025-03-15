export interface CostCalculationParams {
  inputSize: number;
  outputSize: number;
  requests: number;
  useTokens: boolean;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
}

const WORD_TO_TOKEN_RATIO = 1.333;
const USD_TO_INR = 86.65;

export function calculateCosts(params: CostCalculationParams) {
  const {
    inputSize,
    outputSize,
    requests,
    useTokens,
    inputCostPerMillion,
    outputCostPerMillion
  } = params;

  // Convert to tokens if input is in words
  const inputTokens = useTokens ? inputSize : inputSize * WORD_TO_TOKEN_RATIO;
  const outputTokens = useTokens ? outputSize : outputSize * WORD_TO_TOKEN_RATIO;

  // Calculate total tokens
  const totalInputTokens = requests * inputTokens;
  const totalOutputTokens = requests * outputTokens;

  // Calculate costs in USD
  const inputCostUSD = (totalInputTokens / 1_000_000) * inputCostPerMillion;
  const outputCostUSD = (totalOutputTokens / 1_000_000) * outputCostPerMillion;
  const totalCostUSD = inputCostUSD + outputCostUSD;

  // Calculate costs in INR
  const inputCostINR = inputCostUSD * USD_TO_INR;
  const outputCostINR = outputCostUSD * USD_TO_INR;
  const totalCostINR = totalCostUSD * USD_TO_INR;

  return {
    tokens: {
      input: inputTokens,
      output: outputTokens,
      totalInput: totalInputTokens,
      totalOutput: totalOutputTokens
    },
    costsUSD: {
      input: inputCostUSD,
      output: outputCostUSD,
      total: totalCostUSD
    },
    costsINR: {
      input: inputCostINR,
      output: outputCostINR,
      total: totalCostINR
    }
  };
}