"use client";

import { useCallback, useMemo, useState } from "react";
import { getDefaultAnnualReturnForCrypto } from "@/lib/crypto-market-assumptions";
import { calculateCryptoSimulation, sanitizeSimulationInput } from "@/lib/crypto-simulation";
import type { SimulationInput } from "@/types/simulator";
import { Disclaimer } from "./Disclaimer";
import { ProjectionChart } from "./ProjectionChart";
import { ResultCards } from "./ResultCards";
import { SimulatorForm } from "./SimulatorForm";

const getDefaultDates = () => {
  const formatDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear() + 10, now.getMonth(), 1);

  return {
    startDate: formatDateInputValue(start),
    endDate: formatDateInputValue(end),
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
    const adjustedInput =
      nextInput.crypto !== input.crypto
        ? {
            ...nextInput,
            annualReturnRate: getDefaultAnnualReturnForCrypto(nextInput.crypto),
          }
        : nextInput;

    setInput(sanitizeSimulationInput(adjustedInput));
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
