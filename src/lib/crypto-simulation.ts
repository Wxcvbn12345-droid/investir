import type { SimulationInput, SimulationResult } from "@/types/simulator";
import { computeDurationMonths } from "./date-utils.ts";

const CRYPTO_LABELS: Record<SimulationInput["crypto"], string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  custom: "Crypto personnalisée",
};

const STRATEGY_LABELS: Record<SimulationInput["strategy"], string> = {
  "initial-only": "Investissement initial seul",
  "dca-only": "DCA mensuel",
  "initial-dca": "Initial + DCA",
};

const FREQUENCY_LABELS: Record<SimulationInput["frequency"], string> = {
  monthly: "Mensuelle",
  weekly: "Hebdomadaire",
  daily: "Quotidienne",
};

/** Number of periods per month for each frequency */
const FREQUENCY_PERIODS_PER_MONTH: Record<SimulationInput["frequency"], number> = {
  monthly: 1,
  weekly: 4.33,
  daily: 30.42,
};

const clamp = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const sanitizeSimulationInput = (input: SimulationInput): SimulationInput => {
  const durationMonths = computeDurationMonths(input.startDate, input.endDate);

  return {
    ...input,
    initialInvestment:
      input.strategy === "dca-only"
        ? 0
        : clamp(input.initialInvestment, 0, 100_000_000),
    monthlyContribution:
      input.strategy === "initial-only"
        ? 0
        : clamp(input.monthlyContribution, 0, 10_000_000),
    durationMonths: Math.round(clamp(durationMonths, 1, 600)),
    annualReturnRate: clamp(input.annualReturnRate, -100, 300),
    entryFeeRate: clamp(input.entryFeeRate, 0, 50),
    annualFeeRate: clamp(input.annualFeeRate, 0, 50),
  };
};

export const getCryptoLabel = (input: Pick<SimulationInput, "crypto" | "customCryptoName">) => {
  if (input.crypto === "custom") {
    const customName = input.customCryptoName?.trim();
    return customName ? customName : "Crypto personnalisée";
  }

  return CRYPTO_LABELS[input.crypto];
};

export const calculateCryptoSimulation = (rawInput: SimulationInput): SimulationResult => {
  const input = sanitizeSimulationInput(rawInput);
  const monthlyReturnRate = Math.pow(1 + input.annualReturnRate / 100, 1 / 12) - 1;
  const monthlyFeeRate = Math.pow(1 + input.annualFeeRate / 100, 1 / 12) - 1;
  const entryFeeMultiplier = 1 - input.entryFeeRate / 100;
  const periodsPerMonth = FREQUENCY_PERIODS_PER_MONTH[input.frequency];
  const totalMonths = input.durationMonths;
  const totalPeriods = Math.round(totalMonths * periodsPerMonth);

  // Convert monthly contribution to per-period contribution
  const periodContribution =
    input.strategy === "initial-only" ? 0 : input.monthlyContribution / periodsPerMonth;

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

  for (let period = 1; period <= totalPeriods; period += 1) {
    const periodContributionAfterEntryFee = periodContribution * entryFeeMultiplier;
    totalFeesPaid += periodContribution - periodContributionAfterEntryFee;

    estimatedValue += periodContributionAfterEntryFee;
    // Apply monthly return rate at each period (compounded within the month)
    estimatedValue *= Math.pow(1 + monthlyReturnRate, 1 / periodsPerMonth);

    // Apply fees monthly (at the end of each month's periods)
    const monthIndex = Math.ceil(period / periodsPerMonth);
    const isLastPeriodOfMonth = period % periodsPerMonth === 0 || period === totalPeriods;
    if (isLastPeriodOfMonth) {
      const monthlyFeeAmount = estimatedValue * monthlyFeeRate;
      estimatedValue -= monthlyFeeAmount;
      totalFeesPaid += monthlyFeeAmount;
    }

    const month = Math.floor(period / periodsPerMonth);
    const investedCapital =
      input.initialInvestment + periodContribution * period;

    if (period % Math.round(periodsPerMonth) === 0 || period === totalPeriods) {
      projection.push({
        month,
        year: month / 12,
        investedCapital,
        estimatedValue,
        gains: estimatedValue - investedCapital,
      });
    }
  }

  // Ensure last point is always included
  const lastProjected = projection[projection.length - 1];
  const totalInvested = input.initialInvestment + periodContribution * totalPeriods;
  const estimatedGain = estimatedValue - totalInvested;
  const totalReturnRate = totalInvested > 0 ? (estimatedGain / totalInvested) * 100 : 0;

  // If the last projected point doesn't match final values, update it
  if (lastProjected) {
    lastProjected.estimatedValue = estimatedValue;
    lastProjected.investedCapital = totalInvested;
    lastProjected.gains = estimatedValue - totalInvested;
  }

  return {
    cryptoLabel: getCryptoLabel(input),
    strategyLabel: STRATEGY_LABELS[input.strategy],
    frequencyLabel: FREQUENCY_LABELS[input.frequency],
    startDate: input.startDate,
    endDate: input.endDate,
    initialNetInvestment: input.initialInvestment * entryFeeMultiplier,
    totalInitialInvestment: input.initialInvestment,
    totalMonthlyContributions: input.monthlyContribution * totalMonths,
    totalInvested,
    finalValue: estimatedValue,
    estimatedGain,
    totalReturnRate,
    totalFeesPaid,
    projection,
  };
};