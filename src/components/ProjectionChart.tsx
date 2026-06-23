import { formatCurrency } from "@/lib/format";
import type { ProjectionPoint } from "@/types/simulator";

type ProjectionChartProps = {
  points: ProjectionPoint[];
};

const chartWidth = 720;
const chartHeight = 280;
const padding = 28;

export function ProjectionChart({ points }: ProjectionChartProps) {
  const maxValue = Math.max(
    ...points.map((point) => Math.max(point.investedCapital, point.estimatedValue)),
    1,
  );
  const lastPoint = points[points.length - 1];

  const toX = (index: number) => {
    if (points.length <= 1) return padding;
    return padding + (index / (points.length - 1)) * (chartWidth - padding * 2);
  };

  const toY = (value: number) =>
    chartHeight - padding - (value / maxValue) * (chartHeight - padding * 2);

  const linePath = (selector: (point: ProjectionPoint) => number) =>
    points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${toX(index).toFixed(2)} ${toY(selector(point)).toFixed(2)}`)
      .join(" ");

  return (
    <section className="rounded-lg border border-[#d9cfbf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#17211b]">Projection</h2>
          <p className="mt-1 text-sm text-[#647067]">
             Évolution estimée face au capital versé.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 text-[#0f6b4f]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0f6b4f]" />
            Valeur estimée
          </span>
          <span className="inline-flex items-center gap-2 text-[#936f2b]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c49a4a]" />
            Capital investi
          </span>
        </div>
      </div>

      <div className="mt-5">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Graphique de projection du capital investi et de la valeur estimée"
          className="h-56 w-full sm:h-64"
        >
          <rect x="0" y="0" width={chartWidth} height={chartHeight} rx="8" fill="#fbf7ef" />
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              x2={chartWidth - padding}
              y1={padding + ratio * (chartHeight - padding * 2)}
              y2={padding + ratio * (chartHeight - padding * 2)}
              stroke="#e5dac8"
              strokeDasharray="4 6"
            />
          ))}
          <path
            d={linePath((point) => point.investedCapital)}
            fill="none"
            stroke="#c49a4a"
            strokeWidth="3"
          />
          <path
            d={linePath((point) => point.estimatedValue)}
            fill="none"
            stroke="#0f6b4f"
            strokeWidth="4"
          />
          <circle
            cx={toX(points.length - 1)}
            cy={toY(lastPoint.estimatedValue)}
            r="5"
            fill="#0f6b4f"
            stroke="#fffdf8"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <ChartStat label="Depart" value={formatCurrency(points[0]?.estimatedValue ?? 0)} />
        <ChartStat label="Capital versé" value={formatCurrency(lastPoint?.investedCapital ?? 0)} />
        <ChartStat label="Valeur estimée" value={formatCurrency(lastPoint?.estimatedValue ?? 0)} />
      </div>
    </section>
  );
}

function ChartStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#eadfcc] bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#777064]">{label}</p>
      <p className="mt-1 font-semibold text-[#17211b]">{value}</p>
    </div>
  );
}
