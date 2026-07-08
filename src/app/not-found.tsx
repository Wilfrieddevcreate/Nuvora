import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, SearchIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page introuvable — Nuvora",
};

const SUGGESTIONS = [
  { href: "/catalogue", label: "Parcourir le catalogue" },
  { href: "/assistant", label: "Demander à l’assistant IA" },
  { href: "/inscription", label: "Devenir créateur" },
];

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-24 sm:px-8">
      {/* halo doux d'arrière-plan */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,var(--accent-soft),transparent)]"
      />

      <div className="mx-auto max-w-lg text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[13px] font-medium text-fg-2">
          <span className="size-1.5 rounded-full bg-accent" />
          Erreur 404
        </div>

        <p className="mt-6 font-mono text-6xl font-extrabold tracking-tight text-accent sm:text-7xl">
          404
        </p>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
          Cette page est introuvable.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-lg text-fg-2">
          Le produit ou la page que vous cherchez n’existe pas, a été déplacé,
          ou n’est pas encore disponible. Repartez de la recherche.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" size="lg">
            Retour à l’accueil
            <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/catalogue" variant="secondary" size="lg">
            <SearchIcon className="size-4" />
            Explorer le catalogue
          </ButtonLink>
        </div>

        {/* liens utiles */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-sm font-medium text-muted">
            Ou peut-être cherchiez-vous à…
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <ButtonLink
                key={s.href}
                href={s.href}
                variant="ghost"
                size="sm"
                className="border border-border"
              >
                {s.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
