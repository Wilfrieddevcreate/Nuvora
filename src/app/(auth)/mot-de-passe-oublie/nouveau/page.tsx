import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth-screen";
import { NewPasswordForm } from "@/components/auth-flows";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  description: "Choisissez un nouveau mot de passe pour votre compte Nuvora.",
  robots: { index: false, follow: false },
};

export default function NewPasswordPage() {
  return (
    <AuthScreen
      title="Nouveau mot de passe"
      description="Choisissez un mot de passe sécurisé d'au moins 8 caractères."
      footerLabel="Vous vous en souvenez ?"
      footerHref="/connexion"
      footerLink="Se connecter"
      brandTitle="Presque terminé."
      brandPoints={[
        "Choisissez un mot de passe fort",
        "Ne le partagez jamais",
        "Vous serez reconnecté automatiquement",
      ]}
    >
      <NewPasswordForm />
    </AuthScreen>
  );
}
