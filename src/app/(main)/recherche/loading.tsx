import { SearchResultsSkeleton } from "@/components/skeleton";

export default function RechercheLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <SearchResultsSkeleton />
    </div>
  );
}
