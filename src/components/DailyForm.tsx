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
      <h2 className="text-xl font-semibold text-slate-900">Saisie de la journée</h2>
      <p className="mt-2 text-base text-slate-700">
        Une seule petite fiche par jour. Vous pouvez modifier une journée déjà
        saisie en ré-enregistrant avec de nouvelles valeurs.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="date" className="text-base font-medium text-slate-800">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-base shadow-sm outline-none ring-0 transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="seen" className="text-base font-medium text-slate-800">
              Patientes venues
            </label>
            <input
              id="seen"
              type="number"
              min={0}
              className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-base shadow-sm outline-none ring-0 transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              value={seen}
              onChange={(e) =>
                onSeenChange(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="noShow"
              className="text-base font-medium text-slate-800"
            >
              Patientes absentes (no-show)
            </label>
            <input
              id="noShow"
              type="number"
              min={0}
              className="w-full rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-base shadow-sm outline-none ring-0 transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
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
          <p className="text-base font-medium text-rose-600" aria-live="polite">
            {error}
          </p>
        )}
        {success && (
          <p className="text-base font-medium text-emerald-600" aria-live="polite">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-rose-300"
        >
          {saving ? "Enregistrement..." : "Enregistrer la journée"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Astuce : si vous vous trompez, il suffit de ressaisir la même date avec
        les bons chiffres, la journée sera mise à jour.
      </p>
    </>
  );
}
