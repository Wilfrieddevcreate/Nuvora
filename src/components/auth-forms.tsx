"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthActionButton, FormField } from "@/components/auth-screen";

/**
 * Champ mot de passe avec bouton œil pour afficher/masquer la saisie.
 * Même style que FormField, mais interactif (client).
 */
function PasswordField({
  label,
  placeholder,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-fg">{label}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 pr-11 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={
            visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted transition-colors hover:text-fg"
        >
          {visible ? (
            // œil barré
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a17.6 17.6 0 0 1-2.16 3.19M6.6 6.6A17.4 17.4 0 0 0 2 12s3 8 10 8a9.3 9.3 0 0 0 5.4-1.6" />
              <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
              <path d="M2 2l20 20" />
            </svg>
          ) : (
            // œil ouvert
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}

export function LoginForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/");
      }}
    >
      <div className="grid gap-4">
        <FormField
          label="Adresse e-mail"
          type="email"
          placeholder="vous@exemple.com"
          autoComplete="email"
        />
        <PasswordField
          label="Mot de passe"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-fg-2 select-none">
          <input
            type="checkbox"
            className="size-4 rounded border-border text-accent focus:ring-accent"
          />
          Se souvenir de moi
        </label>
        <Link
          href="/mot-de-passe-oublie"
          className="font-medium text-accent hover:text-accent-hover"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <AuthActionButton label="Se connecter" />
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        // Inscription réussie (maquette) → page de confirmation par code.
        router.push("/confirmation");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Prénom"
          placeholder="Amélie"
          autoComplete="given-name"
        />
        <FormField
          label="Nom"
          placeholder="Rossi"
          autoComplete="family-name"
        />
      </div>

      <FormField
        label="Adresse e-mail"
        type="email"
        placeholder="vous@exemple.com"
        autoComplete="email"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField
          label="Mot de passe"
          placeholder="Créer un mot de passe"
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirmer"
          placeholder="Répéter le mot de passe"
          autoComplete="new-password"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-fg-2 select-none">
        <input
          type="checkbox"
          className="mt-0.5 size-4 rounded border-border text-accent focus:ring-accent"
        />
        <span className="leading-relaxed">
          J’accepte les conditions d’utilisation et la politique de
          confidentialité.
        </span>
      </label>

      <AuthActionButton label="Créer mon compte" />
    </form>
  );
}
