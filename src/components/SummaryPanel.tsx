"use client";

import type { Period, Stats } from "@/lib/types";
import { formatDateLabel } from "@/lib/utils";

type SummaryPanelProps = {
  stats: Stats | null;
  loading: boolean;
  period: Period;
  onPeriodChange: (p: Period) => void;
};

export function SummaryPanel({ stats, loading, period, onPeriodChange }: SummaryPanelProps) {
  return (
    <section className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-slate-900">Synthèse rapide</h2>
        <div className="flex items-center gap-1 rounded-full bg-slate-100 px-1 py-1 text-xs text-slate-700">
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              period === "30" ? "bg-white shadow-sm ring-1 ring-slate-200" : ""
            }`}
            onClick={() => onPeriodChange("30")}
          >
            30 j
          </button>
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              period === "60" ? "bg-white shadow-sm ring-1 ring-slate-200" : ""
            }`}
            onClick={() => onPeriodChange("60")}
          >
            60 j
          </button>
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              period === "all" ? "bg-white shadow-sm ring-1 ring-slate-200" : ""
            }`}
            onClick={() => onPeriodChange("all")}
          >
            Tout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">
          Chargement des données...
        </p>
      ) : !stats ? (
        <p className="mt-4 text-sm text-slate-500">
          Aucune donnée pour l’instant. Commencez par enregistrer une première
          journée.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-indigo-50 px-3 py-3">
              <p className="text-xs font-medium text-indigo-700">
                Taux de présence
              </p>
              <p className="mt-1 text-2xl font-semibold text-indigo-900">
                {stats.globalRate.toFixed(1)}%
              </p>
              <p className="mt-1 text-[11px] text-indigo-800/80">
                sur {stats.totalPatients} patientes
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 px-3 py-3">
              <p className="text-xs font-medium text-rose-700">Taux de no-show</p>
              <p className="mt-1 text-2xl font-semibold text-rose-900">
                {stats.globalNoShowRate.toFixed(1)}%
              </p>
              <p className="mt-1 text-[11px] text-rose-800/80">
                {stats.totalNoShow} absences
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-3">
              <p className="text-xs font-medium text-emerald-700">
                Jours sans absence
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-900">
                {stats.daysWithoutNoShow}
              </p>
              <p className="mt-1 text-[11px] text-emerald-800/80">
                sur {stats.daily.length} jours suivis
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
              <p className="text-xs font-medium text-slate-700">
                Moyenne / jour (venues)
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {stats.avgSeenPerDay.toFixed(1)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
              <p className="text-xs font-medium text-slate-700">
                Moyenne / jour (absentes)
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {stats.avgNoShowPerDay.toFixed(1)}
              </p>
            </div>
          </div>

          {stats.bestWeek && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-3">
                <p className="text-xs font-medium text-emerald-700">
                  Meilleure semaine (présence)
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">
                  {stats.bestWeek.rate.toFixed(1)}%
                </p>
                <p className="mt-1 text-[11px] text-emerald-800/80">
                  Semaine {stats.bestWeek.week} – du{" "}
                  {formatDateLabel(stats.bestWeek.firstDate)} au{" "}
                  {formatDateLabel(stats.bestWeek.lastDate)}
                </p>
              </div>
              {stats.worstWeek && (
                <div className="rounded-xl border border-rose-100 bg-rose-50/80 px-3 py-3">
                  <p className="text-xs font-medium text-rose-700">
                    Semaine avec plus d’absences
                  </p>
                  <p className="mt-1 text-lg font-semibold text-rose-900">
                    {stats.worstWeek.noShowRate.toFixed(1)}% de no-show
                  </p>
                  <p className="mt-1 text-[11px] text-rose-800/80">
                    Semaine {stats.worstWeek.week} – du{" "}
                    {formatDateLabel(stats.worstWeek.firstDate)} au{" "}
                    {formatDateLabel(stats.worstWeek.lastDate)}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
