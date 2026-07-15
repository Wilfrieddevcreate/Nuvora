import type { Metadata } from "next";
import { ConfirmationForm } from "@/components/auth-flows";
import { AuthScreen } from "@/components/auth-screen";

export const metadata: Metadata = {
  title: "Confirmer votre compte — Nuvora",
  description:
    "Saisissez le code de confirmation reçu par email pour activer votre compte Nuvora.",
};

export default function ConfirmationPage() {
  return (
    <AuthScreen
      title="Confirmez votre compte"
      description="Nous avons envoyé un code à 6 chiffres à votre adresse email. Saisissez-le ci-dessous pour activer votre compte."
      footerLabel="Mauvaise adresse ?"
      footerHref="/inscription"
      footerLink="Recommencer l’inscription"
      brandTitle="Une dernière étape avant de découvrir."
      brandPoints={[
        "Votre compte est presque prêt",
        "Le code expire dans 10 minutes",
        "Vérifiez vos spams si besoin",
      ]}
    >
      <ConfirmationForm />
    </AuthScreen>
  );
}
