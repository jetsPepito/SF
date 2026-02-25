"use client";

import type { Stats } from "@/lib/types";
import { getISOWeek } from "@/lib/utils";

type WeeklyAndWeekdayChartsProps = {
  stats: Stats | null;
};

type WeeklyAvg = {
  key: string;
  label: string;
  avgSeen: number;
};

type WeekdayAvg = {
  index: number;
  label: string;
  avgSeen: number;
};

export function WeeklyAndWeekdayCharts({ stats }: WeeklyAndWeekdayChartsProps) {
  if (!stats || !stats.daily.length) {
    return (
      <section className="rounded-2xl bg-white/60 p-5 text-sm text-slate-500 ring-1 ring-dashed ring-slate-200">
        Pas encore assez de données pour calculer les moyennes.
      </section>
    );
  }

  const weeklyMap = new Map<string, { label: string; totalSeen: number; days: number }>();

  for (const d of stats.daily) {
    const dateObj = new Date(d.date);
    const { year, week } = getISOWeek(dateObj);
    const key = `${year}-W${week}`;
    const existing = weeklyMap.get(key);
    const label = `S${week} – ${year}`;
    weeklyMap.set(key, {
      label,
      totalSeen: (existing?.totalSeen ?? 0) + d.seenCount,
      days: (existing?.days ?? 0) + 1,
    });
  }

  const weekly: WeeklyAvg[] = Array.from(weeklyMap.entries())
    .map(([key, value]) => ({
      key,
      label: value.label,
      avgSeen: value.days ? value.totalSeen / value.days : 0,
    }))
    .sort((a, b) => (a.key > b.key ? 1 : -1));

  const weekdayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
  const weekdayBuckets = new Array(5).fill(null).map(() => ({
    totalSeen: 0,
    days: 0,
  }));

  for (const d of stats.daily) {
    const dateObj = new Date(d.date);
    const jsDay = dateObj.getDay(); // 0 = dimanche
    const index = (jsDay + 6) % 7; // 0 = lundi, ... 6 = dimanche
    // Ne garder que Lun-Ven (index 0-4)
    if (index < 5) {
      weekdayBuckets[index].totalSeen += d.seenCount;
      weekdayBuckets[index].days += 1;
    }
  }

  const weekday: WeekdayAvg[] = weekdayBuckets.map((bucket, index) => ({
    index,
    label: weekdayNames[index],
    avgSeen: bucket.days ? bucket.totalSeen / bucket.days : 0,
  }));

  const maxWeekly = Math.max(...weekly.map((w) => w.avgSeen), 0);
  const maxWeekday = Math.max(...weekday.map((w) => w.avgSeen), 0);

  return (
    <section className="space-y-6 rounded-3xl bg-white/95 p-8 shadow-lg ring-2 ring-rose-200/50">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">
          Moyenne de patientes par semaine
        </h3>
        <p className="mt-2 text-base text-slate-600">
          Moyenne de patientes venues par semaine (sur la période affichée).
        </p>
        <div className="mt-4 space-y-3">
          {weekly.map((w) => (
            <div key={w.key} className="flex items-center gap-4">
              <div className="w-28 text-base font-medium text-slate-800">{w.label}</div>
              <div className="flex-1 h-4 rounded-full bg-rose-100">
                <div
                  className="h-4 rounded-full bg-rose-400"
                  style={{
                    width: `${maxWeekly ? (w.avgSeen / maxWeekly) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="w-16 text-right text-base font-semibold text-slate-900">
                {w.avgSeen.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t-2 border-rose-100">
        <h3 className="text-xl font-semibold text-slate-900">
          Quels jours sont les plus remplis ?
        </h3>
        <p className="mt-2 text-base text-slate-600">
          Moyenne de patientes venues par jour de la semaine (Lundi à Vendredi)
        </p>
        <div className="mt-4 space-y-3">
          {weekday.map((d) => {
            const isMax = d.avgSeen === maxWeekday && maxWeekday > 0;
            return (
              <div
                key={d.index}
                className={`flex items-center gap-4 p-2 rounded-lg ${
                  isMax ? "bg-rose-50 ring-2 ring-rose-300" : ""
                }`}
              >
                <div className="w-16 text-base font-medium text-slate-800">
                  {d.label}
                  {isMax && (
                    <span className="ml-1 text-xs text-rose-600 font-semibold">★</span>
                  )}
                </div>
                <div className="flex-1 h-4 rounded-full bg-rose-100">
                  <div
                    className="h-4 rounded-full bg-emerald-400"
                    style={{
                      width: `${maxWeekday ? (d.avgSeen / maxWeekday) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="w-16 text-right text-base font-semibold text-slate-900">
                  {d.avgSeen.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

