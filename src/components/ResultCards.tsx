import { formatCurrency, formatPercent } from "@/lib/format";
import type { SimulationResult } from "@/types/simulator";

type ResultCardsProps = {
  result: SimulationResult;
};

export function ResultCards({ result }: ResultCardsProps) {
  const positiveGain = result.estimatedGain >= 0;

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-[#0f6b4f]/20 bg-[#0f6b4f] p-5 text-white shadow-sm">
        <p className="text-sm font-medium text-white/75">Valeur finale estimée</p>
        <p className="mt-2 text-3xl font-semibold">{formatCurrency(result.finalValue)}</p>
        <p className="mt-2 text-sm text-white/75">Projection pour {result.cryptoLabel}</p>
      </div>

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
        <MetricCard label="Frais estimes" value={formatCurrency(result.totalFeesPaid)} />
      </div>

      <div className="rounded-lg border border-[#d9cfbf] bg-[#fffdf8] p-5">
        <h3 className="text-base font-semibold text-[#17211b]">Détail des apports</h3>
        <dl className="mt-4 grid gap-3 text-sm">
          <Row label="Investissement initial" value={formatCurrency(result.totalInitialInvestment)} />
          <Row
            label="Versements mensuels cumules"
            value={formatCurrency(result.totalMonthlyContributions)}
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
    <article className="rounded-lg border border-[#d9cfbf] bg-[#fffdf8] p-4 shadow-sm">
      <p className="text-sm text-[#647067]">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</p>
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
