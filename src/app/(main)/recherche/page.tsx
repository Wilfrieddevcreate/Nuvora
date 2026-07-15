import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchResults } from "./results";

export const metadata: Metadata = {
  title: "Recherche",
  robots: { index: false, follow: true },
};

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Suspense>
        <SearchResults initialQuery={q} />
      </Suspense>
    </div>
  );
}
