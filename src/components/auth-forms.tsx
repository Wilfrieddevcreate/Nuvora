"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { AuthActionButton, AuthDivider, FormField, GoogleButton } from "@/components/auth-screen";
import { login, signup, type AuthState } from "@/app/actions/auth";

function PasswordField({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  required,
  error,
}: {
  id: string;
  name?: string;
  label: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-fg">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-required={required ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 pr-11 text-[15px] text-fg outline-none transition-smooth placeholder:text-fg-2 focus:border-accent focus:ring-4 focus:ring-accent-soft focus:bg-surface"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted transition-smooth hover:text-fg active:scale-90"
        >
          {visible ? (
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a17.6 17.6 0 0 1-2.16 3.19M6.6 6.6A17.4 17.4 0 0 0 2 12s3 8 10 8a9.3 9.3 0 0 0 5.4-1.6" />
              <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
              <path d="M2 2l20 20" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function LoginForm({ oauthError }: { oauthError?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});

  return (
    <>
      <GoogleButton />
      <AuthDivider />
      <form className="space-y-4" action={action} noValidate>
      {(state.errors?.general || oauthError) && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {oauthError ?? state.errors?.general?.[0]}
        </p>
      )}

      <div className="grid gap-4">
        <FormField
          id="email-login"
          name="email"
          label="Adresse e-mail"
          type="email"
          placeholder="vous@exemple.com"
          autoComplete="email"
          required
          error={state.errors?.email?.[0]}
        />
        <PasswordField
          id="password-login"
          name="password"
          label="Mot de passe"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          error={state.errors?.password?.[0]}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-fg-2 select-none">
          <input
            id="remember-login"
            type="checkbox"
            className="size-4 rounded border-border text-accent focus:ring-accent"
          />
          Se souvenir de moi
        </label>
        <Link
          href="/mot-de-passe-oublie"
          className="font-medium text-accent link-underline hover:text-accent-hover"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <AuthActionButton label="Se connecter" pending={pending} />
      </form>
    </>
  );
}

export function SignupForm({ oauthError }: { oauthError?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, {});

  return (
    <>
      <GoogleButton />
      <AuthDivider />
      <form className="space-y-4" action={action} noValidate>
      {(state.errors?.general || oauthError) && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {oauthError ?? state.errors?.general?.[0]}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="firstName-signup"
          name="firstName"
          label="Prénom"
          placeholder="Amélie"
          autoComplete="given-name"
          required
          error={state.errors?.name?.[0]}
        />
        <FormField
          id="lastName-signup"
          name="lastName"
          label="Nom"
          placeholder="Rossi"
          autoComplete="family-name"
          required
        />
      </div>

      <FormField
        id="email-signup"
        name="email"
        label="Adresse e-mail"
        type="email"
        placeholder="vous@exemple.com"
        autoComplete="email"
        required
        error={state.errors?.email?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField
          id="password-signup"
          name="password"
          label="Mot de passe"
          placeholder="Créer un mot de passe"
          autoComplete="new-password"
          required
          error={state.errors?.password?.[0]}
        />
        <PasswordField
          id="confirm-signup"
          name="confirm"
          label="Confirmer"
          placeholder="Répéter le mot de passe"
          autoComplete="new-password"
          required
          error={state.errors?.confirm?.[0]}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-fg-2 select-none">
        <input
          id="terms-signup"
          type="checkbox"
          className="mt-0.5 size-4 rounded border-border text-accent focus:ring-accent"
        />
        <span className="leading-relaxed">
          J'accepte les conditions d'utilisation et la politique de confidentialité.
        </span>
      </label>

      <AuthActionButton label="Créer mon compte" pending={pending} />
      </form>
    </>
  );
}
