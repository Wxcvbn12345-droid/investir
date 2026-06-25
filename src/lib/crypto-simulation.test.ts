import assert from "node:assert/strict";
import test from "node:test";
import { calculateCryptoSimulation } from "./crypto-simulation.ts";
import type { SimulationInput } from "../types/simulator.ts";

const baseInput: SimulationInput = {
  crypto: "bitcoin",
  strategy: "initial-dca",
  frequency: "monthly",
  startDate: "2025-01-01",
  endDate: "2026-01-01",
  initialInvestment: 1000,
  monthlyContribution: 100,
  durationMonths: 12,
  annualReturnRate: 0,
  entryFeeRate: 0,
  annualFeeRate: 0,
};

test("rendement nul sans frais: valeur finale egale au capital investi", () => {
  const result = calculateCryptoSimulation(baseInput);
  // monthly frequency: 100/period * 12 periods = 1200 + 1000 initial = 2200
  assert.equal(result.totalInvested, 2200);
  assert.equal(result.finalValue, 2200);
  assert.equal(result.estimatedGain, 0);
});

test("versement periodique nul", () => {
  const result = calculateCryptoSimulation({ ...baseInput, monthlyContribution: 0 });
  assert.equal(result.totalPeriodicContributions, 0);
  assert.equal(result.totalInvested, 1000);
});

test("investissement initial nul", () => {
  const result = calculateCryptoSimulation({ ...baseInput, initialInvestment: 0 });
  assert.equal(result.totalInitialInvestment, 0);
  assert.equal(result.totalInvested, 1200);
});

test("duree minimale normalisee", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    startDate: "2025-01-01",
    endDate: "2025-01-01",
    initialInvestment: 1000,
    monthlyContribution: 100,
  });
  // Minimum duration is 1 month
  assert.equal(result.projection.length, 2);
  assert.equal(result.totalInvested, 1100);
});

test("frais non nuls reduisent la valeur finale", () => {
  const withoutFees = calculateCryptoSimulation(baseInput);
  const withFees = calculateCryptoSimulation({ ...baseInput, entryFeeRate: 2, annualFeeRate: 1 });
  assert.ok(withFees.finalValue < withoutFees.finalValue);
  assert.ok(withFees.totalFeesPaid > 0);
});

test("investissement initial seul avec rendement positif", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    strategy: "initial-only",
    monthlyContribution: 0,
    annualReturnRate: 10,
  });

  assert.equal(result.totalInvested, 1000);
  assert.ok(result.finalValue > result.totalInvested);
});

test("DCA seul sans investissement initial", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    strategy: "dca-only",
    initialInvestment: 0,
    monthlyContribution: 200,
    startDate: "2025-01-01",
    endDate: "2025-07-01", // ~6 months
  });

  assert.equal(result.totalInitialInvestment, 0);
  // monthly: 200/period * 6 periods = 1200
  assert.equal(result.totalPeriodicContributions, 1200);
  assert.equal(result.totalInvested, 1200);
});

test("investissement initial et DCA combines", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    initialInvestment: 2500,
    monthlyContribution: 150,
    startDate: "2025-01-01",
    endDate: "2027-01-01", // ~24 months
    annualReturnRate: 8,
  });

  assert.equal(result.totalInvested, 6100);
  assert.ok(result.finalValue > result.totalInvested);
});

test("duree courte et duree longue produisent des projections coherentes", () => {
  const shortResult = calculateCryptoSimulation({
    ...baseInput,
    startDate: "2025-01-01",
    endDate: "2025-02-01",
    monthlyContribution: 100,
  });
  const longResult = calculateCryptoSimulation({
    ...baseInput,
    startDate: "2025-01-01",
    endDate: "2055-01-01", // ~360 months
    monthlyContribution: 100,
  });

  assert.equal(shortResult.projection.length, 2); // month 0 + month 1
  assert.ok(longResult.totalInvested > shortResult.totalInvested);
});

