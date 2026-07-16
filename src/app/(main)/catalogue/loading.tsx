import { ProductCardSkeleton } from "@/components/skeleton";

export default function CatalogueLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      {/* Titre skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-2" />
        <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-2" />
      </div>
      <div className="flex gap-6">
        {/* Sidebar filtres skeleton */}
        <aside className="hidden w-56 shrink-0 space-y-4 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-8 w-full animate-pulse rounded-lg bg-surface-2" />
              ))}
            </div>
          ))}
        </aside>
        {/* Grid */}
        <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
