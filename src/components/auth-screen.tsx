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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-smooth hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-md"
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
                className="inline-flex items-center gap-0.5 font-semibold text-accent link-underline hover:text-accent-hover"
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
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[15px] text-fg outline-none transition-smooth placeholder:text-fg-2 focus:border-accent focus:ring-4 focus:ring-accent-soft focus:bg-surface"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthActionButton({ label, pending }: { label: string; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-fg shadow-soft transition-smooth hover:bg-accent-hover hover:shadow-soft-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {pending ? "Chargement…" : label}
      {!pending && <ArrowRight className="size-4" />}
    </button>
  );
}

export function GoogleButton() {
  return (
    <a
      href="/api/auth/google"
      className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-5 py-2.5 text-[15px] font-medium text-fg shadow-soft transition-smooth hover:bg-surface-2 hover:border-border-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
          fill="#EA4335"
        />
      </svg>
      Continuer avec Google
    </a>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-5 flex items-center gap-3 text-sm text-muted">
      <div className="flex-1 border-t border-border" />
      <span>ou</span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}
