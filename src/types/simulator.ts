export type CryptoChoice = "bitcoin" | "ethereum" | "solana" | "custom";

export type InvestmentStrategy = "initial-only" | "dca-only" | "initial-dca";

export type InvestmentFrequency = "monthly" | "weekly" | "daily";

export type SimulationInput = {
  crypto: CryptoChoice;
  customCryptoName?: string;
  strategy: InvestmentStrategy;
  frequency: InvestmentFrequency;
  startDate: string;
  endDate: string;
  initialInvestment: number;
  monthlyContribution: number;
  durationMonths: number;
  annualReturnRate: number;
  entryFeeRate: number;
  annualFeeRate: number;
};

export type ProjectionPoint = {
  month: number;
  year: number;
  investedCapital: number;
  estimatedValue: number;
  gains: number;
};

export type SimulationResult = {
  cryptoLabel: string;
  strategyLabel: string;
  frequencyLabel: string;
  startDate: string;
  endDate: string;
  initialNetInvestment: number;
  totalInitialInvestment: number;
  totalPeriodicContributions: number;
  totalInvested: number;
  finalValue: number;
  estimatedGain: number;
  totalReturnRate: number;
  totalFeesPaid: number;
  projection: ProjectionPoint[];
};