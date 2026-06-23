import { formatCurrency, formatPercent } from "@/lib/format";
import type { SimulationResult } from "@/types/simulator";

type ResultCardsProps = {
  result: SimulationResult;
};

export function ResultCards({ result }: ResultCardsProps) {
  const positiveGain = result.estimatedGain >= 0;

  return (
    <section className="grid gap-4">
      {/* Hero result card */}
      <div className="rounded-xl border border-[#0f6b4f]/20 bg-gradient-to-br from-[#0f6b4f] to-[#0a5640] p-6 text-white shadow-md">
        <p className="text-sm font-medium tracking-wide text-white/70">Valeur finale estimée</p>
        <p className="mt-2 text-4xl font-bold tracking-tight">{formatCurrency(result.finalValue)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
          <span>Projection pour {result.cryptoLabel}</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>{result.strategyLabel}</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>{result.frequencyLabel}</span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Capital total investi" value={formatCurrency(result.totalInvested)} />
        <MetricCard
          label="Plus-value estimée"
          value={formatCurrency(result.estimatedGain)}
          tone={positiveGain ? "positive" : "negative"}
        />
        <MetricCard
          label="Rendement total"
          value={formatPercent(result.totalReturnRate)}
          tone={positiveGain ? "positive" : "negative"}
        />
        <MetricCard label="Frais estimés" value={formatCurrency(result.totalFeesPaid)} />
      </div>

      {/* Details breakdown */}
      <div className="rounded-xl border border-[#d9cfbf] bg-[#fffdf8] p-5 shadow-sm">
        <h3 className="text-base font-semibold text-[#17211b]">Détail des apports</h3>
        <dl className="mt-4 grid gap-3 text-sm">
          <Row label="Investissement initial" value={formatCurrency(result.totalInitialInvestment)} />
          <Row
            label="Versements périodiques cumulés"
            value={formatCurrency(result.totalPeriodicContributions)}
          />
          <Row label="Capital initial net de frais" value={formatCurrency(result.initialNetInvestment)} />
        </dl>
      </div>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
};

function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  const toneClass =
    tone === "positive"
      ? "text-[#0f6b4f]"
      : tone === "negative"
        ? "text-[#a23b35]"
        : "text-[#17211b]";

  return (
    <article className="rounded-xl border border-[#d9cfbf] bg-[#fffdf8] p-5 shadow-sm transition hover:shadow-md">
      <p className="text-sm text-[#647067]">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eee4d6] pb-3 last:border-0 last:pb-0">
      <dt className="text-[#647067]">{label}</dt>
      <dd className="text-right font-semibold text-[#17211b]">{value}</dd>
    </div>
  );
}