test("valeurs incoherentes normalisees", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    initialInvestment: -1000,
    monthlyContribution: -250,
    startDate: "2025-01-01",
    endDate: "2025-01-01", // minimum 1 month
    annualReturnRate: 500,
    entryFeeRate: -3,
    annualFeeRate: -2,
  });

  assert.equal(result.totalInitialInvestment, 0);
  assert.equal(result.totalPeriodicContributions, 0);
  assert.equal(result.totalInvested, 0);
  assert.equal(result.projection.length, 2);
});

// --- New tests for strategy ---

test("strategie initial-only explicite: pas de DCA", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    strategy: "initial-only",
    monthlyContribution: 100,
    annualReturnRate: 5,
  });
  assert.equal(result.totalPeriodicContributions, 0);
  assert.equal(result.totalInvested, 1000);
  assert.equal(result.strategyLabel, "Investissement initial seul");
});

test("strategie dca-only explicite: pas d investissement initial", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    strategy: "dca-only",
    initialInvestment: 5000,
    monthlyContribution: 200,
    annualReturnRate: 5,
  });
  assert.equal(result.totalInitialInvestment, 0);
  // monthly: 200/period * 12 periods = 2400
  assert.equal(result.totalPeriodicContributions, 2400);
  assert.equal(result.strategyLabel, "DCA périodique");
});

test("strategie initial + DCA explicite", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    strategy: "initial-dca",
    initialInvestment: 1000,
    monthlyContribution: 200,
  });
  assert.equal(result.totalInitialInvestment, 1000);
  // monthly: 200/period * 12 periods = 2400
  assert.equal(result.totalPeriodicContributions, 2400);
  assert.equal(result.totalInvested, 3400);
  assert.equal(result.strategyLabel, "Initial + DCA");
});

// --- New tests for frequency ---

test("DCA mensuel 100 EUR 12 mois 0% rendement 0% frais", () => {
  const result = calculateCryptoSimulation({
    crypto: "bitcoin",
    strategy: "dca-only",
    frequency: "monthly",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    initialInvestment: 0,
    monthlyContribution: 100,
    durationMonths: 12,
    annualReturnRate: 0,
    entryFeeRate: 0,
    annualFeeRate: 0,
  });
  // 100/period * ~12 periods = ~1200
  assert.ok(result.totalInvested >= 1190 && result.totalInvested <= 1210);
  // Avec 0% rendement et 0% frais, finalValue === totalInvested
  assert.equal(result.finalValue, result.totalInvested);
  assert.equal(result.frequencyLabel, "Mensuelle");
});

test("DCA hebdomadaire 100 EUR 12 mois 0% rendement 0% frais", () => {
  const result = calculateCryptoSimulation({
    crypto: "bitcoin",
    strategy: "dca-only",
    frequency: "weekly",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    initialInvestment: 0,
    monthlyContribution: 100,
    durationMonths: 12,
    annualReturnRate: 0,
    entryFeeRate: 0,
    annualFeeRate: 0,
  });
  // 100/period * ~52 periods = ~5200
  assert.ok(result.totalInvested >= 5000 && result.totalInvested <= 5400);
  // Avec 0% rendement et 0% frais, finalValue === totalInvested
  assert.equal(result.finalValue, result.totalInvested);
  assert.equal(result.frequencyLabel, "Hebdomadaire");
});

test("DCA quotidien 10 EUR 12 mois 0% rendement 0% frais", () => {
  const result = calculateCryptoSimulation({
    crypto: "bitcoin",
    strategy: "dca-only",
    frequency: "daily",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    initialInvestment: 0,
    monthlyContribution: 10,
    durationMonths: 12,
    annualReturnRate: 0,
    entryFeeRate: 0,
    annualFeeRate: 0,
  });
  // 10/period * ~365 periods = ~3650
  assert.ok(result.totalInvested >= 3500 && result.totalInvested <= 3800);
  // Avec 0% rendement et 0% frais, finalValue === totalInvested
  assert.equal(result.finalValue, result.totalInvested);
  assert.equal(result.frequencyLabel, "Quotidienne");
});

