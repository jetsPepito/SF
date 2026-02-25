"use client";

import type { Stats } from "@/lib/types";
import { formatDateLabel } from "@/lib/utils";

type DailyAndWeeklyTablesProps = {
  stats: Stats | null;
  filteredCount: number;
};

export function DailyAndWeeklyTables({ stats, filteredCount }: DailyAndWeeklyTablesProps) {
  if (!stats || !stats.daily.length) {
    return (
      <p className="text-sm text-slate-500">
        Pas encore de statistiques à afficher. Enregistrez quelques journées
        pour voir le détail.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-900">
            Détail jour par jour
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Vue détaillée des patientes venues / absentes et des taux par
            journée.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {filteredCount} jour(s) affiché(s)
        </p>
      </div>

      <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-slate-100">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium text-right">Venues</th>
              <th className="px-3 py-2 font-medium text-right">Absentes</th>
              <th className="px-3 py-2 font-medium text-right">Total</th>
              <th className="px-3 py-2 font-medium text-right">% présence</th>
              <th className="px-3 py-2 font-medium text-right">% no-show</th>
            </tr>
          </thead>
          <tbody>
            {stats.daily.map((d) => (
              <tr
                key={d.id}
                className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60"
              >
                <td className="px-3 py-2">
                  <span className="whitespace-nowrap text-[11px] font-medium text-slate-800">
                    {formatDateLabel(d.date)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-[11px] text-emerald-800">
                  {d.seenCount}
                </td>
                <td className="px-3 py-2 text-right text-[11px] text-rose-800">
                  {d.noShowCount}
                </td>
                <td className="px-3 py-2 text-right text-[11px] text-slate-800">
                  {d.total}
                </td>
                <td className="px-3 py-2 text-right text-[11px] text-slate-800">
                  {d.rate.toFixed(1)}%
                </td>
                <td className="px-3 py-2 text-right text-[11px] text-slate-800">
                  {d.noShowRate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stats.weekly.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-900">Vue hebdomadaire</h3>
          <p className="mt-1 text-xs text-slate-600">
            Regroupe les journées par semaine (ISO).
          </p>
          <div className="mt-3 max-h-64 overflow-auto rounded-xl border border-slate-100">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Semaine</th>
                  <th className="px-3 py-2 font-medium text-right">Venues</th>
                  <th className="px-3 py-2 font-medium text-right">Absentes</th>
                  <th className="px-3 py-2 font-medium text-right">Total</th>
                  <th className="px-3 py-2 font-medium text-right">% présence</th>
                  <th className="px-3 py-2 font-medium text-right">% no-show</th>
                </tr>
              </thead>
              <tbody>
                {stats.weekly.map((w) => (
                  <tr
                    key={w.key}
                    className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60"
                  >
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-800">
                          Semaine {w.week} – {w.year}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          du {formatDateLabel(w.firstDate)} au{" "}
                          {formatDateLabel(w.lastDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-[11px] text-emerald-800">
                      {w.totalSeen}
                    </td>
                    <td className="px-3 py-2 text-right text-[11px] text-rose-800">
                      {w.totalNoShow}
                    </td>
                    <td className="px-3 py-2 text-right text-[11px] text-slate-800">
                      {w.total}
                    </td>
                    <td className="px-3 py-2 text-right text-[11px] text-slate-800">
                      {w.rate.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right text-[11px] text-slate-800">
                      {w.noShowRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
