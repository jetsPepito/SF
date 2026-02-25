"use client";

type DailyFormProps = {
  date: string;
  seen: number | "";
  noShow: number | "";
  saving: boolean;
  error: string | null;
  success: string | null;
  onDateChange: (value: string) => void;
  onSeenChange: (value: number | "") => void;
  onNoShowChange: (value: number | "") => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function DailyForm({
  date,
  seen,
  noShow,
  saving,
  error,
  success,
  onDateChange,
  onSeenChange,
  onNoShowChange,
  onSubmit,
}: DailyFormProps) {
  return (
    <>
      <h2 className="text-lg font-medium text-slate-900">Saisie de la journée</h2>
      <p className="mt-1 text-sm text-slate-600">
        Une seule petite fiche par jour. Vous pouvez modifier une journée déjà
        saisie en ré-enregistrant avec de nouvelles valeurs.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium text-slate-800">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="seen" className="text-sm font-medium text-slate-800">
              Patientes venues
            </label>
            <input
              id="seen"
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              value={seen}
              onChange={(e) =>
                onSeenChange(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="noShow"
              className="text-sm font-medium text-slate-800"
            >
              Patientes absentes (no-show)
            </label>
            <input
              id="noShow"
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              value={noShow}
              onChange={(e) =>
                onNoShowChange(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-rose-600" aria-live="polite">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm font-medium text-emerald-600" aria-live="polite">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {saving ? "Enregistrement..." : "Enregistrer la journée"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Astuce : si vous vous trompez, il suffit de ressaisir la même date avec
        les bons chiffres, la journée sera mise à jour.
      </p>
    </>
  );
}
