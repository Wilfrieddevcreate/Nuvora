function Bone({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-surface-2 ${className ?? ""}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Cover */}
      <Bone className="aspect-16/10 rounded-none" />
      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        <Bone className="h-3 w-20" />
        <Bone className="h-5 w-full" />
        <Bone className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Bone className="h-6 w-16" />
          <Bone className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Barre */}
      <Bone className="h-12 w-full rounded-full" />
      {/* Filtres */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
