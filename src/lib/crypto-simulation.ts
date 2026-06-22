import type { SimulationInput, SimulationResult } from "@/types/simulator";

const CRYPTO_LABELS: Record<SimulationInput["crypto"], string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  custom: "Crypto personnalisee",
};

const clamp = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const sanitizeSimulationInput = (input: SimulationInput): SimulationInput => ({
  ...input,
  initialInvestment: clamp(input.initialInvestment, 0, 100_000_000),
  monthlyContribution: clamp(input.monthlyContribution, 0, 10_000_000),
  durationMonths: Math.round(clamp(input.durationMonths, 1, 600)),
  annualReturnRate: clamp(input.annualReturnRate, -100, 300),
  entryFeeRate: clamp(input.entryFeeRate, 0, 50),
  annualFeeRate: clamp(input.annualFeeRate, 0, 50),
});

export const getCryptoLabel = (input: Pick<SimulationInput, "crypto" | "customCryptoName">) => {
  if (input.crypto === "custom") {
    const customName = input.customCryptoName?.trim();
    return customName ? customName : "Crypto personnalisee";
  }

  return CRYPTO_LABELS[input.crypto];
};

export const calculateCryptoSimulation = (rawInput: SimulationInput): SimulationResult => {
  const input = sanitizeSimulationInput(rawInput);
  const monthlyReturnRate = Math.pow(1 + input.annualReturnRate / 100, 1 / 12) - 1;
  const monthlyFeeRate = Math.pow(1 + input.annualFeeRate / 100, 1 / 12) - 1;
  const entryFeeMultiplier = 1 - input.entryFeeRate / 100;

  let estimatedValue = input.initialInvestment * entryFeeMultiplier;
  let totalFeesPaid = input.initialInvestment - estimatedValue;
  const projection = [];

  projection.push({
    month: 0,
    year: 0,
    investedCapital: input.initialInvestment,
    estimatedValue,
    gains: estimatedValue - input.initialInvestment,
  });

  for (let month = 1; month <= input.durationMonths; month += 1) {
    const monthlyContributionAfterEntryFee = input.monthlyContribution * entryFeeMultiplier;
    totalFeesPaid += input.monthlyContribution - monthlyContributionAfterEntryFee;

    estimatedValue += monthlyContributionAfterEntryFee;
    estimatedValue *= 1 + monthlyReturnRate;

    const monthlyFeeAmount = estimatedValue * monthlyFeeRate;
    estimatedValue -= monthlyFeeAmount;
    totalFeesPaid += monthlyFeeAmount;

    const investedCapital = input.initialInvestment + input.monthlyContribution * month;

    projection.push({
      month,
      year: month / 12,
      investedCapital,
      estimatedValue,
      gains: estimatedValue - investedCapital,
    });
  }

  const totalMonthlyContributions = input.monthlyContribution * input.durationMonths;
  const totalInvested = input.initialInvestment + totalMonthlyContributions;
  const estimatedGain = estimatedValue - totalInvested;
  const totalReturnRate = totalInvested > 0 ? (estimatedGain / totalInvested) * 100 : 0;

  return {
    cryptoLabel: getCryptoLabel(input),
    initialNetInvestment: input.initialInvestment * entryFeeMultiplier,
    totalInitialInvestment: input.initialInvestment,
    totalMonthlyContributions,
    totalInvested,
    finalValue: estimatedValue,
    estimatedGain,
    totalReturnRate,
    totalFeesPaid,
    projection,
  };
};
