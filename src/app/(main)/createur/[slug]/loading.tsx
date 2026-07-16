export default function CreateurLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Fil d'ariane skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-1 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-28 animate-pulse rounded bg-surface-2" />
      </div>

      {/* En-tête créateur */}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
        {/* Bandeau couleur */}
        <div className="h-24 animate-pulse bg-surface-2 sm:h-32" />

        <div className="px-6 pb-8 sm:px-8">
          {/* Avatar + badges */}
          <div className="flex flex-wrap items-end gap-4 -mt-8 sm:-mt-10">
            <div className="size-16 animate-pulse rounded-2xl bg-surface-2 ring-4 ring-surface sm:size-20" />
            <div className="mb-1 flex flex-wrap gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-surface-2" />
              <div className="h-6 w-28 animate-pulse rounded-full bg-surface-2" />
              <div className="h-6 w-32 animate-pulse rounded-full bg-surface-2" />
            </div>
          </div>

          {/* Nom + tagline + bio */}
          <div className="mt-5 space-y-3">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-5 w-64 animate-pulse rounded bg-surface-2" />
            <div className="space-y-2 pt-1">
              <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-surface-2" />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-8 border-t border-border pt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-6 w-12 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section produits */}
      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-4 w-32 animate-pulse rounded bg-surface-2" />
          </div>
          <div className="h-4 w-36 animate-pulse rounded bg-surface-2" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="aspect-4/3 animate-pulse rounded-xl bg-surface-2" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-5 w-16 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-12 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA rejoindre */}
      <div className="mt-14 rounded-3xl border border-border bg-surface-2/60 px-8 py-10 text-center">
        <div className="mx-auto space-y-3">
          <div className="mx-auto h-6 w-40 animate-pulse rounded-lg bg-surface-2" />
          <div className="mx-auto h-4 w-72 animate-pulse rounded bg-surface-2" />
          <div className="mx-auto mt-4 h-10 w-36 animate-pulse rounded-full bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
