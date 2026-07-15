"use client";

import { useRouter } from "next/navigation";
import { AuthActionButton, FormField } from "@/components/auth-screen";
import { OtpInput } from "@/components/otp-input";

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
