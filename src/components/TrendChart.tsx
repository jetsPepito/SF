"use client";

import type { Stats } from "@/lib/types";

type TrendChartProps = {
  stats: Stats | null;
};

export function TrendChart({ stats }: TrendChartProps) {
  if (!stats || !stats.daily.length) {
    return (
      <section className="rounded-2xl bg-white/90 p-5 text-base text-slate-500 ring-1 ring-dashed ring-slate-200">
        Pas encore assez de données pour afficher le graphique.
      </section>
    );
  }

  // Calculer le nombre total de patientes (venues + absentes) jour après jour
  const dailyTotals = stats.daily.map((d) => ({
    date: d.date,
    total: d.seenCount + d.noShowCount,
  }));

  const maxTotal = Math.max(...dailyTotals.map((d) => d.total), 0);
  const minTotal = Math.min(...dailyTotals.map((d) => d.total), 0);
  const range = maxTotal - minTotal || 1;

  return (
    <section className="rounded-3xl bg-white/95 p-6 shadow-lg ring-2 ring-rose-200/50">
      <div className="mb-2">
        <h3 className="text-xl font-semibold text-slate-900">
          Évolution du nombre de patientes
        </h3>
        <p className="mt-1 text-base text-slate-600">
          Suivez l'évolution jour après jour du nombre total de patientes (venues + absentes)
        </p>
      </div>
      <div className="mt-4 h-40 w-full rounded-lg bg-amber-50 px-3 py-3">
        <svg className="h-full w-full" viewBox="0 0 100 50">
          <polyline
            fill="none"
            stroke="#f87171"
            strokeWidth="2"
            points={dailyTotals
              .map((d, i) => {
                const x = (i / Math.max(dailyTotals.length - 1, 1)) * 100;
                const norm = (d.total - minTotal) / range;
                const y = 50 - norm * 40 - 5;
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {dailyTotals.map((d, i) => {
            const x = (i / Math.max(dailyTotals.length - 1, 1)) * 100;
            const norm = (d.total - minTotal) / range;
            const y = 50 - norm * 40 - 5;
            return <circle key={d.date} cx={x} cy={y} r={1.2} fill="#f87171" />;
          })}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Min: {minTotal}</span>
        <span>Max: {maxTotal}</span>
      </div>
    </section>
  );
}
