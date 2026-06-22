"use client";

import type { SimulationInput } from "@/types/simulator";
import { formatMonths } from "@/lib/format";

type SimulatorFormProps = {
  input: SimulationInput;
  onChange: (input: SimulationInput) => void;
};

const numberValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function SimulatorForm({ input, onChange }: SimulatorFormProps) {
  const update = <Key extends keyof SimulationInput>(key: Key, value: SimulationInput[Key]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <section className="rounded-lg border border-[#d9cfbf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#17211b]">Parametres</h2>
          <p className="mt-1 text-sm text-[#647067]">Ajustez les hypotheses de simulation.</p>
        </div>
      </div>

      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#243127]">Crypto choisie</span>
          <select
            value={input.crypto}
            onChange={(event) => update("crypto", event.target.value as SimulationInput["crypto"])}
            className="h-12 rounded-md border border-[#cfc3b0] bg-white px-3 text-[#17211b] outline-none transition focus:border-[#0f6b4f] focus:ring-2 focus:ring-[#0f6b4f]/20"
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
            <option value="custom">Autre crypto personnalisee</option>
          </select>
        </label>

        {input.crypto === "custom" ? (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#243127]">Nom de la crypto</span>
            <input
              value={input.customCryptoName ?? ""}
              onChange={(event) => update("customCryptoName", event.target.value)}
              placeholder="Ex. Chainlink"
              className="h-12 rounded-md border border-[#cfc3b0] bg-white px-3 text-[#17211b] outline-none transition focus:border-[#0f6b4f] focus:ring-2 focus:ring-[#0f6b4f]/20"
            />
          </label>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Montant initial investi"
            suffix="EUR"
            min={0}
            value={input.initialInvestment}
            onChange={(value) => update("initialInvestment", value)}
          />
          <NumberField
            label="Versement mensuel"
            suffix="EUR"
            min={0}
            value={input.monthlyContribution}
            onChange={(value) => update("monthlyContribution", value)}
          />
        </div>

        <label className="grid gap-2">
          <span className="flex items-center justify-between gap-3 text-sm font-medium text-[#243127]">
            <span>Duree d'investissement</span>
            <span className="rounded-full bg-[#edf5ef] px-3 py-1 text-xs font-semibold text-[#0f6b4f]">
              {formatMonths(input.durationMonths)}
            </span>
          </span>
          <input
            type="range"
            min={1}
            max={360}
            step={1}
            value={input.durationMonths}
            onChange={(event) => update("durationMonths", numberValue(event.target.value))}
            className="accent-[#0f6b4f]"
          />
          <span className="text-xs text-[#647067]">De 1 mois a 30 ans.</span>
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField
            label="Rendement annuel estime"
            suffix="%"
            min={-100}
            max={300}
            step={0.1}
            value={input.annualReturnRate}
            onChange={(value) => update("annualReturnRate", value)}
          />
          <NumberField
            label="Frais d'entree"
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
      <span className="text-sm font-medium text-[#243127]">{label}</span>
      <span className="flex h-12 items-center overflow-hidden rounded-md border border-[#cfc3b0] bg-white transition focus-within:border-[#0f6b4f] focus-within:ring-2 focus-within:ring-[#0f6b4f]/20">
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