test("frais annuels > 0 en hebdomadaire reduisent la valeur finale", () => {
  const withoutFees = calculateCryptoSimulation({
    ...baseInput,
    frequency: "weekly",
    monthlyContribution: 100,
    annualReturnRate: 5,
    entryFeeRate: 0,
    annualFeeRate: 0,
    startDate: "2025-01-01",
    endDate: "2026-01-01",
  });

  const withFees = calculateCryptoSimulation({
    ...baseInput,
    frequency: "weekly",
    monthlyContribution: 100,
    annualReturnRate: 5,
    entryFeeRate: 0,
    annualFeeRate: 2,
    startDate: "2025-01-01",
    endDate: "2026-01-01",
  });

  assert.ok(withFees.finalValue < withoutFees.finalValue);
  assert.ok(withFees.totalFeesPaid > 0);
});

test("frais annuels > 0 en quotidien reduisent la valeur finale", () => {
  const withoutFees = calculateCryptoSimulation({
    ...baseInput,
    frequency: "daily",
    monthlyContribution: 10,
    annualReturnRate: 5,
    entryFeeRate: 0,
    annualFeeRate: 0,
    startDate: "2025-01-01",
    endDate: "2026-01-01",
  });

  const withFees = calculateCryptoSimulation({
    ...baseInput,
    frequency: "daily",
    monthlyContribution: 10,
    annualReturnRate: 5,
    entryFeeRate: 0,
    annualFeeRate: 2,
    startDate: "2025-01-01",
    endDate: "2026-01-01",
  });

  assert.ok(withFees.finalValue < withoutFees.finalValue);
  assert.ok(withFees.totalFeesPaid > 0);
});

// --- New tests for dates ---

test("duree calculee depuis les dates debut/fin", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    startDate: "2025-01-01",
    endDate: "2026-06-01", // ~18 months
    initialInvestment: 1000,
    monthlyContribution: 0,
  });
  assert.ok(result.startDate === "2025-01-01");
  assert.ok(result.endDate === "2026-06-01");
  assert.ok(result.totalInvested >= 1000);
});

test("date de fin avant date de debut normalisee a 1 mois", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    startDate: "2026-01-01",
    endDate: "2025-01-01",
    initialInvestment: 1000,
    monthlyContribution: 100,
  });
  // Minimum 1 month of projection
  assert.equal(result.projection.length, 2);
});

test("periode tres courte: 1 mois", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    startDate: "2025-01-01",
    endDate: "2025-01-15",
    initialInvestment: 5000,
    monthlyContribution: 0,
  });
  // Au moins 1 mois de projection
  assert.equal(result.projection.length, 2);
  assert.equal(result.totalInvested, 5000);
});

test("periode longue: 30 ans", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    startDate: "2025-01-01",
    endDate: "2055-01-01",
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualReturnRate: 7,
  });
  assert.ok(result.totalInvested > 180000);
  assert.ok(result.totalInvested < 200000);
  assert.ok(result.finalValue > result.totalInvested);
});

test("frais d entree avec DCA", () => {
  const withFees = calculateCryptoSimulation({
    ...baseInput,
    initialInvestment: 10000,
    monthlyContribution: 500,
    entryFeeRate: 3,
    annualFeeRate: 0,
    annualReturnRate: 0,
  });

  const withoutFees = calculateCryptoSimulation({
    ...baseInput,
    initialInvestment: 10000,
    monthlyContribution: 500,
    entryFeeRate: 0,
    annualFeeRate: 0,
    annualReturnRate: 0,
  });
  // Avec frais d'entrée, la valeur finale doit être inférieure
  assert.ok(withFees.finalValue < withoutFees.finalValue);
  assert.ok(withFees.totalFeesPaid > 0);
});

test("resultats incluent les labels de strategie et frequence", () => {
  const result = calculateCryptoSimulation(baseInput);
  assert.ok(typeof result.strategyLabel === "string");
  assert.ok(result.strategyLabel.length > 0);
  assert.ok(typeof result.frequencyLabel === "string");
  assert.ok(result.frequencyLabel.length > 0);
  assert.ok(typeof result.startDate === "string");
  assert.ok(typeof result.endDate === "string");
});
