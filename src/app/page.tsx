/* Page principale : saisie simple + statistiques pour sage-femme */
"use client";

import { DailyAndWeeklyTables } from "@/components/DailyAndWeeklyTables";
import { DailyForm } from "@/components/DailyForm";
import { SummaryPanel } from "@/components/SummaryPanel";
import { TrendChart } from "@/components/TrendChart";
import { WeeklyAndWeekdayCharts } from "@/components/WeeklyAndWeekdayCharts";
import type { DailyEntry, DailyWithStats, Period, RollingPoint, Stats, WeeklyWithStats } from "@/lib/types";
import { getISOWeek } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [seen, setSeen] = useState<number | "">("");
  const [noShow, setNoShow] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("60");
  const [activeTab, setActiveTab] = useState<"saisie" | "stats">("saisie");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/daily");
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const data: DailyEntry[] = await res.json();
        setEntries(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Erreur inconnue lors du chargement";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredEntries = useMemo(() => {
    if (period === "all") return entries;
    const days = parseInt(period, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return entries.filter((e) => new Date(e.date) >= cutoff);
  }, [entries, period]);

  const stats = useMemo<Stats | null>(() => {
    if (!filteredEntries.length) {
      return null;
    }

    const daily: DailyWithStats[] = filteredEntries.map((e) => {
      const total = e.seenCount + e.noShowCount;
      const rate = total === 0 ? 0 : (e.seenCount / total) * 100;
      const noShowRate = total === 0 ? 0 : (e.noShowCount / total) * 100;
      return { ...e, total, rate, noShowRate };
    });

    const totalSeen = daily.reduce((acc, d) => acc + d.seenCount, 0);
    const totalNoShow = daily.reduce((acc, d) => acc + d.noShowCount, 0);
    const totalPatients = totalSeen + totalNoShow;
    const globalRate = totalPatients === 0 ? 0 : (totalSeen / totalPatients) * 100;
    const globalNoShowRate =
      totalPatients === 0 ? 0 : (totalNoShow / totalPatients) * 100;

    const daysCount = daily.length;
    const avgSeenPerDay = daysCount ? totalSeen / daysCount : 0;
    const avgNoShowPerDay = daysCount ? totalNoShow / daysCount : 0;

    const daysWithoutNoShow = daily.filter((d) => d.noShowCount === 0).length;

    // Regroupement hebdomadaire (ISO semaine)
    const weekMap = new Map<string, WeeklyWithStats>();

    for (const d of daily) {
      const dateObj = new Date(d.date);
      const { year, week } = getISOWeek(dateObj);
      const key = `${year}-W${week}`;
      const existing = weekMap.get(key);
      const totalSeenW = (existing?.totalSeen ?? 0) + d.seenCount;
      const totalNoShowW = (existing?.totalNoShow ?? 0) + d.noShowCount;

      const firstDate = existing
        ? existing.firstDate < d.date
          ? existing.firstDate
          : d.date
        : d.date;
      const lastDate = existing
        ? existing.lastDate > d.date
          ? existing.lastDate
          : d.date
        : d.date;

      weekMap.set(key, {
        key,
        year,
        week,
        totalSeen: totalSeenW,
        totalNoShow: totalNoShowW,
        firstDate,
        lastDate,
        total: 0,
        rate: 0,
        noShowRate: 0,
      });
    }

    const weekly: WeeklyWithStats[] = Array.from(weekMap.values())
      .sort((a, b) =>
        a.year === b.year ? a.week - b.week : a.year - b.year
      )
      .map((w) => {
        const total = w.totalSeen + w.totalNoShow;
        const rate = total === 0 ? 0 : (w.totalSeen / total) * 100;
        const noShowRate = total === 0 ? 0 : (w.totalNoShow / total) * 100;
        return { ...w, total, rate, noShowRate };
      });

    const bestWeek = weekly.reduce<WeeklyWithStats | undefined>(
      (best, w) => (w.rate > (best?.rate ?? -1) ? w : best),
      undefined
    );
    const worstWeek = weekly.reduce<WeeklyWithStats | undefined>(
      (worst, w) => (w.noShowRate > (worst?.noShowRate ?? -1) ? w : worst),
      undefined
    );

    // Moyenne glissante sur 7 jours (optionnelle)
    const rolling7Days: RollingPoint[] = daily.map((d, index) => {
      const slice = daily.slice(Math.max(0, index - 6), index + 1);
      const s = slice.reduce((acc, x) => acc + x.seenCount, 0);
      const n = slice.reduce((acc, x) => acc + x.noShowCount, 0);
      const tot = s + n;
      const rate = tot === 0 ? 0 : (s / tot) * 100;
      return {
        date: d.date,
        rate,
      };
    });

    return {
      daily,
      weekly,
      totalSeen,
      totalNoShow,
      totalPatients,
      globalRate,
      globalNoShowRate,
      avgSeenPerDay,
      avgNoShowPerDay,
      daysWithoutNoShow,
      bestWeek,
      worstWeek,
      rolling7Days,
    };
  }, [filteredEntries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const seenValue = Number(seen || 0);
    const noShowValue = Number(noShow || 0);

    if (!date) {
      setError("Merci de choisir une date.");
      return;
    }
    if (seenValue < 0 || noShowValue < 0) {
      setError("Les nombres ne peuvent pas être négatifs.");
      return;
    }
    if (seenValue + noShowValue === 0) {
      setError("Il doit y avoir au moins 1 patiente (vue ou absente).");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          seenCount: seenValue,
          noShowCount: noShowValue,
        }),
      });
      const json = (await res.json()) as DailyEntry | { error?: string };
      if (!res.ok) {
        const message =
          typeof json === "object" && "error" in json && json.error
            ? json.error
            : "Erreur lors de l’enregistrement";
        throw new Error(message);
      }
      const data = json as DailyEntry;
      setSuccess("Journée enregistrée avec succès.");

      // Mettre à jour la liste locale (upsert)
      setEntries((prev: DailyEntry[]) => {
        const existingIndex = prev.findIndex((p) => p.date === data.date);
        if (existingIndex === -1) {
          return [...prev, data].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
        const copy = [...prev];
        copy[existingIndex] = data;
        return copy.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Erreur inconnue lors de l’enregistrement";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Suivi des patientes – Cabinet de sage-femme
            </h1>
            <p className="mt-2 text-base text-slate-700">
              Enregistrez chaque jour le nombre de patientes vues et absentes, et
              visualisez vos statistiques en un clin d’œil.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 sm:mt-0">
            <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">
              Simple, rapide, pensé pour la pratique quotidienne
            </span>
          </div>
        </header>

        {/* Tabs de navigation */}
        <nav className="mt-4 inline-flex rounded-full bg-white/70 p-1.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200/70">
          <button
            type="button"
            onClick={() => setActiveTab("saisie")}
            className={`rounded-full px-6 py-2 ${
              activeTab === "saisie"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : ""
            }`}
          >
            Saisie
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={`rounded-full px-6 py-2 ${
              activeTab === "stats"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : ""
            }`}
          >
            Statistiques
          </button>
        </nav>

        {activeTab === "saisie" && (
          <section className="mt-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <DailyForm
              date={date}
              seen={seen}
              noShow={noShow}
              saving={saving}
              error={error}
              success={success}
              onDateChange={setDate}
              onSeenChange={setSeen}
              onNoShowChange={setNoShow}
              onSubmit={handleSubmit}
            />
          </section>
        )}

        {activeTab === "stats" && (
          <>
            {/* Graphique d'évolution - en pleine largeur pour bien voir la tendance */}
            <section className="mt-4">
              <TrendChart stats={stats} />
            </section>

            {/* Section des moyennes - mise en avant pour identifier les jours les plus remplis */}
            <section className="mt-6">
              <WeeklyAndWeekdayCharts stats={stats} />
            </section>

            {/* Synthèse rapide */}
            <main className="mt-6">
              <SummaryPanel
                stats={stats}
                loading={loading}
                period={period}
                onPeriodChange={setPeriod}
              />
            </main>

            <section className="mt-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
              <DailyAndWeeklyTables
                stats={stats}
                filteredCount={filteredEntries.length}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
