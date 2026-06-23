import assert from "node:assert/strict";
import test from "node:test";
import { calculateCryptoSimulation } from "./crypto-simulation.ts";
import type { SimulationInput } from "@/types/simulator";

const baseInput: SimulationInput = {
  crypto: "bitcoin",
  initialInvestment: 1000,
  monthlyContribution: 100,
  durationMonths: 12,
  annualReturnRate: 0,
  entryFeeRate: 0,
  annualFeeRate: 0,
};

test("rendement nul sans frais: valeur finale egale au capital investi", () => {
  const result = calculateCryptoSimulation(baseInput);
  assert.equal(result.totalInvested, 2200);
  assert.equal(result.finalValue, 2200);
  assert.equal(result.estimatedGain, 0);
});

test("versement mensuel nul", () => {
  const result = calculateCryptoSimulation({ ...baseInput, monthlyContribution: 0 });
  assert.equal(result.totalMonthlyContributions, 0);
  assert.equal(result.totalInvested, 1000);
});

test("investissement initial nul", () => {
  const result = calculateCryptoSimulation({ ...baseInput, initialInvestment: 0 });
  assert.equal(result.totalInitialInvestment, 0);
  assert.equal(result.totalInvested, 1200);
});

test("duree minimale normalisee", () => {
  const result = calculateCryptoSimulation({ ...baseInput, durationMonths: 0 });
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
    monthlyContribution: 0,
    annualReturnRate: 10,
  });

  assert.equal(result.totalInvested, 1000);
  assert.ok(result.finalValue > result.totalInvested);
});

test("DCA seul sans investissement initial", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    initialInvestment: 0,
    monthlyContribution: 200,
    durationMonths: 6,
  });

  assert.equal(result.totalInitialInvestment, 0);
  assert.equal(result.totalMonthlyContributions, 1200);
  assert.equal(result.totalInvested, 1200);
});

test("investissement initial et DCA combines", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    initialInvestment: 2500,
    monthlyContribution: 150,
    durationMonths: 24,
    annualReturnRate: 8,
  });

  assert.equal(result.totalInvested, 6100);
  assert.equal(result.projection.length, 25);
  assert.ok(result.finalValue > result.totalInvested);
});

test("duree courte et duree longue produisent des projections coherentes", () => {
  const shortResult = calculateCryptoSimulation({ ...baseInput, durationMonths: 1 });
  const longResult = calculateCryptoSimulation({ ...baseInput, durationMonths: 360 });

  assert.equal(shortResult.projection.length, 2);
  assert.equal(longResult.projection.length, 361);
  assert.ok(longResult.totalInvested > shortResult.totalInvested);
});

test("valeurs incoherentes normalisees", () => {
  const result = calculateCryptoSimulation({
    ...baseInput,
    initialInvestment: -1000,
    monthlyContribution: -250,
    durationMonths: -24,
    annualReturnRate: 500,
    entryFeeRate: -3,
    annualFeeRate: -2,
  });

  assert.equal(result.totalInitialInvestment, 0);
  assert.equal(result.totalMonthlyContributions, 0);
  assert.equal(result.totalInvested, 0);
  assert.equal(result.projection.length, 2);
});
