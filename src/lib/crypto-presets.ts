import type { CryptoChoice } from "@/types/simulator";

export const CRYPTO_RETURN_PRESETS: Record<CryptoChoice, number> = {
  bitcoin: 8,
  ethereum: 10,
  solana: 12,
  custom: 8,
};
