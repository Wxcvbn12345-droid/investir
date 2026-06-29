import type { CryptoChoice } from "@/types/simulator";

export type CryptoReturnAssumption = {
  label: string;
  defaultAnnualReturnRate: number;
};

export const CRYPTO_RETURN_ASSUMPTIONS: Record<CryptoChoice, CryptoReturnAssumption> = {
  bitcoin: {
    label: "Bitcoin",
    defaultAnnualReturnRate: 8,
  },
  ethereum: {
    label: "Ethereum",
    defaultAnnualReturnRate: 10,
  },
  solana: {
    label: "Solana",
    defaultAnnualReturnRate: 12,
  },
  custom: {
    label: "Crypto personnalisée",
    defaultAnnualReturnRate: 0,
  },
};

export const getDefaultAnnualReturnForCrypto = (crypto: CryptoChoice) =>
  CRYPTO_RETURN_ASSUMPTIONS[crypto].defaultAnnualReturnRate;
