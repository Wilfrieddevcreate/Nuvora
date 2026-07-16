import type { ReactNode } from "react";
import Link from "next/link";
import { LogoBadge, NovaMark } from "@/components/logo";
import { ArrowRight } from "@/components/icons";

type AuthScreenProps = {
  title: string;
  description: string;
  footerLabel: string;
  footerHref: string;
  footerLink: string;
  // Accroche du panneau de marque (colonne gauche, desktop)
  brandTitle: string;
  brandPoints: string[];
  children: ReactNode;
};

export function AuthScreen({
  title,
  description,
  footerLabel,
  footerHref,
  footerLink,
  brandTitle,
  brandPoints,
  children,
}: AuthScreenProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* ---- Panneau de marque (desktop uniquement) ---- */}
      <aside className="relative hidden overflow-hidden bg-accent p-12 lg:flex lg:flex-col lg:justify-between">
        {/* halos doux */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-black/10 blur-3xl"
        />
        {/* marque géante en filigrane */}
        <NovaMark
          aria-hidden
          className="pointer-events-none absolute -bottom-16 right-8 size-72 text-white/10"
          bg="transparent"
        />

        <Link
          href="/"
          className="relative inline-flex items-center gap-2.5 text-xl font-extrabold text-white"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-white/15">
            <NovaMark className="size-5 text-white" bg="transparent" />
          </span>
          Nuvora
        </Link>

        <div className="relative max-w-sm">
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            {brandTitle}
          </h2>
          <ul className="mt-6 space-y-3">
            {brandPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-white/90">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/20">
                  <svg viewBox="0 0 24 24" className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/70">
          Aucun paiement traité sur Nuvora. L’achat se fait chez le créateur.
        </p>
      </aside>

      {/* ---- Panneau formulaire ---- */}
      <div className="flex flex-col px-5 py-6 sm:px-8">
        {/* Barre haute : retour accueil (remplace le header absent) + logo mobile */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
            Accueil
          </Link>
          <Link href="/" className="lg:hidden" aria-label="Nuvora — accueil">
            <LogoBadge className="size-8" />
          </Link>
        </div>

        {/* Formulaire centré verticalement */}
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-[15px] text-fg-2">{description}</p>

            <div className="mt-8">{children}</div>

            <p className="mt-8 text-center text-sm text-fg-2">
              {footerLabel}{" "}
              <Link
                href={footerHref}
                className="inline-flex items-center gap-0.5 font-semibold text-accent hover:text-accent-hover"
              >
                {footerLink}
                <ArrowRight className="size-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Primitives de formulaire (réutilisées par login/signup) ---

export function FormField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  required,
  error,
}: {
  id: string;
  name?: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-fg">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthActionButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
    >
      {label}
      <ArrowRight className="size-4" />
    </button>
  );
}
