"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] flex-1 items-center justify-center px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-bg p-8 shadow-soft text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[13px] font-medium text-fg-2">
          <span className="size-1.5 rounded-full bg-destructive" />
          Erreur inattendue
        </div>

        <h1 className="mt-6 text-2xl font-extrabold leading-tight sm:text-3xl">
          Oups, quelque chose s&rsquo;est mal passé
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-fg-2">
          {error.message
            ? error.message
            : "Une erreur inattendue s'est produite. Veuillez réessayer ou revenir à l'accueil."}
        </p>

        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted">
            Référence&nbsp;: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
          >
            Revenir à l&rsquo;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
