"use client";

import type { Stats } from "@/lib/types";

type TrendChartProps = {
  stats: Stats | null;
};

export function TrendChart({ stats }: TrendChartProps) {
  if (!stats || stats.rolling7Days.length <= 1) {
    return (
      <section className="rounded-2xl bg-white/60 p-5 text-sm text-slate-500 ring-1 ring-dashed ring-slate-200">
        Pas encore assez de données pour afficher une tendance (7 jours
        glissants).
      </section>
    );
  }

  const pts = stats.rolling7Days;
  const max = 100;
  const min = 0;
  const range = max - min || 1;

  return (
    <section className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
      <p className="text-xs font-medium text-slate-700">
        Tendance (présence, moyenne glissante 7 jours)
      </p>
      <div className="mt-3 h-24 w-full rounded-lg bg-slate-50 px-2 py-2">
        <svg className="h-full w-full" viewBox="0 0 100 40">
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="1.5"
            points={pts
              .map((p, i) => {
                const x = (i / Math.max(pts.length - 1, 1)) * 100;
                const norm = (p.rate - min) / range;
                const y = 40 - norm * 30 - 5;
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {pts.map((p, i) => {
            const x = (i / Math.max(pts.length - 1, 1)) * 100;
            const norm = (p.rate - min) / range;
            const y = 40 - norm * 30 - 5;
            return <circle key={p.date} cx={x} cy={y} r={0.8} fill="#4f46e5" />;
          })}
        </svg>
      </div>
    </section>
  );
}
