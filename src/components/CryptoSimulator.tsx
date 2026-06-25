"use client";

import { useCallback, useMemo, useState } from "react";
import { calculateCryptoSimulation, sanitizeSimulationInput } from "@/lib/crypto-simulation";
import type { SimulationInput } from "@/types/simulator";
import { Disclaimer } from "./Disclaimer";
import { ProjectionChart } from "./ProjectionChart";
import { ResultCards } from "./ResultCards";
import { SimulatorForm } from "./SimulatorForm";

const CRYPTO_DEFAULT_RETURNS: Record<SimulationInput["crypto"], number> = {
  bitcoin: 8,
  ethereum: 10,
  solana: 12,
  custom: 0,
};

const getDefaultDates = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear() + 10, now.getMonth(), 1);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const { startDate, endDate } = getDefaultDates();

const defaultInput: SimulationInput = {
  crypto: "bitcoin",
  strategy: "initial-dca",
  frequency: "monthly",
  startDate,
  endDate,
  initialInvestment: 5000,
  monthlyContribution: 250,
  durationMonths: 120,
  annualReturnRate: 8,
  entryFeeRate: 0.5,
  annualFeeRate: 0.2,
};

type CryptoSimulatorProps = {
  compact?: boolean;
};

export function CryptoSimulator({ compact = false }: CryptoSimulatorProps) {
  const [input, setInput] = useState<SimulationInput>(defaultInput);
  const result = useMemo(() => calculateCryptoSimulation(input), [input]);
  const handleInputChange = useCallback((nextInput: SimulationInput) => {
    if (nextInput.crypto !== input.crypto) {
      nextInput.annualReturnRate = CRYPTO_DEFAULT_RETURNS[nextInput.crypto] ?? 0;
    }
    setInput(sanitizeSimulationInput(nextInput));
  }, [input.crypto]);

  return (
    <div
      className={
        compact
          ? "mx-auto w-full max-w-5xl"
          : "grid w-full max-w-full gap-6 lg:grid-cols-[420px_1fr]"
      }
    >
      <div className="grid content-start gap-5">
        {compact ? (
          <div className="mb-1">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#936f2b]">
              S'investir - Simulateur
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#17211b]">Simulateur crypto</h1>
            <p className="mt-2 text-sm leading-6 text-[#647067]">
              Simulez l'évolution potentielle de votre investissement crypto selon votre stratégie
              d'investissement.
            </p>
          </div>
        ) : null}
        <SimulatorForm input={input} onChange={handleInputChange} />
        <Disclaimer />
      </div>

      <div className="grid gap-5">
        <ResultCards result={result} />
        <ProjectionChart points={result.projection} />
      </div>
    </div>
  );
}
