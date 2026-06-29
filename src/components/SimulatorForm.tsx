"use client";

import type { SimulationInput } from "@/types/simulator";
import { formatMonths } from "@/lib/format";
import { computeDurationMonths } from "@/lib/date-utils";

type SimulatorFormProps = {
  input: SimulationInput;
  onChange: (input: SimulationInput) => void;
};

const numberValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const STRATEGY_OPTIONS: { value: SimulationInput["strategy"]; label: string }[] = [
  { value: "initial-only", label: "Investissement initial seul" },
  { value: "dca-only", label: "DCA périodique" },
  { value: "initial-dca", label: "Initial + DCA" },
];

const FREQUENCY_OPTIONS: { value: SimulationInput["frequency"]; label: string }[] = [
  { value: "monthly", label: "Mensuelle" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "daily", label: "Quotidienne" },
];

export function SimulatorForm({ input, onChange }: SimulatorFormProps) {
  const update = <Key extends keyof SimulationInput>(key: Key, value: SimulationInput[Key]) => {
    const next = { ...input, [key]: value };

    // Auto-compute duration when dates change
    if (key === "startDate" || key === "endDate") {
      next.durationMonths = computeDurationMonths(next.startDate, next.endDate);
    }

    // Force monthly contribution to zero based on strategy
    if (key === "strategy") {
      if (value === "initial-only") {
        next.monthlyContribution = 0;
      } else if (value === "dca-only") {
        next.initialInvestment = 0;
      }
    }

    onChange(next);
  };

  return (
    <section className="rounded-xl border border-[#d9cfbf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#17211b]">Paramètres</h2>
          <p className="mt-1 text-sm text-[#647067]">Ajustez les hypothèses de simulation.</p>
        </div>
      </div>

      <div className="grid gap-5">
        {/* Crypto */}
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#243127]">Crypto choisie</span>
          <select
            value={input.crypto}
            onChange={(event) => update("crypto", event.target.value as SimulationInput["crypto"])}
            className="h-12 rounded-lg border border-[#cfc3b0] bg-white px-3 text-[#17211b] outline-none transition focus:border-[#0f6b4f] focus:ring-2 focus:ring-[#0f6b4f]/20"
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
            <option value="custom">Autre crypto personnalisée</option>
          </select>
          <span className="text-xs leading-5 text-[#647067]">
            Le rendement annuel est pré-rempli par une hypothèse de démonstration selon la crypto,
            puis reste entièrement modifiable.
          </span>
        </label>

        {input.crypto === "custom" ? (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#243127]">Nom de la crypto</span>
            <input
              value={input.customCryptoName ?? ""}
              onChange={(event) => update("customCryptoName", event.target.value)}
              placeholder="Ex. Chainlink"
              className="h-12 rounded-lg border border-[#cfc3b0] bg-white px-3 text-[#17211b] outline-none transition focus:border-[#0f6b4f] focus:ring-2 focus:ring-[#0f6b4f]/20"
            />
          </label>
        ) : null}

        {/* Strategy */}
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-[#243127]">Stratégie d'investissement</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {STRATEGY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium transition ${
                  input.strategy === opt.value
                    ? "border-[#0f6b4f] bg-[#0f6b4f]/10 text-[#0f6b4f]"
                    : "border-[#cfc3b0] bg-white text-[#647067] hover:border-[#0f6b4f]/40"
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value={opt.value}
                  checked={input.strategy === opt.value}
                  onChange={() => update("strategy", opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Frequency */}
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#243127]">Fréquence d'investissement</span>
          <select
            value={input.frequency}
            onChange={(event) =>
              update("frequency", event.target.value as SimulationInput["frequency"])
            }
            className="h-12 rounded-lg border border-[#cfc3b0] bg-white px-3 text-[#17211b] outline-none transition focus:border-[#0f6b4f] focus:ring-2 focus:ring-[#0f6b4f]/20"
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* Period */}
        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium text-[#243127]">Période de simulation</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-[#647067]">Date de début</span>
              <input
                type="date"
                value={input.startDate}
                onChange={(event) => update("startDate", event.target.value)}
                className="h-12 rounded-lg border border-[#cfc3b0] bg-white px-3 text-[#17211b] outline-none transition focus:border-[#0f6b4f] focus:ring-2 focus:ring-[#0f6b4f]/20"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-[#647067]">Date de fin</span>
              <input
                type="date"
                value={input.endDate}
                onChange={(event) => update("endDate", event.target.value)}
                className="h-12 rounded-lg border border-[#cfc3b0] bg-white px-3 text-[#17211b] outline-none transition focus:border-[#0f6b4f] focus:ring-2 focus:ring-[#0f6b4f]/20"
              />
            </label>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#647067]">
            <span>Durée :</span>
            <span className="rounded-full bg-[#edf5ef] px-3 py-1 text-xs font-semibold text-[#0f6b4f]">
              {formatMonths(input.durationMonths)}
            </span>
          </div>
        </fieldset>

        {/* Amounts */}
        {input.strategy !== "dca-only" && (
          <NumberField
            label="Montant initial investi"
            suffix="EUR"
            min={0}
            value={input.initialInvestment}
            onChange={(value) => update("initialInvestment", value)}
          />
        )}

        {input.strategy !== "initial-only" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Versement périodique"
              suffix="EUR"
              min={0}
              value={input.monthlyContribution}
              onChange={(value) => update("monthlyContribution", value)}
            />
            <div className="flex items-end pb-3 text-sm text-[#647067]">
              <span className="rounded-md border border-[#eadfcc] bg-white px-3 py-2 text-xs">
                Fréquence : {FREQUENCY_OPTIONS.find((o) => o.value === input.frequency)?.label.toLowerCase()}
              </span>
            </div>
          </div>
        )}

        {/* Returns */}
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField
            label="Rendement annuel estimé"
            suffix="%"
            min={-100}
            max={300}
            step={0.1}
            value={input.annualReturnRate}
            onChange={(value) => update("annualReturnRate", value)}
          />
          <NumberField
            label="Frais d'entrée"
            suffix="%"
            min={0}
            max={50}
            step={0.1}
            value={input.entryFeeRate}
            onChange={(value) => update("entryFeeRate", value)}
          />
          <NumberField
            label="Frais annuels"
            suffix="%"
            min={0}
            max={50}
            step={0.1}
            value={input.annualFeeRate}
            onChange={(value) => update("annualFeeRate", value)}
          />
        </div>
      </div>
    </section>
  );
}

type NumberFieldProps = {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

function NumberField({ label, suffix, value, min, max, step = 1, onChange }: NumberFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#243127] sm:flex sm:min-h-10 sm:items-end">
        {label}
      </span>
      <span className="flex h-12 items-center overflow-hidden rounded-lg border border-[#cfc3b0] bg-white transition focus-within:border-[#0f6b4f] focus-within:ring-2 focus-within:ring-[#0f6b4f]/20">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(numberValue(event.target.value))}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 text-[#17211b] outline-none"
        />
        <span className="border-l border-[#eadfcc] px-3 text-sm font-semibold text-[#777064]">
          {suffix}
        </span>
      </span>
    </label>
  );
}
