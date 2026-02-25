"use client";

import type { Stats } from "@/lib/types";

type TrendChartProps = {
  stats: Stats | null;
};

export function TrendChart({ stats }: TrendChartProps) {
  if (!stats || !stats.weekly.length) {
    return (
      <section className="rounded-2xl bg-white/90 p-5 text-base text-slate-500 ring-1 ring-dashed ring-slate-200">
        Pas encore assez de données pour afficher le graphique.
      </section>
    );
  }

  // Calculer le nombre de patientes venues (sans les absentes) semaine par semaine
  const weeklyTotals = stats.weekly.map((w) => ({
    label: `S${w.week}-${String(w.year).slice(-2)}`,
    total: w.totalSeen,
  }));

  const maxTotal = Math.max(...weeklyTotals.map((d) => d.total), 0);
  const minTotal = Math.min(...weeklyTotals.map((d) => d.total), 0);
  const range = maxTotal - minTotal || 1;

  return (
    <section className="rounded-3xl bg-white/95 p-6 shadow-lg ring-2 ring-rose-200/50">
      <div className="mb-2">
        <h3 className="text-xl font-semibold text-slate-900">
          Évolution hebdomadaire du nombre de patientes
        </h3>
        <p className="mt-1 text-base text-slate-600">
          Nombre de patientes venues semaine par semaine.
        </p>
      </div>
      <div className="mt-4 h-48 w-full rounded-lg bg-rose-50 px-3 py-3">
        <svg className="h-full w-full" viewBox="0 0 100 60">
          {/* Axes */}
          <line x1="8" y1="5" x2="8" y2="50" stroke="#94a3b8" strokeWidth="0.5" />
          <line x1="8" y1="50" x2="98" y2="50" stroke="#94a3b8" strokeWidth="0.5" />

          {/* Lignes horizontales (graduations Y) */}
          {[0, 0.5, 1].map((t) => {
            const y = 50 - t * 35;
            const value = minTotal + t * (maxTotal - minTotal);
            return (
              <g key={t}>
                <line
                  x1="8"
                  y1={y}
                  x2="98"
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="0.3"
                  strokeDasharray="2 2"
                />
                <text
                  x="4"
                  y={y + 1.5}
                  fontSize="3"
                  textAnchor="end"
                  fill="#64748b"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* Courbe hebdo */}
          <polyline
            fill="none"
            stroke="#f97373"
            strokeWidth="1.6"
            points={weeklyTotals
              .map((d, i) => {
                const x = 8 + (i / Math.max(weeklyTotals.length - 1, 1)) * 90;
                const norm = (d.total - minTotal) / range;
                const y = 50 - norm * 35;
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {weeklyTotals.map((d, i) => {
            const x = 8 + (i / Math.max(weeklyTotals.length - 1, 1)) * 90;
            const norm = (d.total - minTotal) / range;
            const y = 50 - norm * 35;
            return <circle key={d.label} cx={x} cy={y} r={1.4} fill="#f97373" />;
          })}

          {/* Labels X (semaines) */}
          {weeklyTotals.map((d, i) => {
            const x = 8 + (i / Math.max(weeklyTotals.length - 1, 1)) * 90;
            return (
              <text
                key={d.label}
                x={x}
                y={56}
                fontSize="3"
                textAnchor="middle"
                fill="#64748b"
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
