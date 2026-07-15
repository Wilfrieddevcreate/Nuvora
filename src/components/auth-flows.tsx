"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthActionButton, FormField } from "@/components/auth-screen";
import { OtpInput } from "@/components/otp-input";

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
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted transition-colors hover:text-fg"
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
    </label>
  );
}

/**
 * Demande de réinitialisation : saisie de l'email → écran "email envoyé".
 * Maquette front : aucune vérification ni envoi réel.
 */
export function ForgotPasswordForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/mot-de-passe-oublie/envoye");
      }}
    >
      <FormField
        label="Adresse e-mail"
        type="email"
        placeholder="vous@exemple.com"
        autoComplete="email"
      />
      <AuthActionButton label="Envoyer le lien" />
    </form>
  );
}

/**
 * Saisie du nouveau mot de passe après clic sur le lien de réinitialisation.
 * Maquette front : redirige vers /connexion après soumission.
 */
export function NewPasswordForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/connexion");
      }}
    >
      <PasswordField
        label="Nouveau mot de passe"
        placeholder="Minimum 8 caractères"
        autoComplete="new-password"
      />
      <PasswordField
        label="Confirmer le mot de passe"
        placeholder="Répéter le mot de passe"
        autoComplete="new-password"
      />
      <AuthActionButton label="Enregistrer le mot de passe" />
    </form>
  );
}

/**
 * Confirmation de compte par code (OTP à 6 chiffres) reçu après inscription.
 * Maquette front : n'importe quel code redirige vers l'accueil.
 */
export function ConfirmationForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/");
      }}
    >
      <OtpInput length={6} />
      <AuthActionButton label="Confirmer mon compte" />

      <p className="text-center text-sm text-fg-2">
        Vous n’avez pas reçu le code ?{" "}
        <button
          type="button"
          className="font-semibold text-accent hover:text-accent-hover"
        >
          Renvoyer
        </button>
      </p>
    </form>
  );
}
