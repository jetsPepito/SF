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

  const weekdayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const weekdayBuckets = new Array(7).fill(null).map(() => ({
    totalSeen: 0,
    days: 0,
  }));

  for (const d of stats.daily) {
    const dateObj = new Date(d.date);
    const jsDay = dateObj.getDay(); // 0 = dimanche
    const index = (jsDay + 6) % 7; // 0 = lundi, ... 6 = dimanche
    weekdayBuckets[index].totalSeen += d.seenCount;
    weekdayBuckets[index].days += 1;
  }

  const weekday: WeekdayAvg[] = weekdayBuckets.map((bucket, index) => ({
    index,
    label: weekdayNames[index],
    avgSeen: bucket.days ? bucket.totalSeen / bucket.days : 0,
  }));

  const maxWeekly = Math.max(...weekly.map((w) => w.avgSeen), 0);
  const maxWeekday = Math.max(...weekday.map((w) => w.avgSeen), 0);

  return (
    <section className="space-y-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
      <div>
        <h3 className="text-sm font-medium text-slate-900">
          Moyenne de patientes par semaine
        </h3>
        <p className="mt-1 text-xs text-slate-600">
          Moyenne de patientes venues par semaine (sur la période affichée).
        </p>
        <div className="mt-3 space-y-1.5">
          {weekly.map((w) => (
            <div key={w.key} className="flex items-center gap-2">
              <div className="w-24 text-[11px] text-slate-700">{w.label}</div>
              <div className="flex-1 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{
                    width: `${maxWeekly ? (w.avgSeen / maxWeekly) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="w-10 text-right text-[11px] text-slate-800">
                {w.avgSeen.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <h3 className="text-sm font-medium text-slate-900">
          Moyenne par jour de la semaine
        </h3>
        <p className="mt-1 text-xs text-slate-600">
          Pour voir quel jour est en moyenne le plus rempli (patientes venues).
        </p>
        <div className="mt-3 space-y-1.5">
          {weekday.map((d) => (
            <div key={d.index} className="flex items-center gap-2">
              <div className="w-10 text-[11px] text-slate-700">{d.label}</div>
              <div className="flex-1 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${maxWeekday ? (d.avgSeen / maxWeekday) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="w-10 text-right text-[11px] text-slate-800">
                {d.avgSeen.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

