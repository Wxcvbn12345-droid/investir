export type CryptoChoice = "bitcoin" | "ethereum" | "solana" | "custom";

export type SimulationInput = {
  crypto: CryptoChoice;
  customCryptoName?: string;
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
  initialNetInvestment: number;
  totalInitialInvestment: number;
  totalMonthlyContributions: number;
  totalInvested: number;
  finalValue: number;
  estimatedGain: number;
  totalReturnRate: number;
  totalFeesPaid: number;
  projection: ProjectionPoint[];
};
